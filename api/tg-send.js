export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST,OPTIONS',
    };
    if (req.method === 'OPTIONS')
        return new Response(null, { status: 204, headers });

    try {
        const body = await req.text();
        const obj = JSON.parse(body || '{}');
        const text = String(obj.text || '');
        const chatId = String(obj.chat_id || '');
        const botKey = String(obj.bot || 'DEFAULT').toUpperCase();

        const tokenMap = {
            DEFAULT: process.env.TG_BOT_TOKEN_DEFAULT,
            ORDER: process.env.TG_BOT_TOKEN_ORDER,
            CFM: process.env.TG_BOT_TOKEN_CFM,
        };
        const token = tokenMap[botKey] || tokenMap.DEFAULT;
        if (!token)
            return new Response(
                JSON.stringify({ ok: false, error: `MISSING_TOKEN_FOR_${botKey}` }),
                { status: 200, headers }
            );

        const tgUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        const form = new URLSearchParams({
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
        });
        const r = await fetch(tgUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: form,
        });
        const data = await r.json();
        return new Response(JSON.stringify(data), { status: 200, headers });
    } catch (e) {
        return new Response(
            JSON.stringify({ ok: false, error: e.message || 'FAILED' }),
            { status: 200, headers }
        );
    }
}
