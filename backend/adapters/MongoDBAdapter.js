const DatabaseAdapter = require("./DatabaseAdapter");
const Item = require("../models/Item");

class MongoDBAdapter extends DatabaseAdapter {
    async createItem(itemData) {
        const newItem = new Item(itemData);
        return await newItem.save();
    }

    async getUserItems(userId) {
        return await Item.find({ user_id: userId }).sort({ createdAt: -1 });
    }

    async getAllItems() {
        return await Item.find().sort({ createdAt: -1 });
    }

    async getItemById(userId, itemId) {
        return await Item.findOne({ _id: itemId, user_id: userId });
    }

    async updateItem(userId, itemId, updateData) {
        return await Item.findOneAndUpdate(
            { _id: itemId, user_id: userId },
            updateData,
            { new: true, runValidators: true }
        );
    }

    async deleteItem(userId, itemId) {
        return await Item.findOneAndDelete({ _id: itemId, user_id: userId });
    }
}

module.exports = MongoDBAdapter;