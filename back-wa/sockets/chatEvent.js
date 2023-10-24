const chatEvent = (socket, io) => {
    socket.on('chat_message', (msg) => {
        io.emit('chat_message', msg);
    });
}

export default chatEvent;