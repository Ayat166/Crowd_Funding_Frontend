import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CategoryPage from "./pages/CategoryPage";
import SearchResultsPage from "./pages/SearchResultsPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"; 

function App() {
  return (
    <Router>
      <div className="d-flex flex-column vh-100">
        <Navbar />
        <div className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:categoryId" element={<CategoryPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
