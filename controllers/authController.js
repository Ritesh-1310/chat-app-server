const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assuming User schema is defined in ../models/User

// JWT Secret Key
const JWT_SECRET = process.env.JWT_SECRET; // Replace with an environment variable in production

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    const { fullName, userName, email, password, dob, gender} = req.body;

    // Ensure the dob is converted to a Date object
    const parsedDob = dob ? new Date(dob) : null;
    if (parsedDob && isNaN(parsedDob)) {
      return res.status(400).json({ message: "Invalid date format for dob" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullName,
      userName,
      email,
      password: hashedPassword,
      dob,
      gender,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Login user and return JWT
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    // Set a cookie with the JWT token
    res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000,
      secure: true, });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Logout user
exports.logoutUser = (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: "Logout successful" });
};

// Change user password
exports.changeUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
