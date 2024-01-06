const express = require("express");
const router = express.Router();
const User = require("../models/user");
// const nodemailer = require("nodemailer");
const crypto = require("crypto");

router.post("/register", async (req, res) => {
  try {
    // Create a new user
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    // Find user by email and compare password
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // Generate a token and send it in the response
    const token = await user.generateAuthToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ... other auth-related routes (logout, password reset, etc.)
router.post("/forget-password", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        message: "The user not found!!!",
      });
    }
    //generate password reset token here
    const resetToken = crypto.ramdomBytes(32).toString("hex");
    await user.updateOne({ resetToken });

    //send password reset email
    await sendPasswordResetEmail(user.email, resetToken);

    res.json({ message: "password reset email sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error sending password reset email" });
  }
});

//reset password using the token
router.post("/reset-password", async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    const user = await User.findOne({ resetToken });

    if (!user) {
      return res.status(404).json({ message: "Invalid reset" });
    }

    //now here reset the token
    user.resetToken = undefined;
    await user.save();

    //here update password!
    user.password = await user.hashPassword(newPassword);
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error resetting password!" });
  }
});

// async function sendPasswordResetEmail (email, resetToken) {
//   //here it configure the email settings using the nodemailer!!!
//   const transporter = nodemailer.createTransport({
//     // ... your email provider settings
//   });

//   const mailOptions = {
//     from: "your-email@example.com",
//     to: email,
//     subject: "Password Reset",
//     text: `Click this link to reset your password: http://your-app-domain/reset-password/${resetToken}`,
//   };

//   await transporter.sendMail(mailOptions);
// }

module.exports = router;
// module.exports.registerUser = router.post("/register");
