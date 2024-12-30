// routes/friendshipRoutes.js
const express = require("express");
const authenticate = require("../middlewares/authenticate");
const friendshipController = require("../controllers/friendshipController");

const router = express.Router();

router.post("/send-request", authenticate, friendshipController.sendFriendRequest);
router.put("/:id/accept", authenticate, friendshipController.acceptFriendRequest);
router.get("/friends", authenticate, friendshipController.getAllFriends);
router.delete("/:friendId", authenticate, friendshipController.deleteFriend);

module.exports = router;
