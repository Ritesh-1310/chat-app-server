// controllers/messageController.js
const Message = require("../models/message");
const Chatroom = require("../models/chatroom");

// Send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { chatroom, sender, content, type, mediaUrl, isRead } = req.body;

    // Verify that the chatroom ID is valid
    const chat = await Chatroom.findById(chatroom);
    if (!chat) {
      console.log(`Chatroom with ID ${chatroom} not found.`);
      return res.status(404).json({ message: "Chat not found" });
    }

    // Ensure the chatroom has the 'messages' field
    if (!chat.messages) {
      console.log('Messages field is missing in chatroom document');
      return res.status(400).json({ message: "Messages field is missing in chatroom" });
    }

    // Create new message
    const newMessage = new Message({
      chatroom,
      sender,
      content,
      type,
      mediaUrl,
      isRead,
    });

    await newMessage.save();

    // Push the new message to the chatroom's messages array
    chat.messages.push(newMessage._id);
    await chat.save();

    res.status(201).json({ message: "Message sent successfully", newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a message by ID
exports.getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);

    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

