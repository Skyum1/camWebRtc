const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("offer", (offer, viewerId) => {
    // socket.broadcast.emit("offer", offer);
    io.to(viewerId).emit("offer", offer, socket.id);
  });

  socket.on("answer", (answer, viewerId) => {
    // socket.broadcast.emit("answer", answer, socket.id);
    io.to(viewerId).emit("answer", answer, socket.id);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate, socket.id);
  });

  socket.on('viewer-joined', () => {
    console.log('viewer-joined 수신');

    socket.broadcast.emit('viewer-joined', socket.id);
  });
});

server.listen(3000, () => {
  console.log("signaling server running");
});