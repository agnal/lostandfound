const Item = require("../models/Item");
const { addRecentlyAddedTag } = require('../services/decorators/itemDecorators');


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

    // Save item in DB first (so createdAt gets added)
    const savedItem = await newItem.save();

    // Apply decorators
     const decoratedItem = addRecentlyAddedTag(savedItem);

    
    res.status(201).json(decoratedItem);
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Error creating item", error });
  }
};

// ✅ Get all items for logged-in user
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find({ user_id: req.user._id }).sort({ createdAt: -1 });
     // Update recent status for each item
    // items = items.map(item => checkRecentStatus(item));
    items = items.map(item => addRecentlyAddedTag(item, 24));
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

// ✅ Get all items 
exports.geAllItems = async (req, res) => {
  try {
    let items = await Item.find().sort({ createdAt: -1 });
    items = items.map(item => addRecentlyAddedTag(item, 24));
    res.json(items);

    // res.json(items);
  } catch (error) {
    res.status(500).json({ message: "Error fetching items", error });
  }
};

// ✅ Get single item by ID
exports.getItemById = async (req, res) => {
  try {
    let item = await Item.findOne({ _id: req.params.id, user_id: req.user._id });

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
