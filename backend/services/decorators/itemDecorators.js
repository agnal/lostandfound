function addRecentlyAddedTag(item, expiryMinutes = 2) {
  try {
    const plainItem = item.toObject ? item.toObject() : item;

    if (!plainItem.createdAt) {
      return { ...plainItem, recentlyAdded: false };
    }

    const now = new Date();
    const createdAt = new Date(plainItem.createdAt);
    const diffMinutes = (now - createdAt) / (1000 * 60);

    return {
      ...plainItem,
      recentlyAdded: diffMinutes <= expiryMinutes,
    };
  } catch (err) {
    console.error("Decorator error:", err.message);
    return { ...item, recentlyAdded: false };
  }
}

const addCategoryTag = (item) => {
  const plainItem = item.toObject ? item.toObject() : item;

  let categoryLabel = "Other";
  switch (plainItem.category) {
    case "Documents":
      categoryLabel = "Found Item";
      break;
    case "Electronics":
      categoryLabel = "Electronic Device";
      break;
    case "Clothing":
      categoryLabel = "Clothing";
      break;
    case "Accessories":
      categoryLabel = "Clothing / Apparel";
      break;
    default:
      categoryLabel = "Other";
  }

  return { ...plainItem, categoryLabel };
};

const addVerifiedTag = (item) => {
  const plainItem = item.toObject ? item.toObject() : item;
  return { ...plainItem, verifiedLabel: plainItem.verified ? "Verified ✅" : "Not Verified ❌" };
};

// ✅ Compose decorators safely
const decorateItem = (item) => {
  let decorated = addRecentlyAddedTag(item, 2); // 2 mins
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
