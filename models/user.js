const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Invalid email format'],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profileImageUrl: {
      type: String,
      default: null,
    },
    dob: {
      type: Date, // Use Date to store birthdate
      default: null, // Set as required if mandatory
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'], // Restrict allowed values
      default: null, // Set as required if mandatory
    },
    phoneNumber: {
      type: String,
      default: null, // Set as required if mandatory
      // unique: true,
      match: [/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format'], // Regex for international numbers
    },
    status: {
      type: String,
      default: 'Available', // Default status
    },
    lastActive: {
      type: Date,
      default: Date.now, // Initialize with current date/time
    },
    contacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference other users
      },
    ],
    chatrooms: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatroom', // Reference group or individual chatrooms
      },
    ],
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
