// controllers/groupController.js
const Group = require("../models/group");

// Create a new group
exports.createGroup = async (req, res) => {
  try {
    const { name, members, description, admins, profileImageUrl } = req.body;

    // Ensure `admins` contains the group creator (if not already included)
    const adminList = admins || [];
    if (!adminList.includes(req.user.id)) {
      adminList.push(req.user.id); // Add the creator to the list of admins
    }

    const newGroup = new Group({
      name,
      members,
      description,
      admins: adminList,
      profileImageUrl, // Optional field
    });

    await newGroup.save();

    res.status(201).json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Get group by ID
exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members")
      .populate("admins"); // Correct field name from schema

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add a member to a group
exports.addMemberToGroup = async (req, res) => {
  try {
    const { memberId } = req.body;

    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    if (group.members.includes(memberId)) {
      return res.status(400).json({ message: "User is already a member" });
    }

    group.members.push(memberId);
    await group.save();

    res.status(200).json({ message: "Member added successfully", group });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a group
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByIdAndDelete(req.params.id);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
