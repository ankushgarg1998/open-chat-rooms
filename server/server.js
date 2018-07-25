const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.emit('newMessage', {
        from: 'Admin',
        text: 'Welcome to the Node-Chat-App',
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: `New User joined`,
        createdAt: new Date().getTime()
    })

    socket.on('createMessage', (message) => {
        console.log('Create Message', message);
        message.createdAt = new Date().getTime();
        io.emit('newMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('User was Disconnected');
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});
