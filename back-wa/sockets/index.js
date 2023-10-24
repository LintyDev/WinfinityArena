import 'dotenv/config';
import { Server } from 'socket.io';
import chatEvent from './chatEvent.js';

const webSockets = (server) => {
    // Websockets
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
        },
    });
    io.on('connection', (socket) => {
        // Gestion connexion socket + user connecté
        io.emit('users_count', io.engine.clientsCount);
        socket.on('disconnect', () => {
            io.emit('users_count', io.engine.clientsCount);
        });

        // Events
        chatEvent(socket, io);
    });
}

export default webSockets;