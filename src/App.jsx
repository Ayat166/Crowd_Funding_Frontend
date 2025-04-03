import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AllDonationsPage from "./pages/AllDonationsPage";
import ReportsPage from "./pages/ReportsPage";

function App() {
  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/all-donations" element={<AllDonationsPage />} />
            <Route path="/all-reports" element={<ReportsPage />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
