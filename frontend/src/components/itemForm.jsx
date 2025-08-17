import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { useNavigate } from 'react-router-dom';
const ItemForm = ({ item }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ title: '', description: '', });
  const [image, setImage] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {

    if (item) {
      
      setFormData({
        title: item.title,
        description: item.description,
        deadline: item.deadline,
      });
    } else {
      setFormData({ title: '', description: '', });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Build multipart form
    
      // if (image) data.append("image", image);

      let response;
      if (item) {
          const data = {}
      data["title"]= formData.title
      data["description"]= formData.description;
        response = await axiosInstance.put(
          `/api/main/item/${item._id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            
            },
          }
        );

      } else {
        const data = new FormData();
        data.append("title", formData.title);
        data.append("description", formData.description);
        if (image) data.append("image", image);
        response = await axiosInstance.post("/api/main/item", data, {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        });

      }


      setFormData({ title: "", description: "", deadline: "" });
      setImage(null);
      navigate('/')

    } catch (error) {
      console.log(error);

      alert("Failed to save task.");
    }
  };


  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
      <h1 className="text-2xl font-bold mb-4">{item ? 'Edit Item' : 'Add Items'}</h1>
      <input
        type="text"
        placeholder="Item name"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full mb-4 p-2 border rounded"
      />


      {!item && (
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="w-full mb-4 p-2 border rounded"
        />
      )}
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
        {item ? 'Update Item' : 'Create Item'}
      </button>
    </form>
  );
};

export default ItemForm;
