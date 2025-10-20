export const config = {
    runtime: 'edge',
};

export default async function handler(req) {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Telegram Proxy API</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            padding: 40px;
            max-width: 600px;
            width: 100%;
        }
        h1 {
            color: #2d3748;
            margin-bottom: 20px;
            font-size: 2rem;
        }
        .status {
            display: inline-block;
            background: #48bb78;
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 0.9rem;
            margin-bottom: 30px;
        }
        .info {
            background: #f7fafc;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .info h3 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 1.1rem;
        }
        .info p {
            color: #4a5568;
            line-height: 1.6;
            margin-bottom: 8px;
        }
        code {
            background: #edf2f7;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 0.9em;
            color: #d53f8c;
        }
        .endpoint {
            background: #2d3748;
            color: #68d391;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            overflow-x: auto;
        }
        footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 0.9rem;
            text-align: center;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📨 Telegram Proxy API</h1>
        <span class="status">🟢 Service Online</span>

        <div class="info">
            <h3>📋 API Endpoint</h3>
            <div class="endpoint">POST /api/tg-send</div>
            <p>Proxy API for sending messages to Telegram groups</p>
        </div>

        <div class="info">
            <h3>✨ Features</h3>
            <p>✓ Multiple bot configuration support</p>
            <p>✓ Automatic CORS handling</p>
            <p>✓ Fast response with Edge Runtime</p>
            <p>✓ HTML formatted messages</p>
        </div>

        <footer>
            Powered by Vercel Edge Runtime
        </footer>
    </div>
</body>
</html>
    `;

    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'text/html; charset=utf-8',
        },
    });
}
