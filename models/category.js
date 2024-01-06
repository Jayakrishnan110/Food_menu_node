const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
});

module.exports = mongoose.model("Category", categorySchema);
