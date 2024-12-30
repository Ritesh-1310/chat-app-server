const mongoose = require('mongoose');

const chatroomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: null, // Null for one-on-one chats; name for groups
    },
    isGroupChat: {
      type: Boolean,
      default: false, // False for one-on-one chats
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference users in the chatroom
        required: true,
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Who created the group
      required: function () {
        return this.isGroupChat; // Only required for groups
      },
    },
    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',  // Reference to the Message model
      },
    ], // Add this field to store message references
  },
  { timestamps: true }
);

const Chatroom = mongoose.model('Chatroom', chatroomSchema);
module.exports = Chatroom;
