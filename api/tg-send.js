// CommonJS 版本（你之前可直接替换原文件）
module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || '*')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')
    if (req.method === 'OPTIONS') return res.status(200).end()

    try {
        // 读原始 body，兼容多种 Content-Type
        let raw = ''
        for await (const c of req) raw += c
        raw = raw.trim()

        let text = '', chatId = '', botKey = 'DEFAULT'
        const isJSON = (req.headers['content-type'] || '').includes('application/json')
        if (isJSON) {
            try {
                const obj = raw ? JSON.parse(raw) : (req.body || {})
                text = String(obj?.text ?? '')
                chatId = String(obj?.chat_id ?? '')
                botKey = String(obj?.bot ?? 'DEFAULT').toUpperCase()
            } catch { /* 回落到表单 */ }
        }
        if (!text || !chatId) {
            const form = new URLSearchParams(raw)
            text = text || String(form.get('text') || '')
            chatId = chatId || String(form.get('chat_id') || '')
            botKey = (form.get('bot') || botKey).toUpperCase()
        }

        if (!text) return res.status(200).json({ ok: false, error: 'TEXT_REQUIRED' })
        if (!chatId) return res.status(200).json({ ok: false, error: 'CHAT_ID_REQUIRED' })

        // === 关键：根据 botKey 选不同的 token ===
        const tokenMap = {
            DEFAULT: process.env.TG_BOT_TOKEN_DEFAULT,
            ORDER: process.env.TG_BOT_TOKEN_ORDER,   // 订单页面用
            CFM: process.env.TG_BOT_TOKEN_CFM      // cfmOrder 页面用
        }
        const token = tokenMap[botKey] || tokenMap.DEFAULT
        if (!token) return res.status(200).json({ ok: false, error: `MISSING_TOKEN_FOR_${botKey}` })

        // 发给 Telegram（表单最稳）
        const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`
        const body = new URLSearchParams({ chat_id: chatId, text, parse_mode: 'HTML' })

        const r = await fetch(tgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        })
        const data = await r.json().catch(() => ({}))
        return res.status(200).json(data)
    } catch (e) {
        return res.status(200).json({ ok: false, error: e?.message || 'REQUEST_FAILED' })
    }
}
