import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuBar } from '../components/MenuBar';
import { Button } from '../components/ui/Button';
import { ChevronDownIcon } from 'lucide-react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const categories = ['All', 'Electronics', 'Documents', 'Clothing', 'Accessories', 'Personal', 'Sports', 'Other'];
const dateFilters = ['All', 'Today', 'This week', 'This month'];
const sortOptions = ['Recent', 'Oldest', 'A-Z', 'Z-A'];

const API_BASE_URL = (axiosInstance.defaults.baseURL || '').replace(/\/$/, '');

const formatDisplayDate = (isoString) => {
  if (!isoString) return 'Unknown';
  const date = new Date(isoString);
  return date.toLocaleDateString();
};

const isToday = (date) => {
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

const isThisWeek = (date) => {
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);
  return date >= startOfWeek && date <= endOfWeek;
};

const isThisMonth = (date) => {
  const now = new Date();
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
};

const LostFoundItems = () => {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDate, setSelectedDate] = useState('All');
  const [selectedSort, setSelectedSort] = useState('Recent');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchItems = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axiosInstance.get('/api/main/items/all', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });

        const transformed = response.data.map((item) => ({
          id: item._id,
          name: item.title,
          description: item.description,
          status: (item.type || 'lost').toUpperCase(),
          category: item.category || 'Other',
          createdAt: item.createdAt,
          verified: Boolean(item.verified),
          image: item.image,
        }));

        setItems(transformed);
        setFilteredItems(transformed);
      } catch (err) {
        setError('Failed to load items. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [user]);

  useEffect(() => {
    let updated = [...items];

    if (selectedCategory !== 'All') {
      updated = updated.filter((item) => item.category === selectedCategory);
    }

    if (selectedDate !== 'All') {
      updated = updated.filter((item) => {
        const createdDate = new Date(item.createdAt);
        if (selectedDate === 'Today') {
          return isToday(createdDate);
        }
        if (selectedDate === 'This week') {
          return isThisWeek(createdDate);
        }
        if (selectedDate === 'This month') {
          return isThisMonth(createdDate);
        }
        return true;
      });
    }

    if (selectedSort === 'A-Z') {
      updated.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === 'Z-A') {
      updated.sort((a, b) => b.name.localeCompare(a.name));
    } else {
      updated.sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return selectedSort === 'Recent' ? dateB - dateA : dateA - dateB;
      });
    }

    setFilteredItems(updated);
  }, [items, selectedCategory, selectedDate, selectedSort]);

  const placeholderImage = useMemo(
    () =>
      'https://images.unsplash.com/photo-1515169067865-5387ec356754?w=400&h=300&fit=crop',
    [],
  );

  if (!user) {
    return (
      <div className="bg-white min-h-screen">
        <MenuBar activeItem="Browse Items" />
        <div className="max-w-xl mx-auto mt-24 bg-[#a0f1bd]/40 backdrop-blur rounded-2xl p-10 text-center">
          <h2 className="text-2xl font-semibold text-[#2d4f20] mb-4">Log in to browse items.</h2>
          <p className="text-[#2d4f20]/80 mb-6">Create an account or sign in to explore all lost and found listings.</p>
          <Button className="bg-[#2d4f20] hover:bg-[#1f3517] text-white" onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full min-h-screen relative">
      <MenuBar activeItem="Browse Items" />

      <div className="bg-gradient-to-r from-[#a0f1bd] to-[#8ee6a8] py-12">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-[#2d4f20] text-center mb-2">Lost &amp; Found Items</h1>
          <p className="text-[#2d4f20]/80 text-center text-lg">
            Browse through items waiting to be reunited with their owners
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {error && <div className="mb-6 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>}
        {loading ? (
          <div className="text-center text-lg text-gray-600">Loading items...</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="w-full lg:w-80 flex-shrink-0">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Filters</h2>

                <div className="space-y-8">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center justify-between">
                      Category
                      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    </h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            selectedCategory === category
                              ? 'bg-[#a0f1bd] text-[#2d4f20] shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center justify-between">
                      Date
                      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    </h3>
                    <div className="space-y-2">
                      {dateFilters.map((date) => (
                        <button
                          key={date}
                          onClick={() => setSelectedDate(date)}
                          className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            selectedDate === date
                              ? 'bg-[#a0f1bd] text-[#2d4f20] shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {date}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-4 flex items-center justify-between">
                      Sort by
                      <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                    </h3>
                    <div className="space-y-2">
                      {sortOptions.map((sort) => (
                        <button
                          key={sort}
                          onClick={() => setSelectedSort(sort)}
                          className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            selectedSort === sort
                              ? 'bg-[#a0f1bd] text-[#2d4f20] shadow-sm'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          {sort}
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedDate('All');
                      setSelectedSort('Recent');
                    }}
                    variant="outline"
                    className="w-full mt-6 border-gray-200 text-gray-600 hover:bg-gray-50"
                  >
                    Clear All Filters
                  </Button>
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <div className="flex items-center justify-between mb-6 text-gray-600">
                <p>
                  Showing <span className="font-medium text-gray-900">{filteredItems.length}</span> item{filteredItems.length === 1 ? '' : 's'}
                </p>
                <p>{filteredItems.filter((item) => item.verified).length} verified</p>
              </div>

              {filteredItems.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your filters to see more results.</p>
                  <Button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedDate('All');
                      setSelectedSort('Recent');
                    }}
                    className="bg-[#2d4f20] hover:bg-[#1f3517] text-white"
                  >
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredItems.map((item) => {
                    const imageUrl = item.image
                      ? item.image.startsWith('http')
                        ? item.image
                        : `${API_BASE_URL}${item.image}`
                      : placeholderImage;
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all duration-200"
                      >
                        <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                          <img
                            src={imageUrl}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="p-5 space-y-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">{formatDisplayDate(item.createdAt)}</p>
                              <h3 className="font-semibold text-gray-900 text-lg leading-tight">{item.name}</h3>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${
                                item.status === 'LOST'
                                  ? 'bg-red-50 text-red-700 border border-red-100'
                                  : 'bg-green-50 text-green-700 border border-green-100'
                              }`}
                            >
                              {item.status}
                            </span>
                          </div>

                          {item.description && (
                            <p className="text-sm text-gray-600">{item.description}</p>
                          )}

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                              {item.category}
                            </span>
                            <span className={`text-xs font-medium ${item.verified ? 'text-green-600' : 'text-gray-400'}`}>
                              {item.verified ? 'Verified' : 'Pending'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostFoundItems;