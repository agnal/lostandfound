// itemFactory.js

class LostItem {
    constructor(data) {
        this.type = "lost";
        Object.assign(this, data);
    }
}

class FoundItem {
    constructor(data) {
        this.type = "found";
        Object.assign(this, data);
    }
}

class ItemFactory {
    static createItem(type, data) {
        switch (type.toLowerCase()) {
            case "lost":
                return new LostItem(data);
            case "found":
                return new FoundItem(data);
            default:
                throw new Error(`Unknown item type: ${type}`);
        }
    }
}

module.exports = { ItemFactory };