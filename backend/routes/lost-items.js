const express = require("express");
const router = express.Router();
const LostItem = require("../models/LostItem");
const { protect } = require("../middleware/auth");

// @route   GET /api/lost-items
// @desc    Get all lost items
// @access  Public
router.get("/", async (req, res) => {
  try {
    const lostItems = await LostItem.find({ isFound: false }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: lostItems.length,
      data: lostItems,
    });
  } catch (error) {
    console.error("Get lost items error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching lost items",
      error: error.message,
    });
  }
});

// @route   GET /api/lost-items/:id
// @desc    Get single lost item
// @access  Public
router.get("/:id", async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: lostItem,
    });
  } catch (error) {
    console.error("Get lost item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching lost item",
      error: error.message,
    });
  }
});

// @route   POST /api/lost-items
// @desc    Report new lost item
// @access  Private
router.post("/", protect, async (req, res) => {
  try {
    const {
      itemName,
      description,
      location,
      dateLost,
      contactNumber,
      email,
      image,
    } = req.body;

    // Validation
    if (!itemName || !description || !location || !dateLost) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    if (!contactNumber || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide contact information",
      });
    }

    // Check if email is NITJ email
    if (!email.endsWith("@nitj.ac.in")) {
      return res.status(400).json({
        success: false,
        message: "Please use your NITJ email address",
      });
    }

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image of the lost item",
      });
    }

    const lostItem = await LostItem.create({
      itemName,
      description,
      location,
      dateLost,
      contactNumber,
      email,
      image,
      reportedBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: lostItem,
      message: "Lost item reported successfully!",
    });
  } catch (error) {
    console.error("Report lost item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while reporting lost item",
      error: error.message,
    });
  }
});

// @route   PUT /api/lost-items/:id
// @desc    Update lost item (mark as found)
// @access  Private
router.put("/:id", protect, async (req, res) => {
  try {
    let lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
      });
    }

    // Check if user is the reporter
    if (lostItem.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this lost item",
      });
    }

    lostItem = await LostItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: lostItem,
    });
  } catch (error) {
    console.error("Update lost item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating lost item",
      error: error.message,
    });
  }
});

// @route   DELETE /api/lost-items/:id
// @desc    Delete lost item
// @access  Private
router.delete("/:id", protect, async (req, res) => {
  try {
    const lostItem = await LostItem.findById(req.params.id);

    if (!lostItem) {
      return res.status(404).json({
        success: false,
        message: "Lost item not found",
      });
    }

    // Check if user is the reporter
    if (lostItem.reportedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this lost item",
      });
    }

    await lostItem.deleteOne();

    res.status(200).json({
      success: true,
      message: "Lost item deleted successfully",
    });
  } catch (error) {
    console.error("Delete lost item error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting lost item",
      error: error.message,
    });
  }
});

module.exports = router;
