// routes/chatRoutes.js
const express = require("express");
const authenticate = require("../middlewares/authenticate");
const chatController = require("../controllers/chatController");

const router = express.Router();

router.post("/create", authenticate, chatController.createChat);
router.get("/:id", authenticate, chatController.getChatById);
router.get("/user/chats", authenticate, chatController.getChatsForUser);
router.put("/:id/add-message", authenticate, chatController.addMessageToChat);
router.delete("/:id", authenticate, chatController.deleteChat);

module.exports = router;