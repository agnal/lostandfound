const express = require("express");
const path = require('path');
const {
  createItem,
  getItems,
  getItemById,
  updateItem,
  deleteItem,
  getAllItems
} = require("../controllers/mainController");
const { protect } = require("../services/middleware/authMiddleware");
const multer = require("multer");
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // folder where files are stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // get file extension
    const timestamp = Date.now(); // current timestamp
    cb(null, `${timestamp}${ext}`); 
  },
});
const upload = multer({ storage });

// ✅ Create a new item
router.post("/item", protect,upload.single("image"), createItem);

// ✅ Get all items for logged-in user
router.get("/items", protect, getItems);
router.get("/items/all", protect, getAllItems);


// ✅ Get single item by ID
router.get("/item/:id", protect, getItemById);

// ✅ Update item
router.put("/item/:id", protect, updateItem);

// ✅ Delete item
router.delete("/item/:id", protect, deleteItem);

module.exports = router;