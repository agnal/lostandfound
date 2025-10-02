class DatabaseAdapter {
    async createItem(itemData) {
        throw new Error("createItem() must be implemented");
    }

    async getUserItems(userId) {
        throw new Error("getUserItems() must be implemented");
    }

    async getAllItems() {
        throw new Error("getAllItems() must be implemented");
    }

    async getItemById(userId, itemId) {
        throw new Error("getItemById() must be implemented");
    }

    async updateItem(userId, itemId, updateData) {
        throw new Error("updateItem() must be implemented");
    }

    async deleteItem(userId, itemId) {
        throw new Error("deleteItem() must be implemented");
    }
}

module.exports = DatabaseAdapter;
