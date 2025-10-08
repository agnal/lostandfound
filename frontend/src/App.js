import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Home from './pages/Home';
import UserLandingPage from './pages/UserLandingPage';
import AddItems from './pages/add_items';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/" element={<Home />} />
        <Route path="/userlandingpage" element={<UserLandingPage />} />
        <Route path="/add-items" element={<AddItems />} />

      </Routes>s
    </Router>
  );
}

export default App;
