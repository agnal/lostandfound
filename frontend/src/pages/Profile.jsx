import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import { MenuBar } from '../components/MenuBar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';


const Profile = () => {
  const { user } = useAuth(); // Access user token from context
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    university: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          university: response.data.university || '',
          address: response.data.address || '',
        });
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
   <div className="min-h-screen bg-[#f5fff9]">
      <MenuBar />
      <div className="max-w-xl mx-auto mt-16 px-4">
        <form onSubmit={handleSubmit} className="bg-white/90 backdrop-blur rounded-2xl p-8 shadow-lg flex flex-col gap-5">
          <h1 className="text-3xl font-semibold text-[#2d4f20] text-center">Your Profile</h1>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#2d4f20]">Name</Label>
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#2d4f20]">Email</Label>
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#2d4f20]">University</Label>
            <Input
              type="text"
              placeholder="University"
              value={formData.university}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="text-sm text-[#2d4f20]">Address</Label>
            <Input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-[#2d4f20] hover:bg-[#1f3517] text-white rounded-full py-3">
            {loading ? 'Updating...' : 'Update Profile'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
