import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-4 fw-bold">Crowd-Funding Web App</h1>
      <p className="lead text-muted">Start your fundraising campaign now!</p>
      <Link to="/signup" className="btn btn-primary mt-3">
        Get Started
      </Link>
    </div>
  );
}

export default Home;
