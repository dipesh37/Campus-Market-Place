const mongoose = require("mongoose");

const lostItemSchema = new mongoose.Schema({
  itemName: {
    type: String,
    required: [true, "Please provide item name"],
    trim: true,
    minlength: [3, "Item name must be at least 3 characters"],
  },
  description: {
    type: String,
    required: [true, "Please provide description"],
    minlength: [10, "Description must be at least 10 characters"],
  },
  location: {
    type: String,
    required: [true, "Please provide location where item was lost"],
    trim: true,
  },
  dateLost: {
    type: Date,
    required: [true, "Please provide date when item was lost"],
  },
  contactNumber: {
    type: String,
    required: [true, "Please provide contact number"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    lowercase: true,
    trim: true,
    validate: {
      validator: function (email) {
        return email.endsWith("@nitj.ac.in");
      },
      message: "Please use your NITJ email address",
    },
  },
  image: {
    type: String, // Base64 encoded image string
    required: [true, "Please provide item image"],
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isFound: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("LostItem", lostItemSchema);
