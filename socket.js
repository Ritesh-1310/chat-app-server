const express = require("express");
const router = express.Router();

const clients = {}; // Map to store user ID to socket mappings

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("Connected");
    console.log(`${socket.id} has joined`);

    // Sign in event
    socket.on("signin", (id) => {
      if (!id) {
        console.error("Received signin with invalid user ID");
        return;
      }

      console.log(`User ${id} is signing in with socket ID: ${socket.id}`);

      // Map the user ID to the socket instance
      clients[id] = socket;

      // Debugging the clients object
      console.log("Updated clients mapping:", Object.keys(clients));
    });

    // Message event: Sending messages to a specific user
    socket.on("message", (msg) => {
      const { chatroomId, senderId, content, participants } = msg;

      // Check if required fields are present
      if (!chatroomId || !senderId || !content || !Array.isArray(participants)) {
        console.error("Invalid message payload received:", msg);
        socket.emit("error", { error: "Invalid message payload" });
        return;
      }

      console.log("Message received:", msg);

      // Broadcast message to all participants in the chatroom
      participants.forEach((participantId) => {
        if (clients[participantId]) {
          console.log(`Delivering message to user ${participantId}`);
          clients[participantId].emit("message", {
            chatroomId,
            senderId: msg.senderId,
            content,
            participants
          });
        } else {
          console.log(`User ${participantId} is not online.`);
        }
      });
    });

    // Typing indicator event
    socket.on("typing", ({ senderId, receiverId }) => {
      if (clients[receiverId]) {
        clients[receiverId].emit("typing", { senderId });
      }
    });

    // Stop typing indicator event
    socket.on("stop-typing", ({ senderId, receiverId }) => {
      if (clients[receiverId]) {
        clients[receiverId].emit("stop-typing", { senderId });
      }
    });

    // Disconnect event: Remove user from the clients map
    socket.on("disconnect", () => {
      console.log(`${socket.id} has disconnected`);

      // Remove the disconnected client from the mapping
      for (const id in clients) {
        if (clients[id] === socket) {
          console.log(`Removing user ${id} from clients`);
          delete clients[id];
          break;
        }
      }

      // Emit the updated list of online users
      io.emit("online-users", Object.keys(clients));
    });

    // Mark message as read event
    socket.on("mark-as-read", ({ messageId, receiverId }) => {
      if (clients[receiverId]) {
        clients[receiverId].emit("message-read", { messageId });
      }
    });

    // Group chat functionality: Join room event
    socket.on("join-room", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room: ${roomId}`);
    });

    // Group message event: Broadcast message to all users in the room
    socket.on("group-message", ({ roomId, message }) => {
      io.to(roomId).emit("group-message", message);
      console.log(`Broadcasting group message to room ${roomId}: ${message}`);
    });
  });
};

module.exports = socketHandler;
