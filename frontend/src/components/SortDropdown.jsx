// frontend/components/SortDropdown.jsx
import React from 'react';

const SortDropdown = ({ sortBy, setSortBy }) => {
  return (
    <div className="mb-4">
      <label className="mr-2 font-semibold">Sort by:</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="p-2 border rounded"
      >
        <option value="recent">Recently Added</option>
        <option value="verified">Verified</option>
        <option value="category">Category</option>
      </select>
    </div>
  );
};

export default SortDropdown;
