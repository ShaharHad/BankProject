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

        socket.on('register', (data) => {
            if(!connectedAccounts.has(socket.id)){
                connectedAccounts.set(data.email, new Set());
            }
            connectedAccounts.get(data.email).add(socket.id);
            socket.email = data.email;
            logger.info(`Account ${data.email} registered with socket ID ${socket.id}`);
        });

        socket.on('transfer', (data) => {
            const receiverSockets = connectedAccounts.get(data.receiver);
            if(receiverSockets){
                receiverSockets.forEach((socketId) => {
                    io.to(socketId).emit('message', {message: `You received ${data.amount}$ from ${socket.email}`});
                })
                logger.info(`Received ${socket.id} received ${data.amount}`);
            }
        });

        socket.on('send_meeting_invitation', (data) => {
            const receiverSockets = connectedAccounts.get(data.receiver);
            if(receiverSockets){
                receiverSockets.forEach((socketId) => {
                    io.to(socketId).emit('get_meeting_invitation', data.link);
                })
                logger.info(`Account ${socket.email} send meeting invitation to ${data.receiver}`);
            }
        });

        socket.on('disconnect', () => {
            if(socket.email && connectedAccounts.has(socket.email)){
                const setOfSockets = connectedAccounts.get(socket.email);
                setOfSockets.delete(socket.id);
                logger.info(`Socket ID ${socket.id} removed for account ${socket.email}`);
                if(0 === setOfSockets.size){
                    connectedAccounts.delete(socket.email);
                    logger.info(`Account ${socket.email} completely disconnected`);
                }
            }
        });
    });

    return io;
}

module.exports = { initializeWebSocket, connectedAccounts };
