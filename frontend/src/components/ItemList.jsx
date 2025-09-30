import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
// import { CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
const ItemList = ({ initialTasks }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => { 
    setTasks(initialTasks);
  },[initialTasks])
  const handleDelete = async (taskId) => {
    console.log(taskId);

    try {
      await axiosInstance.delete(`/api/main/item/${taskId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      alert('Item deleted successfully.');
      navigate('/')
    } catch (error) {
      console.log(error);

      alert('Failed to delete task.');
    }
  };

  const handleToggleVerified = async (task) => {
    try {
      const response = await axiosInstance.post(`/api/admin/verify/${task._id}`, {
        verified: !task.verified,
      }, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, verified: response.data.verified } : t
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to toggle verified status");
    }
  };


  return (
    <div>
      {tasks.map((task) => (
        <div
          key={task._id}
          className="relative bg-gray-100 p-4 mb-4 rounded shadow flex flex-col md:flex-row"
        >
          {/* Verified Tick */}
          <div className="absolute top-2 right-2">
            {user?.isAdmin ? (
              // Admin sees a toggle
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={task.verified}
                  onChange={() => handleToggleVerified(task)}
                  className="form-checkbox h-5 w-5 text-green-600"
                />
                <span className="text-sm">Verified</span>
              </label>
            ) : (
              // Non-admin sees the tick
              task.verified && <CheckCircle2 size={22} className="text-green-600" />
            )}
          </div>


          {/* Image */}
          {task.image && (
            <img
              src={`http://localhost:5001${task.image}`}
              alt={task.title}
              className="w-32 h-32 object-cover rounded mr-4"
            />
          )}


          {/* Content */}
          <div className="flex-1">
            <h2 className="font-bold text-lg">{task.title}</h2>
            <p className="text-gray-700">{task.description}</p>


            {task.user_id === user.id && (
              <div className="mt-3">
                <button
                  onClick={() => navigate("/add-items", { state: { item: task } })}
                  className="mr-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemList;
