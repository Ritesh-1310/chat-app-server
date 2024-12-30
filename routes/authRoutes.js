const express = require("express");
const authenticate = require("../middlewares/authenticate");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.get("/logout", authenticate, authController.logoutUser);
router.put("/change-password", authenticate, authController.changeUserPassword);

module.exports = router;