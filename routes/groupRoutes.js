// routes/groupRoutes.js
const express = require("express");
const authenticate = require("../middlewares/authenticate");
const groupController = require("../controllers/groupController");

const router = express.Router();

router.post("/create", authenticate, groupController.createGroup);
router.get("/:id", authenticate, groupController.getGroupById);
router.put("/:id/add-member", authenticate, groupController.addMemberToGroup);
router.delete("/:id", authenticate, groupController.deleteGroup);

module.exports = router;
