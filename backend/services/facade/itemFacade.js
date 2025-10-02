const Item = require("../../models/Item");
const { decorateItem } = require("../decorators/itemDecorators");

class ItemFacade {
    // Create and decorate item
    async create(user, itemData, file) {
        const newItem = new Item({
            ...itemData,
            image: file ? `/uploads/${file.filename}` : null,
            user_id: user._id,
        });

        const savedItem = await newItem.save();
        const decoratedItem = decorateItem(savedItem);
        return decoratedItem;
    }

    // Get items for a specific user
    async getUserItems(user) {
        let items = await Item.find({ user_id: user._id }).sort({ createdAt: -1 });
        items = items.map(item => decorateItem(item));
        return items;
    }

    // Get all items with optional sorting
    async getAllItems(sortBy) {
        let items = await Item.find().sort({ createdAt: -1 });
        items = items.map(item => decorateItem(item));

        switch (sortBy) {
            case 'recent':
                items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'verified':
                items.sort((a, b) => (b.verified === true) - (a.verified === true));
                break;
            case 'category':
                items.sort((a, b) => a.category.localeCompare(b.category));
                break;
            default:
                items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return items;
    }

    // Get single item by ID
    async getItemById(user, itemId) {
        return await Item.findOne({ _id: itemId, user_id: user._id });
    }

    // Update item
    async updateItem(user, itemId, updateData) {
        return await Item.findOneAndUpdate(
            { _id: itemId, user_id: user._id },
            updateData,
            { new: true, runValidators: true }
        );
    }

    // Delete item
    async deleteItem(user, itemId) {
        return await Item.findOneAndDelete({ _id: itemId, user_id: user._id });
    }
}

module.exports = new ItemFacade();
