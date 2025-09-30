// backend/decorator.js
function addRecentlyAddedTag(item, expiryHours = 24) {
  try {
    // Mongoose docs are objects, so convert them to plain JS objects safely
    const plainItem = item.toObject ? item.toObject() : item;

    if (!plainItem.createdAt) {
      return { ...plainItem, recentlyAdded: false };
    }

    const now = new Date();
    const createdAt = new Date(plainItem.createdAt);
    const diffHours = (now - createdAt) / (1000 * 60 * 60);

    return {
      ...plainItem,
      recentlyAdded: diffHours <= expiryHours, // ✅ true only if within expiry window
    };
  } catch (err) {
    console.error("Decorator error:", err.message);
    return { ...item, recentlyAdded: false };
  }
}

module.exports = { addRecentlyAddedTag };
