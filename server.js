const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

let messages = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Send old messages
  socket.emit("previousMessages", messages);

  // Receive new message
  socket.on("sendMessage", (msg) => {
    const messageData = {
      id: socket.id,
      message: msg,
      time: new Date().toLocaleTimeString()
    };
    messages.push(messageData);
    io.emit("receiveMessage", messageData); // broadcast to all
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => console.log("Chat server running on port 5000"));
