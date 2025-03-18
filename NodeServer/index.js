// Import socket.io and initialize it on port 8000
// The 'cors' configuration allows requests from any origin for testing purposes
const io = require('socket.io')(8000, {
    cors: {
        origin: "*", // Allows all origins for testing
        methods: ["GET", "POST"] // Permits GET and POST requests
    }
});

// Object to keep track of connected users
const users = {};

// Listen for new socket connections
io.on('connection', socket => {

    // If any new user joins, let other users connected to the server know
    socket.on('new-user-joined', name => {
        // Add the new user's name to the 'users' object with their socket ID
        users[socket.id] = name;
        // Broadcast to all other users that a new user has joined
        socket.broadcast.emit('user-joined', name);
    });

    // If any user sends a message, let other users connected to the server know
    socket.on('send', message => {
        // Broadcast the received message to all other connected users
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] });
    });

    // If any user disconnects, let other users connected to the server know
    socket.on('disconnect', message => {
        // Broadcast to all users that this user has left the chat
        socket.broadcast.emit('left', users[socket.id]);
        // Remove the disconnected user from the 'users' object
        delete users[socket.id];
    });
});
