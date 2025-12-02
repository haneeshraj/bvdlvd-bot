import express from 'express';
const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
app.get('/', (req, res) => {
    res.send('🩶 The Presence is online. The experiment continues.');
});
app.get('/health', (req, res) => {
    res.json({
        status: 'online',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        message: 'Bot is running'
    });
});
app.get('/ping', (req, res) => {
    res.send('pong');
});
export function startKeepAlive() {
    app.listen(PORT, '0.0.0.0', () => {
        console.log(`✅ Keep-alive server running on port ${PORT}`);
        console.log(`📡 Your ping URL will appear in the webview above`);
    });
}
//# sourceMappingURL=keep-alive.js.map