const SyncedRTCHandler = class {
    constructor(io) {
        this.io = io;
    }

    init = () => {
        this.io.on('connection', (socket) => {
            console.log('A user connected');
            socket.on('disconnect', (socket) => {
                console.log('User disconnected');
            });
        });        
    }
};

module.exports = SyncedRTCHandler;