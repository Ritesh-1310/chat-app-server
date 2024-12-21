const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Allow only this origin
    methods: ["GET", "POST"],
  },
});

const port = 5000;

// Middleware
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: "*", // Allow only this origin
    methods: ["GET", "POST"], // Allowed HTTP methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
  })
);

var clients = {};

// Socket.IO setup
io.on("connection", (socket) => {
  console.log("Connected");
  console.log(socket.id, "has joined");

  socket.on("signin", (id) => {
    console.log(id);
    clients[id] = socket;
    console.log('clients:', clients);
  });

  socket.on("message", (msg) => {
    console.log(`msg:`, msg);
    let targetId = msg.targetId;
    if (clients[targetId]) clients[targetId].emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log(socket.name, "has disconnected");
    // Remove disconnected client from the `clients` object
    for (const id in clients) {
      if (clients[id] === socket) {
        delete clients[id];
        break;
      }
    }
  });
});

// Test route
app.get("/", (req, res) => {
  return res.status(200).json({ message: "This is ChattingApp API" });
});

// Start the server
server.listen(port, "0.0.0.0", () => {
  console.log("Server started at port:", port);
});

