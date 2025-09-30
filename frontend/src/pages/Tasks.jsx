import { useState, useEffect } from 'react';
import axiosInstance from '../axiosConfig';
import ItemList from '../components/ItemList';
import SortDropdown from '../components/SortDropdown';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [sortBy, setSortBy] = useState('recent'); // Strategy
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get(`/api/main/items/all?sortBy=${sortBy}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setTasks(response.data);
      } catch (error) {
        console.error('Failed to fetch tasks.', error);
      }
    };

    if (user) fetchTasks();
  }, [user, sortBy]);

  return (
    <div className="container mx-auto p-6 relative">
      {/* Strategy Pattern Dropdown */}
      <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />

      {/* Task List */}
      <ItemList initialTasks={tasks} />

      {/* Floating Action Button */}
      {!user?.isAdmin && (
        <button
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl"
          aria-label="Add Lost or Found Item"
          onClick={() => navigate('/add-items')}
        >
          
        </button>
      )}
    </div>
  );
};

export default Tasks;
