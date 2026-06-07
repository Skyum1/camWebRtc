const express = require("express");
const http = require("http");
const path = require("path");
const { Server } = require("socket.io");

const app = express();

app.use(express.static(path.join(__dirname, "dist")));

app.get(/^\/(?!socket\.io).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("connected:", socket.id);

  socket.on("offer", (offer, viewerId) => {
    io.to(viewerId).emit("offer", offer, socket.id);
  });

  socket.on("answer", (answer, viewerId) => {
    io.to(viewerId).emit("answer", answer, socket.id);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate, socket.id);
  });

  socket.on("viewer-joined", () => {
    socket.broadcast.emit("viewer-joined", socket.id);
  });
});

server.listen(3000, "0.0.0.0", () => {
  console.log("signaling server running");
});