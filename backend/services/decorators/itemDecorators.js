// backend/decorator.js
function addRecentlyAddedTag(item, expiryHours = 1) {
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

const addCategoryTag = (item) => {
  let categoryLabel = "General";

  switch (item.category) {
    case "Lost":
      categoryLabel = "Lost Item";
      break;
    case "Found":
      categoryLabel = "Found Item";
      break;
    case "Electronics":
      categoryLabel = "Electronic Device";
      break;
    case "Documents":
      categoryLabel = "Important Document";
      break;
    case "Clothes":
      categoryLabel = "Clothing / Apparel";
      break;
    default:
      categoryLabel = "Miscellaneous";
  }

  return {
    ...item.toObject(),
    categoryLabel,
  };
};

// ✅ New decorator: verified label
const addVerifiedTag = (item) => {
  return {
    ...item.toObject(),
    verifiedLabel: item.verified ? "Verified ✅" : "Not Verified ❌",
  };
};

// ✅ Compose multiple decorators easily
const decorateItem = (item) => {
  let decorated = addRecentlyAddedTag(item, 24);
  decorated = addCategoryTag(decorated);
  decorated = addVerifiedTag(decorated);
  return decorated;
};

module.exports = {
  addRecentlyAddedTag,
  addCategoryTag,
  addVerifiedTag,
  decorateItem,
};







// module.exports = { addRecentlyAddedTag };
