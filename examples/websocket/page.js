"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SocketDemo;
const react_1 = require("react");
const socket_io_client_1 = require("socket.io-client");
const button_1 = require("@/components/ui/button");
const input_1 = require("@/components/ui/input");
const card_1 = require("@/components/ui/card");
const scroll_area_1 = require("@/components/ui/scroll-area");
function SocketDemo() {
    const [messages, setMessages] = (0, react_1.useState)([]);
    const [inputMessage, setInputMessage] = (0, react_1.useState)('');
    const [socket, setSocket] = (0, react_1.useState)(null);
    const [isConnected, setIsConnected] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const socketInstance = (0, socket_io_client_1.io)({
            path: '/api/socketio',
        });
        setSocket(socketInstance);
        socketInstance.on('connect', () => {
            setIsConnected(true);
        });
        socketInstance.on('disconnect', () => {
            setIsConnected(false);
        });
        socketInstance.on('message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });
        return () => {
            socketInstance.disconnect();
        };
    }, []);
    const sendMessage = () => {
        if (socket && inputMessage.trim()) {
            setMessages(prev => [...prev, {
                    text: inputMessage.trim(),
                    senderId: socket.id || 'user',
                    timestamp: new Date().toISOString()
                }]);
            socket.emit('message', {
                text: inputMessage.trim(),
                senderId: socket.id || 'user',
                timestamp: new Date().toISOString()
            });
            setInputMessage('');
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };
    return (<div className="container mx-auto p-4 max-w-2xl">
      <card_1.Card>
        <card_1.CardHeader>
          <card_1.CardTitle className="flex items-center justify-between">
            WebSocket Demo
            <span className={`text-sm px-2 py-1 rounded ${isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </card_1.CardTitle>
        </card_1.CardHeader>
        <card_1.CardContent className="space-y-4">
          <scroll_area_1.ScrollArea className="h-80 w-full border rounded-md p-4">
            <div className="space-y-2">
              {messages.length === 0 ? (<p className="text-gray-500 text-center">No messages yet</p>) : (messages.map((msg, index) => (<div key={index} className="border-b pb-2 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-700">
                          {msg.senderId}
                        </p>
                        <p className="text-gray-900">{msg.text}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>)))}
            </div>
          </scroll_area_1.ScrollArea>

          <div className="flex space-x-2">
            <input_1.Input value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} onKeyPress={handleKeyPress} placeholder="Type a message..." disabled={!isConnected} className="flex-1"/>
            <button_1.Button onClick={sendMessage} disabled={!isConnected || !inputMessage.trim()}>
              Send
            </button_1.Button>
          </div>
        </card_1.CardContent>
      </card_1.Card>
    </div>);
}
//# sourceMappingURL=page.js.map