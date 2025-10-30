const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend
    methods: ["GET", "POST"],
  },
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  // When a user joins with their name
  socket.on("join", (username) => {
    socket.username = username;
    io.emit("message", { user: "System", text: `${username} joined the chat.` });
  });

  // When a user sends a message
  socket.on("sendMessage", (message) => {
    io.emit("message", { user: socket.username, text: message });
  });

  // When user disconnects
  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("message", { user: "System", text: `${socket.username} left the chat.` });
    }
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Basic route
app.get("/", (req, res) => {
  res.send("Socket.io Chat Server Running...");
});

// Start server
const PORT = 5000;
server.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
