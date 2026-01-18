import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:8080",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:8080",
                "https://rabuste-omegon.vercel.app"
            ],
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    io.on('connection', (socket) => {
        console.log('Client connected:', socket.id);

        socket.on('join', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their notification room`);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized');
    }
    return io;
};

export const emitNotification = (userId, notification) => {
    if (io) {
        io.to(userId.toString()).emit('notification', notification);
    }
};
