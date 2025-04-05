import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import AllDonationsPage from "./pages/AllDonationsPage";
import ReportsPage from "./pages/ReportsPage";

import ProjectsList from "./components/ProjectsList"; // Fixed import path
import ProjectDetail from "./components/ProjectDetail"; // Fixed import path
import ProjectForm from "./components/ProjectForm"; // Fixed import path
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

            <Route path="/projects/list" exact element={<ProjectsList />} />
            <Route path="/projects/create" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
