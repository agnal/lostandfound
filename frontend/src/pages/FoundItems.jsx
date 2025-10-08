import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuBar } from '../components/MenuBar';
import { FileUpload } from '../components/FileUpload';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const FoundItems = () => {
  const [itemType, setItemType] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadKey, setUploadKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append('title', itemType);
      data.append('description', description);
      data.append('category', category);
      data.append('type', 'found');
      if (uploadedFile) {
        data.append('image', uploadedFile);
      }

      await axiosInstance.post('/api/main/item', data, {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setItemType('');
      setDescription('');
      setCategory('');
      setUploadedFile(null);
      setUploadKey((value) => value + 1);
      alert('Found item reported successfully!');
      navigate('/lost-found-items');
    } catch (error) {
      alert('Failed to report item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-[#a0f1bd] min-h-screen">
        <MenuBar activeItem="Found Item" />
        <div className="max-w-xl mx-auto mt-24 bg-white/70 backdrop-blur rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-semibold text-[#2d4f20] mb-4">
            Please log in to report a found item.
          </h2>
          <p className="text-[#2d4f20]/80 mb-6">
            You need an account to share found items with the community.
          </p>
          <Button
            className="bg-[#2d4f20] hover:bg-[#1f3517] text-white"
            onClick={() => navigate('/login')}
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#a0f1bd] w-full min-h-screen relative">
      <MenuBar activeItem="Found Item" />

      <main className="flex flex-col items-center pt-20 pb-16 px-4">
        <h2 className="text-4xl font-semibold text-black text-center mb-12">
          Found Items
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-8 w-full max-w-2xl bg-white/80 backdrop-blur rounded-2xl p-10 shadow-lg"
        >
          <div className="w-full flex flex-col gap-3">
            <Label className="self-center text-2xl text-black">Item Type</Label>
            <Input
              value={itemType}
              onChange={(event) => setItemType(event.target.value)}
              placeholder="e.g., Laptop, Phone, Wallet"
              required
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          <div className="w-full flex flex-col gap-3">
            <Label className="self-center text-2xl text-black">Description</Label>
            <Input
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Add notes about the found item"
              required
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          <div className="w-full flex flex-col gap-3">
            <Label className="self-center text-2xl text-black">Category</Label>
            <Input
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              placeholder="e.g., Electronics, Personal, Clothing"
              required
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          <div className="w-full mt-4">
            <FileUpload key={uploadKey} onFileSelect={setUploadedFile} maxSize={5} />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-72 bg-[#2d4f20] hover:bg-[#1f3517] text-white rounded-full py-3"
          >
            {loading ? 'Reporting...' : 'Report Found Item'}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default FoundItems;
