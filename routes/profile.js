const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Get current user profile
router.get("/me", async (req, res) => {
  try {
    const user = req.user; // Using authenticated user from middleware
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update current user profile
router.put("/me", async (req, res) => {
  try {
    const user = req.user; // Using authenticated user from middleware
    const updatedUser = await User.findByIdAndUpdate(user._id, req.body, {
      new: true,
    });

    // Ensure password is not updated unintentionally
    if (updatedUser.password !== user.password) {
      res.status(400).json({ message: "Password cannot be updated here" });
      return;
    }

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Admin-only routes
router.get("/users", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
