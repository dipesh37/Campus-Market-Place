const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide product name"],
    trim: true,
    minlength: [3, "Product name must be at least 3 characters"],
  },
  category: {
    type: String,
    required: [true, "Please provide category"],
    trim: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: [true, "Please provide price"],
    min: [0, "Price cannot be negative"],
  },
  condition: {
    type: String,
    required: [true, "Please provide condition"],
    enum: ["Like New", "Excellent", "Very Good", "Good", "Fair"],
  },
  description: {
    type: String,
    required: [true, "Please provide description"],
    minlength: [10, "Description must be at least 10 characters"],
  },
  image: {
    type: String, // Base64 encoded image string
    required: [true, "Please provide product image"],
  },
  owner: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    branch: {
      type: String,
      required: true,
    },
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
