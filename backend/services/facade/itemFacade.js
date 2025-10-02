const { decorateItem } = require("../decorators/itemDecorators");
const MongoDBAdapter = require("../../adapters/MongoDBAdapter");

class ItemFacade {
    constructor(dbAdapter) {
        this.dbAdapter = dbAdapter;
    }

    async create(user, itemData, file) {
        const newItem = {
            ...itemData,
            image: file ? `/uploads/${file.filename}` : null,
            user_id: user._id,
        };

        const savedItem = await this.dbAdapter.createItem(newItem);
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
