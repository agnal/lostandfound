import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const ItemForm = ({ item }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Other',   // ✅ Added category field
  });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title,
        description: item.description,
        category: item.category || 'Other', // ✅ Pre-fill category when editing
      });
    } else {
      setFormData({ title: '', description: '', category: 'Other' });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (item) {
        // For edit → no image upload
        const data = {
          title: formData.title,
          description: formData.description,
          category: formData.category, // ✅ send category
        };

        await axiosInstance.put(`/api/main/item/${item._id}`, data, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
      } else {
        // For create → allow image
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('category', formData.category); // ✅ send category
        if (image) data.append('image', image);

        await axiosInstance.post('/api/main/item', data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setFormData({ title: '', description: '', category: 'Other' });
      setImage(null);
      navigate('/');
    } catch (error) {
      console.log(error);
      alert('Failed to save task.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{item ? 'Edit Item' : 'Add Items'}</h1>

      {/* Title */}
      <input
        type="text"
        placeholder="Item name"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* Description */}
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />

      {/* ✅ Category Dropdown */}
      <select
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="Electronics">Electronics</option>
        <option value="Documents">Documents</option>
        <option value="Clothing">Clothing</option>
        <option value="Accessories">Accessories</option>
        <option value="Other">Other</option>
      </select>

      {/* Image Upload (only for create, not edit) */}
      {!item && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full mb-4 p-2 border rounded"
        />
      )}

      {/* Submit */}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {item ? 'Update Item' : 'Create Item'}
      </button>
    </form>
  );
};

export default ItemForm;




