import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const navigationItems = [
  { label: 'Lost Item', href: '/lost-items' },
  { label: 'Found Item', href: '/found-items' },
  { label: 'Register', href: '/register' },
];

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.post('/api/auth/login', { email, password });
      login(response.data);
      navigate('/');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2a2a2a] relative overflow-hidden text-white">
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-[#4ade80] to-[#22c55e] rounded-full transform -translate-x-1/3 translate-y-1/3 opacity-90" />
        <div className="absolute bottom-20 left-20 w-[400px] h-[400px] bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-full opacity-80" />
        <div className="absolute bottom-40 left-40 w-[250px] h-[250px] bg-gradient-to-br from-[#16a34a] to-[#15803d] rounded-full opacity-70" />
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-[#a0f1bd] transform translate-x-1/4 -translate-y-1/4">
          <div className="w-full h-full bg-[#a0f1bd] rounded-bl-[300px] rounded-tl-[100px]" />
        </div>
        <div className="absolute top-20 right-0 w-[700px] h-[500px] bg-[#2a2a2a] transform translate-x-1/6 -translate-y-1/6">
          <div className="w-full h-full bg-[#2a2a2a] rounded-bl-[250px] rounded-tl-[80px]" />
        </div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-10 py-6">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="text-[#888] text-2xl font-bold tracking-wider hover:text-[#aaa] transition-colors"
        >
          BACK2YOU
        </button>

        <div className="flex items-center gap-6 bg-[#a0f1bd] px-6 py-2 rounded-full">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => navigate(item.href)}
              className="text-[#2d4f20] font-medium text-sm hover:opacity-70 transition-opacity"
            >
              {item.label}
            </button>
          ))}
          <Button className="bg-[#2d4f20] hover:bg-[#1f3517] text-white px-4 py-1 rounded-full text-sm">
            Login
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-sm">
          <div className="bg-[#2a2a2a]/80 backdrop-blur rounded-2xl p-8 border border-gray-700/50">
            <div className="text-center mb-8">
              <h1 className="text-white text-2xl font-light mb-2">Welcome Back</h1>
              <p className="text-gray-400 text-sm">Sign in to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#a0f1bd] focus:ring-2 focus:ring-[#a0f1bd]"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-gray-300 text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-[#1a1a1a] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:border-[#a0f1bd] focus:ring-2 focus:ring-[#a0f1bd]"
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
                className="w-full bg-[#a0f1bd] hover:bg-[#8ee6a8] text-[#2d4f20] font-semibold py-3 rounded-lg transition-colors mt-4"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              {/* Demo Info */}
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-xs mt-4">
                <p className="font-semibold mb-1">Demo Admin Credentials:</p>
                <p>Email: admin@back2you.com</p>
                <p>Password: admin123</p>
              </div>

              {/* Footer Links */}
              <div className="flex flex-col items-center space-y-3 mt-6 text-gray-400 text-sm">
                <button type="button" className="hover:text-[#a0f1bd] transition-colors">
                  Forgot your password?
                </button>
                <div>
                  Don’t have an account?
                  <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="text-[#a0f1bd] hover:text-[#8ee6a8] transition-colors font-medium ml-1"
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
