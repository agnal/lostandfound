const Item = require("../models/Item");

// ✅ Create a new item
exports.createItem = async (req, res) => {
   try {
    const { title, description, deadline } = req.body;

    // multer makes uploaded file available at req.file
    const newItem = new Item({
      title,
      description,
      deadline,
      image: req.file ? `/uploads/${req.file.filename}` : null, // store path
      user_id: req.user._id, // from auth middleware
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Error creating item", error });
  }
};

// ✅ Get all items for logged-in user
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({ user_id: req.user._id }).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

// ✅ Get all items 
exports.geAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

// ✅ Get single item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findOne({ _id: req.params.id, user_id: req.user._id });

    if (!item) return res.status(404).json({ message: "Item not found" });

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching item", error });
  }
};

// ✅ Update item
exports.updateItem = async (req, res) => {
  try {
    const { title, description} = req.body;

    const updatedItem = await Item.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user._id }, // user check
      { title, description },
      { new: true, runValidators: true }
    );

    if (!updatedItem) return res.status(404).json({ message: "Item not found" });

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: "Error updating item", error });
  }
};

// ✅ Delete item
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findOneAndDelete({
      _id: req.params.id,
      user_id: req.user._id,
    });

    if (!deletedItem) return res.status(404).json({ message: "Item not found" });

    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting item", error });
  }
};
