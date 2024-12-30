// controllers/friendshipController.js
const Friendship = require("../models/friendship");

// Send a friend request
// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const { recipient } = req.body; // Only get recipient from the request body

    if (!recipient) {
      return res.status(400).json({ message: "Recipient is required" });
    }

    const newFriendship = new Friendship({
      requester: req.user.id, // The authenticated user is the requester
      recipient: recipient,   // The recipient is passed in the body
      status: "pending",      // Default status when a request is made
    });

    await newFriendship.save();

    res.status(201).json({ message: "Friend request sent", friendship: newFriendship });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const friendship = await Friendship.findById(req.params.id);

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }

    if (friendship.status !== "pending") {
      return res.status(400).json({ message: "Cannot accept this request" });
    }

    friendship.status = "accepted";
    await friendship.save();

    res.status(200).json({ message: "Friend request accepted", friendship });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all friends of a user
exports.getAllFriends = async (req, res) => {
  console.log("Authenticated user ID:", req.user.id);

  try {
    const friendships = await Friendship.find({
      $or: [
        { requester: req.user.id, status: "accepted" },
        { recipient: req.user.id, status: "accepted" },
      ],
    }).populate("requester recipient");

    const friends = friendships.map((friendship) =>
      friendship.requester._id.toString() === req.user.id.toString()
        ? friendship.recipient
        : friendship.requester
    );

    res.status(200).json(friends);
  } catch (error) {
    console.error(error); // Log the error for more detailed debugging
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a friend
exports.deleteFriend = async (req, res) => {
  try {
    const { friendId } = req.params;

    const friendship = await Friendship.findOneAndDelete({
      $or: [
        { sender: req.user.id, receiver: friendId },
        { sender: friendId, receiver: req.user.id },
      ],
      status: "accepted",
    });

    if (!friendship) {
      return res.status(404).json({ message: "Friendship not found" });
    }

    res.status(200).json({ message: "Friend deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

