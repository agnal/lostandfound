const { decorateItem } = require("../decorators/itemDecorators");
const MongoDBAdapter = require("../../adapters/MongoDBAdapter");
const { ItemFactory } = require("../factory/itemFactory"); // <-- Import factory

class ItemFacade {
    constructor(dbAdapter) {
        this.dbAdapter = dbAdapter;
    }

    // Use Factory for item creation
    async create(user, itemData, file) {
        // Determine type from itemData.type
        const type = itemData.type || "lost"; // default to "lost" if not provided
        const newItemObject = ItemFactory.createItem(type, {
            ...itemData,
            image: file ? `/uploads/${file.filename}` : null,
            user_id: user._id,
        });

        // Save via adapter
        const savedItem = await this.dbAdapter.createItem(newItemObject);
        return decorateItem(savedItem);
    }

    async getUserItems(user) {
        let items = await this.dbAdapter.getUserItems(user._id);
        return items.map(item => decorateItem(item));
    }

    async getAllItems(sortBy) {
        let items = await this.dbAdapter.getAllItems();
        items = items.map(item => decorateItem(item));

        switch (sortBy) {
            case "recent":
                items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case "verified":
                items.sort((a, b) => (b.verified === true) - (a.verified === true));
                break;
            case "category":
                items.sort((a, b) => a.category.localeCompare(b.category));
                break;
            default:
                items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return items;
    }

    async getItemById(user, itemId) {
        return await this.dbAdapter.getItemById(user._id, itemId);
    }

    async updateItem(user, itemId, updateData) {
        return await this.dbAdapter.updateItem(user._id, itemId, updateData);
    }

    async deleteItem(user, itemId) {
        return await this.dbAdapter.deleteItem(user._id, itemId);
    }
}

// Inject MongoDBAdapter instance here
module.exports = new ItemFacade(new MongoDBAdapter());