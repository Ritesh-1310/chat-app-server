const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chatroom', // Reference the chatroom this message belongs to
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference the user who sent the message
      required: true,
    },
    content: {
      type: String,
      required: true, // Message content is mandatory
    },
    type: {
      type: String,
      enum: ['text', 'image', 'video', 'file'], // Different message types
      default: 'text',
    },
    mediaUrl: {
      type: String,
      default: null, // For image/video/file messages
    },
    isRead: {
      type: Boolean,
      default: false, // Track whether the message is read
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
