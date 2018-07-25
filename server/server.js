const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const {generateMessage} = require('./utils/message');
const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {

    console.log('New user connected');
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the Node-Chat-App'));
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New User Joined'));

    socket.on('createMessage', (message, callback) => {
        console.log('Create Message', message);
        io.emit('newMessage', generateMessage(message.from, message.text));
        callback('This is from server');
    });

    
    socket.on('disconnect', () => {
        console.log('User was Disconnected');
    });
});

server.listen(port, () => {
    console.log('Server is up on port ' + port);
});
