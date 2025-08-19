"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts - Next.js Standalone + Socket.IO
const socket_1 = require("@/lib/socket");
const http_1 = require("http");
const socket_io_1 = require("socket.io");
const next_1 = require("next");
const dev = process.env.NODE_ENV !== 'production';
const currentPort = 3000;
const hostname = '0.0.0.0';
// Custom server with Socket.IO integration
async function createCustomServer() {
    try {
        // Create Next.js app
        const nextApp = (0, next_1.default)({
            dev,
            dir: process.cwd(),
            // In production, use the current directory where .next is located
            conf: dev ? undefined : { distDir: './.next' }
        });
        await nextApp.prepare();
        const handle = nextApp.getRequestHandler();
        // Create HTTP server that will handle both Next.js and Socket.IO
        const server = (0, http_1.createServer)((req, res) => {
            // Skip socket.io requests from Next.js handler
            if (req.url?.startsWith('/api/socketio')) {
                return;
            }
            handle(req, res);
        });
        // Setup Socket.IO
        const io = new socket_io_1.Server(server, {
            path: '/api/socketio',
            cors: {
                origin: "*",
                methods: ["GET", "POST"]
            }
        });
        (0, socket_1.setupSocket)(io);
        // Start the server
        server.listen(currentPort, hostname, () => {
            console.log(`> Ready on http://${hostname}:${currentPort}`);
            console.log(`> Socket.IO server running at ws://${hostname}:${currentPort}/api/socketio`);
        });
    }
    catch (err) {
        console.error('Server startup error:', err);
        process.exit(1);
    }
}
// Start the server
createCustomServer();
//# sourceMappingURL=server.js.map