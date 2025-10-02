const itemFacade = require("../services/facade/itemFacade");

// ✅ Create a new item
exports.createItem = async (req, res) => {
    try {
        const decoratedItem = await itemFacade.create(req.user, req.body, req.file);
        res.status(201).json(decoratedItem);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating item", error });
    }
};

// ✅ Get all items for logged-in user
exports.getItems = async (req, res) => {
    try {
        const items = await itemFacade.getUserItems(req.user);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items", error });
    }
};

// ✅ Get all items (with optional sorting)
exports.getAllItems = async (req, res) => {
    try {
        const { sortBy } = req.query;
        const items = await itemFacade.getAllItems(sortBy);
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: "Error fetching items", error });
    }
};

// ✅ Get single item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await itemFacade.getItemById(req.user, req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: "Error fetching item", error });
    }
};

// ✅ Update item
exports.updateItem = async (req, res) => {
    try {
        const updatedItem = await itemFacade.updateItem(req.user, req.params.id, req.body);
        if (!updatedItem) return res.status(404).json({ message: "Item not found" });
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Error updating item", error });
    }
};

// ✅ Delete item
exports.deleteItem = async (req, res) => {
    try {
        const deletedItem = await itemFacade.deleteItem(req.user, req.params.id);
        if (!deletedItem) return res.status(404).json({ message: "Item not found" });
        res.json({ message: "Item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting item", error });
    }
};
