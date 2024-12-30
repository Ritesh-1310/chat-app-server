const express = require("express");
const authenticate = require("../middlewares/authenticate");
const userController = require("../controllers/userController");

const router = express.Router();


router.get("/profile", authenticate, userController.getUserProfile);
router.put("/profile", authenticate, userController.updateUserProfile);
router.get("/:id", authenticate, userController.getUserById);
router.get("/", authenticate, userController.getAllUsers);
router.delete("/:id", authenticate, userController.deleteUser);

module.exports = router;