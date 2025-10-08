import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuBar } from '../components/MenuBar';
import { Button } from '../components/ui/Button';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sortColumn, setSortColumn] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState('desc');
  const [error, setError] = useState('');

  const fetchItems = async () => {
    if (!user) {
      return;
    }

    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/main/items/all', {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = response.data.map((item) => ({
        id: item._id,
        title: item.title,
        status: item.verified ? 'verified' : 'unverified',
        createdAt: item.createdAt,
        selected: false,
        type: item.type,
      }));

      setItems(data);
    } catch (err) {
      setError('Failed to load items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!user.isAdmin) {
      navigate('/login');
      return;
    }

    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const toggleSelectAll = (checked) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected: checked })));
  };

  const toggleSelectItem = (id, checked) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, selected: checked } : item)));
  };

  const handleSort = (column) => {
    setSortColumn((prevColumn) => {
      const isSameColumn = prevColumn === column;
      setSortDirection((prevDirection) => (isSameColumn && prevDirection === 'asc' ? 'desc' : 'asc'));
      return column;
    });
  };

  const sortedItems = useMemo(() => {
    const sorted = [...items];
    sorted.sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];

      if (sortColumn === 'createdAt') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [items, sortColumn, sortDirection]);

  const selectedCount = sortedItems.filter((item) => item.selected).length;

  const handleVerifyToggle = async (item) => {
    try {
      await axiosInstance.post(
        `/api/admin/verify/${item.id}`,
        { verified: item.status !== 'verified' },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        },
      );
      fetchItems();
    } catch (err) {
      alert('Failed to update verification status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/main/item/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      fetchItems();
    } catch (err) {
      alert('Unable to delete item. Admins can only delete items they created.');
    }
  };

  const handleDeleteSelected = async () => {
    const toDelete = sortedItems.filter((item) => item.selected);
    if (toDelete.length === 0) {
      alert('Please select items to delete.');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${toDelete.length} selected item(s)?`)) {
      return;
    }

    for (const item of toDelete) {
      // eslint-disable-next-line no-await-in-loop
      await handleDelete(item.id);
    }
  };

  const verifiedCount = sortedItems.filter((item) => item.status === 'verified').length;
  const unverifiedCount = sortedItems.length - verifiedCount;

  return (
    <div className="bg-[#a0f1bd] w-full min-h-screen relative">
      <MenuBar activeItem="Admin" />

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#2d4f20] mb-2">Admin Dashboard</h1>
          <p className="text-[#2d4f20]/70 text-lg">Manage lost and found listings</p>
        </div>

        {error && <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-red-700">{error}</div>}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              {selectedCount > 0 && (
                <>
                  <span className="text-sm text-gray-600">
                    {selectedCount} item{selectedCount > 1 ? 's' : ''} selected
                  </span>
                  <Button
                    onClick={handleDeleteSelected}
                    variant="destructive"
                    size="sm"
                    className="bg-red-500 hover:bg-red-600"
                  >
                    Delete Selected
                  </Button>
                </>
              )}
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => navigate('/add-items')}>
              Add Item
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left w-12">
                    <input
                      type="checkbox"
                      checked={sortedItems.length > 0 && sortedItems.every((item) => item.selected)}
                      onChange={(event) => toggleSelectAll(event.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left w-16">
                    <button
                      type="button"
                      onClick={() => handleSort('id')}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 uppercase text-sm"
                    >
                      #
                      {sortColumn === 'id' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort('title')}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 uppercase text-sm"
                    >
                      Title
                      {sortColumn === 'title' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 uppercase text-sm"
                    >
                      Status
                      {sortColumn === 'status' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      type="button"
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-2 font-semibold text-gray-700 hover:text-gray-900 uppercase text-sm"
                    >
                      Date
                      {sortColumn === 'createdAt' && <span>{sortDirection === 'asc' ? '↑' : '↓'}</span>}
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedItems.map((item, index) => (
                  <tr key={item.id} className={item.selected ? 'bg-blue-50' : ''}>
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={item.selected}
                        onChange={(event) => toggleSelectItem(item.id, event.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{index + 1}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{item.title}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          item.status === 'verified'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-600 uppercase">{item.type || 'lost'}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          size="sm"
                          className="bg-[#2d4f20] hover:bg-[#1f3517] text-white px-3 py-1 h-8"
                          onClick={() => handleVerifyToggle(item)}
                        >
                          {item.status === 'verified' ? 'Unverify' : 'Verify'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 h-8"
                          onClick={() => handleDelete(item.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {sortedItems.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-6 py-6 text-center text-gray-500">
                      No items available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Items</h3>
            <p className="text-3xl font-bold text-gray-900">{sortedItems.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Verified</h3>
            <p className="text-3xl font-bold text-green-600">{verifiedCount}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Unverified</h3>
            <p className="text-3xl font-bold text-blue-600">{unverifiedCount}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;