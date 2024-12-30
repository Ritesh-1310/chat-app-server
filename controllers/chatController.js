// controllers/chatController.js
const Chatroom = require("../models/chatroom");
const mongoose = require("mongoose");


// Create a new chat
exports.createChat = async (req, res) => {
  try {
    const { participants, isGroupChat, name, createdBy } = req.body;

    // Check if participants are provided
    if (!participants || participants.length < 2) {
      return res.status(400).json({ message: 'At least two participants are required for a chat.' });
    }

    // If it's a group chat, make sure 'name' and 'createdBy' are provided
    if (isGroupChat && (!name || !createdBy)) {
      return res.status(400).json({ message: 'Group name and creator are required for group chat.' });
    }

    const chatroom = new Chatroom({
      name,
      isGroupChat,
      participants,
      createdBy: isGroupChat ? createdBy : null,  // 'createdBy' is required only for group chats
    });

    await chatroom.save();

    res.status(201).json({ message: 'Chatroom created successfully', chatroom });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get chat by ID
exports.getChatById = async (req, res) => {
  try {
    const chatroom = await Chatroom.findById(req.params.id).populate("participants");

    if (!chatroom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }

    res.status(200).json(chatroom);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get all chats for a user
exports.getChatsForUser = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Fetch chatrooms where the user is a participant
    const chats = await Chatroom.find({ participants: userObjectId })
      .populate("participants", "fullName userName email") // Correct field names
      .exec();

    if (!chats.length) {
      return res.status(404).json({ message: "No chats found for this user" });
    }

    // Process chats to include dynamic names for individual chats
    const processedChats = chats.map((chat) => {
      if (!chat.isGroupChat) {
        // For individual chats, find the other participant
        const otherParticipant = chat.participants.find(
          (participant) => participant._id.toString() !== userId
        );

        chat = {
          ...chat.toObject(),
          name: otherParticipant
            ? `${otherParticipant.fullName}`
            : null,
        };
      }
      return chat;
    });

    res.status(200).json(processedChats);
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({ message: "Server error", error });
  }
};



// Add a message to a chat
exports.addMessageToChat = async (req, res) => {
  try {
    const { message } = req.body;

    // Validate that message contains a valid _id
    if (!message || !message._id) {
      return res.status(400).json({ message: "Invalid message data" });
    }

    const chatroom = await Chatroom.findById(req.params.id);
    if (!chatroom) {
      return res.status(404).json({ message: "Chat not found" });
    }

    chatroom.messages.push(message._id); // Push only the valid _id
    await chatroom.save();

    res.status(200).json({ message: "Message added successfully", chatroom });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


// Delete a chat
exports.deleteChat = async (req, res) => {
  try {
    const chatroom = await Chatroom.findByIdAndDelete(req.params.id);

    if (!chatroom) {
      return res.status(404).json({ message: "Chatroom not found" });
    }

    res.status(200).json({ message: "Chatroom deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
