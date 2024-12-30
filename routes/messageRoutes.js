// routes/messageRoutes.js
const express = require("express");
const authenticate = require("../middlewares/authenticate");
const messageController = require("../controllers/messageController");

const router = express.Router();

router.post("/send", authenticate, messageController.sendMessage);
router.get("/:id", authenticate, messageController.getMessageById);
router.delete("/:id", authenticate, messageController.deleteMessage);

module.exports = router;