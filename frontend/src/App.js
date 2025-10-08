import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import AddItems from './pages/add_items';
import LostItems from './pages/LostItems';
import FoundItems from './pages/FoundItems';
import LostFoundItems from './pages/LostFoundItems';
import AdminDashboard from './pages/AdminDashboard';


function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/add-items" element={<AddItems />} />
        <Route path="/lost-items" element={<LostItems />} />
        <Route path="/found-items" element={<FoundItems />} />
        <Route path="/lost-found-items" element={<LostFoundItems />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Home />} />
        

      </Routes>
    </Router>
  );
}

export default App;
