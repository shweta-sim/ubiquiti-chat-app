const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getAllUsers } = require('./helpers.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { pingTimeout: 5000, pingInterval: 3000 });
const room = 'defaultRoom';

io.on('connection', socket => {
  socket.on('login', ({ name }, callback) => {
    const { error, user } = addUser({ id: socket.id, name });

    if (error) return callback(error);

    socket.emit('message', {
      user: 'admin',
      text: `Hi ${user.name}, welcome to Ubiquity Chat!`
    });

    socket.broadcast.to(room).emit('message', {
      user: 'admin',
      text: `${user.name} has joined the chat`
    });

    socket.join(room);

    io.to(room).emit('roomData', {
      room: room,
      users: getAllUsers(room)
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(room).emit('message', { user: user.name, text: message });
    io.to(room).emit('roomData', {
      room: room,
      users: getAllUsers(room)
    });

    callback();
  });

  socket.on('connect_timeout', timeout => {
    const user = getUser(socket.id);
    socket.broadcast.to(room).emit('message', {
      user: 'admin',
      text: `${user.name} was disconnected due to inactivity.`
    });
    console.log('Timed out. User is disconnected due to inactivity.');
  });

  socket.on('disconnect', reason => {
    const user = removeUser(socket.id);

    if (user) {
      if (reason === 'transport close') {
        socket.broadcast.to(room).emit('message', {
          user: 'admin',
          text: `${user.name} left the chat, connection lost.`
        });
        console.log(
          'User has left the chat, connection lost. Reason: ',
          reason
        );
      } else if (reason === 'ping timeout') {
        socket.broadcast.to(room).emit('message', {
          user: 'admin',
          text: `${user.name} was disconnected due to inactivity.`
        });
        console.log('User is disconnected due to inactivity. Reason: ', reason);
      } else {
        socket.broadcast.to(room).emit('message', {
          user: 'admin',
          text: `${user.name} left the chat, connection lost.`
        });
      }
      console.log('User has left the chat, connection lost. Reason: ', reason);
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

console.log(`This process is PID: ${process.pid}`);

const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
sigs.forEach(sig => {
  process.on(sig, () => {
    // Stops the server from accepting new connections and finishes existing connections.
    server.close(err => {
      console.log('Trying to kill in signals - ', err);
      if (err) {
        console.error('Process shutdown... ', err);
        process.exit(1);
      }
    });
  });
});
