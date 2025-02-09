const logger = require('./utils/Logger');
const {Server} = require("socket.io");

const connectedAccounts = new Map(); // Keep track of connected users

const initializeWebSocket = (server) => {

    const io = new Server(server, {
        cors: {
            origin: [
                'http://localhost:5001',
                'https://cool-biscotti-36aad2.netlify.app'
            ],
            methods: ['GET', 'POST'],
        },
    });

    io.on('connection', (socket) => {
        logger.info(`Account connected: ${socket.id}`);
        // socket.emit("message", { message: "You are now registered!" });

        socket.on('register', (data) => {

            connectedAccounts.set(data.email, socket.id);
            logger.info(`Account ${data.email} registered with socket ID ${socket.id}`);
        });

        socket.on('transfer', (data) => {
            const receiverSocketId = connectedAccounts.get(data.receiver);
            if(receiverSocketId){
                io.to(receiverSocketId).emit('message', {message: `You get ${data.amount}$`});
            }
        });

        socket.on('disconnect', () => {
            connectedAccounts.forEach((value, key) => {
                if (value === socket.id) connectedAccounts.delete(key);
            });
            logger.info(`Account disconnected: ${socket.id}`);
        });
    });

    return io;
}

module.exports = { initializeWebSocket, connectedAccounts };
