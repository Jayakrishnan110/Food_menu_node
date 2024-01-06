const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  Price: { type: Number, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category" },
});

module.exports = mongoose.model("Food", foodSchema);
