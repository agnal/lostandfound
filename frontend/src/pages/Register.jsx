import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuBar } from '../components/MenuBar';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Label } from '../components/ui/Label';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 🧠 Validate password match
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      // ✅ Send registration request
      const response = await axiosInstance.post('/api/auth/register', {
        name,
        email,
        password,
      });

      // ✅ Automatically log user in (optional)
      login(response.data);
      alert('Registration successful!');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#a0f1bd] w-full min-h-screen relative">
      <MenuBar activeItem="Register" />

      <main className="flex flex-col items-center pt-20 pb-16 px-4">
        <h2 className="text-4xl font-semibold text-black text-center mb-12">
          Create an Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 w-full max-w-xl bg-white/80 backdrop-blur rounded-2xl p-10 shadow-lg"
        >
          {/* Full Name */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg text-black">Full Name</Label>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              required
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg text-black">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg text-black">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter a secure password"
              required
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-2">
            <Label className="text-lg text-black">Confirm Password</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter your password"
              required
              className="h-12 rounded border border-black bg-white"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#2d4f20] hover:bg-[#1f3517] text-white rounded-full py-3"
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>

          {/* Link to Login */}
          <p className="text-center text-sm text-[#2d4f20]/80">
            Already have an account?
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="ml-2 text-[#2d4f20] font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </form>
      </main>
    </div>
  );
};

export default Register;
