require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const http = require("http");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const { Server } = require("socket.io");
const socketHandler = require("./socket");

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const groupRoutes = require("./routes/groupRoutes");
const friendshipRoutes = require("./routes/friendshipRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any origin
    methods: ["GET", "POST"],
  },
});

const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB successfully");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
});

// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  cors({
    origin: "*", // Allow any origin
    methods: ["GET", "POST"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

// Test route
app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to ChattingApp API" });
});

// Mount routes
app.use("/api/auth", authRoutes); // Auth-related routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/chats", chatRoutes); // Chat-related routes
app.use("/api/messages", messageRoutes); // Message-related routes
app.use("/api/groups", groupRoutes); // Group-related routes
app.use("/api/friendships", friendshipRoutes); // Friendship-related routes

// Initialize Socket.IO
socketHandler(io);

// Start the server
server.listen(port, "0.0.0.0", () => {
  console.log(`Server started on port: ${port}`);
});

