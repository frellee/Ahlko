const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",  // Your React app's URL
    methods: ["GET", "POST"]
  }
});

const rooms = {};  // Store room codes and connections

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Create a room
  socket.on('create-room', () => {
    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    rooms[roomCode] = { users: [socket.id] };
    socket.join(roomCode);
    socket.emit('room-created', roomCode);
    console.log(`Room created: ${roomCode}`);
  });

  // Join a room
  socket.on('join-room', (roomCode) => {
    if (rooms[roomCode] && rooms[roomCode].users.length < 2) {
      socket.join(roomCode);
      rooms[roomCode].users.push(socket.id);
      io.to(roomCode).emit('both-connected');
      console.log(`User joined room: ${roomCode}`);
    } else {
      socket.emit('room-error', 'Invalid or full room');
    }
  });

  // Handle photo sharing
  socket.on('send-photo', (data) => {
    const { roomCode, photo } = data;
    socket.to(roomCode).emit('receive-photo', { photo });
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const roomCode in rooms) {
      rooms[roomCode].users = rooms[roomCode].users.filter(id => id !== socket.id);
      if (rooms[roomCode].users.length === 0) {
        delete rooms[roomCode];  // Remove empty rooms
      }
    }
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});
