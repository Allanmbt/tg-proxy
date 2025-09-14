// Vercel Serverless: /api/tg-send.js  (Node 18+)
export default async function handler(req, res) {
    // --- CORS ---
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOW_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    try {
        let text = '', chatId = '';

        // 支持 JSON 与 x-www-form-urlencoded
        if (req.headers['content-type']?.includes('application/json')) {
            const body = req.body || {};
            text = String(body.text ?? '');
            chatId = String(body.chat_id ?? process.env.TG_CHAT_ID ?? '');
        } else {
            const chunks = [];
            for await (const c of req) chunks.push(c);
            const raw = Buffer.concat(chunks).toString();
            const form = new URLSearchParams(raw);
            text = String(form.get('text') ?? '');
            chatId = String(form.get('chat_id') ?? process.env.TG_CHAT_ID ?? '');
        }

        if (!text) return res.status(200).json({ ok: false, error: 'TEXT_REQUIRED' });
        if (!chatId) return res.status(200).json({ ok: false, error: 'CHAT_ID_REQUIRED' });

        const token = process.env.TG_BOT_TOKEN;
        if (!token) return res.status(200).json({ ok: false, error: 'MISSING_TG_BOT_TOKEN' });

        const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        const body = new URLSearchParams({ chat_id: chatId, text, parse_mode: 'HTML' });

        const r = await fetch(tgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body
        });

        const data = await r.json().catch(() => ({}));
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({ ok: false, error: e?.message || 'REQUEST_FAILED' });
    }
}
