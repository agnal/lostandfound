import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import UserLandingPage from './pages/UserLandingPage';
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
<<<<<<< HEAD
        <Route path="/" element={<Home />} />
        <Route path="/userlandingpage" element={<UserLandingPage />} />
=======
>>>>>>> 67c58f5351a0fea0c774474e8a4fe6677f06c15f
        <Route path="/add-items" element={<AddItems />} />
        <Route path="/lost-items" element={<LostItems />} />
        <Route path="/found-items" element={<FoundItems />} />
        <Route path="/lost-found-items" element={<LostFoundItems />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<Home />} />
        

      </Routes>s
    </Router>
  );
}

export default App;
