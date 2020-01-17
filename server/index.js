const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} = require('./helpers.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server, { pingTimeout: 5000, pingInterval: 3000 });
const room = 'defaultRoom';

io.on('connection', socket => {
  socket.on('login', ({ name }, callback) => {
    const { error, user } = addUser({ id: socket.id, name });

    if (error) return callback(getUsersInRoom(room));

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
      users: getUsersInRoom(room)
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(room).emit('message', { user: user.name, text: message });
    io.to(room).emit('roomData', {
      room: room,
      users: getUsersInRoom(room)
    });

    callback();
  });

  socket.on('connect_timeout', timeout => {
    const user = getUser(socket.id);
    socket.broadcast.to(room).emit('message', {
      user: 'admin',
      text: `${user.name} was disconnected due to inactivity.`
    });
    console.log('disconnected due to inactivity');
  });

  socket.on('disconnect', reason => {
    const user = removeUser(socket.id);

    if (user) {
      if (reason === 'transport close') {
        socket.broadcast.to(room).emit('message', {
          user: 'admin',
          text: `${user.name} left the chat, connection lost.`
        });
        console.log(reason, 'user left the chat, connection lost.');
      } else if (reason === 'ping timeout') {
        socket.broadcast.to(room).emit('message', {
          user: 'admin',
          text: `${user.name} was disconnected due to inactivity.`
        });
        console.log(reason, 'user disconnected due to inactivity.');
      } else {
        socket.broadcast.to(room).emit('message', {
          user: 'admin',
          text: `${user.name} left the chat, connection lost.`
        });
      }
      console.log(reason, 'user left the chat, connection lost.');
    }
  });
});

app.use(router);

const sigs = ['SIGINT', 'SIGTERM', 'SIGQUIT'];
sigs.forEach(sig => {
  process.on(sig, () => {
    // Stops the server from accepting new connections and finishes existing connections.
    server.close(err => {
      if (err) {
        console.error('process shutdown.......', err);
        process.exit(1);
      }
    });
  });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
