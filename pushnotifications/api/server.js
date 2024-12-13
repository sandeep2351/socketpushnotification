const express = require('express');
const http = require('http');
const ioserver = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = ioserver(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors('*'));
app.use(express.json());

// Map to store connected users
const connectedUsers = {};

// Listen for WebSocket connections
io.on("connection", (socket) => {
  const userID = socket.handshake.query.userID; // Get userID from query params

  if (userID === "user1") { // Allow only "user1" to connect
    console.log(`User ${userID} connected`);
    connectedUsers[userID] = socket.id;

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User ${userID} disconnected`);
      delete connectedUsers[userID];
    });
  } else {
    console.log(`Unauthorized connection attempt by user ${userID}`);
    socket.disconnect(); // Disconnect unauthorized users
  }
});

// POST route to send notifications
app.post('/send', (req, res) => {
  const { message, userID } = req.body; // Include userID in the request
  console.log(`Sending notification to ${userID}: ${message}`);

  const socketID = connectedUsers[userID];
  if (socketID) {
    io.to(socketID).emit('pushNotification', { message });
    res.status(200).send({ message: "Notification sent successfully" });
  } else {
    res.status(404).send({ message: "User not connected" });
  }
});

// Start the server
server.listen(5000, () => {
  console.log("server running on port 5000");
});
