import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useState } from 'react';
import ProfileEdit from "./pages/ProfileEdit";
import AccountDelete from "./pages/AccountDelete";

function App() {
  const [userId, setUserId] = useState(1);
  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<ProfilePage userId={1} />} />
            <Route path="/profile/edit/:id" element={<ProfileEdit />} />
            <Route path="/profile/delete" element={<AccountDelete />} /> 
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
