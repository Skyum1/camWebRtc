const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

// 1. static 먼저
app.use(express.static(path.join(__dirname, "dist")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" },
});

// socket
io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("offer", (offer, viewerId) => {
    io.to(viewerId).emit("offer", offer, socket.id);
  });

  socket.on("answer", (answer, viewerId) => {
    io.to(viewerId).emit("answer", answer, socket.id);
  });

  socket.on("ice-candidate", (candidate, viewerId) => {
    io.to(viewerId).emit("ice-candidate", candidate, socket.id);
  });

  socket.on("viewer-joined", () => {
    socket.broadcast.emit("viewer-joined", socket.id);
  });
});

// 2. fallback 반드시 마지막
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

server.listen(3000, "0.0.0.0");