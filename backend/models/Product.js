const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product name"],
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Please provide product category"],
    enum: ["lamp", "book", "fan", "table", "blanket", "other"],
    lowercase: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide product price"],
    min: [0, "Price cannot be negative"],
  },
  condition: {
    type: String,
    required: [true, "Please specify product condition"],
    enum: ["Excellent", "Very Good", "Good", "Fair", "Like New"],
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
    maxlength: [500, "Description cannot exceed 500 characters"],
  },
  owner: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    email: String,
    phone: String,
    year: String,
    branch: String,
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5,
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
