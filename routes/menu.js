const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Food = require("../models/food");

// Register route
router.post("/register", async (req, res) => {
  try {
    // here create a new user
    const user = new User(req.body);
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// This is the Login route
router.post("/login", async (req, res) => {
  try {
    // here this find user by email and compare password
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await user.comparePassword(req.body.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // here it generate a token and send it in the response
    const token = await user.generateAuthToken();
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Here are the admin-only routes (protected by auth middleware)
router.post("/categories", async (req, res) => {
  try {
    const category = new Category(req.body);
    await category.save();
    res.json({ message: "Category added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/categories/:id", async (req, res) => {
  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    res.json(updatedCategory);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/foods", async (req, res) => {
  try {
    const food = new Food(req.body);
    await food.save();
    res.json({ message: "Food added successfully" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put("/foods/:id", async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// the public route for viewing the menu
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
