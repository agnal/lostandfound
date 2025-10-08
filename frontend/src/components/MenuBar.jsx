import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

const MENU_ITEMS = [
  { label: 'Lost Item', href: '/lost-items' },
  { label: 'Found Item', href: '/found-items' },
  { label: 'Browse Items', href: '/lost-found-items' },
  { label: 'Register', href: '/register' },
];

export const MenuBar = ({ activeItem }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (label, href) => {
    if (activeItem) {
      return activeItem === label;
    }
    return location.pathname === href;
  };

  const navigationItems = React.useMemo(() => {
    const items = [...MENU_ITEMS];
    if (user?.isAdmin) {
      items.push({ label: 'Admin', href: '/admin' });
    }
    return items;
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="w-full bg-[#a0f1bd] flex items-center justify-between px-10 py-6 z-10 relative shadow-sm">
      <div className="px-2 py-1">
        <Link to="/" className="cursor-pointer hover:opacity-80 transition-opacity">
          <h1 className="font-['Work_Sans'] font-bold text-black text-3xl leading-none tracking-tight">Back2You</h1>
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <nav className="flex items-center gap-8 px-4 py-2">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.href}
              className={`font-['Work_Sans'] font-medium text-sm leading-none whitespace-nowrap hover:opacity-70 transition-opacity ${
                isActive(item.label, item.href) ? 'text-[#2d4f20] font-semibold' : 'text-[#2d4f20]'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-[#2d4f20] text-sm font-medium">
              {user.isAdmin ? 'Admin' : user.name || 'User'}
            </span>
            <Button
              className="bg-[#2d4f20] hover:bg-[#1f3517] text-white px-6 py-3 rounded-full font-medium text-sm transition-colors"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        ) : (
          <Button
            className="bg-[#2d4f20] hover:bg-[#1f3517] text-white px-6 py-3 rounded-full font-medium text-sm transition-colors"
            onClick={() => navigate('/login')}
          >
            Login
          </Button>
        )}
      </div>
    </header>
  );
};