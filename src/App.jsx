import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from './pages/ProfilePage';
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
import CategoryPage from "./pages/CategoryPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import FeatureProjectsAdmin from "./pages/FeatureProjectsAdmin"; // Fixed import path
import { fetchAllProjects } from "./api"; // Fixed import path
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"; 
import { useState } from 'react';
import ProfileEdit from "./pages/ProfileEdit";
import AccountDelete from "./pages/AccountDelete";

function App() {
  const [userId, setUserId] = useState(1);
  return (
      <div className="d-flex flex-column vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/admin/feature-projects" element={<FeatureProjectsAdmin />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/all-donations" element={<AllDonationsPage />} />
            <Route path="/all-reports" element={<ReportsPage />} />
            <Route path="/projects/list" exact element={<ProjectsList />} />
            <Route path="/projects/create" element={<ProjectForm />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

            <Route path="/profile" element={<ProfilePage userId={1} />} />
            <Route path="/profile/edit/:id" element={<ProfileEdit />} />
            <Route path="/profile/delete" element={<AccountDelete />} /> 
          </Routes>
        </div>
        <Footer />
      </div>

  );
}

export default App;
