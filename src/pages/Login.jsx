import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios"; // Axios instance
import { useNavigate ,useLocation } from 'react-router-dom';


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login/", {
        email,
        password,
      });
      console.log("Logging in:", { email, password });

      // Extract tokens and user data from the response
      const { access, refresh, user } = response.data;
      console.log(user)
      // Store tokens and user ID in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("userId", user.id); // Store the logged-in user's ID
      localStorage.setItem("firstName", user.first_name);
      console.log("Login successful:", response.data);
      
      //created by amina 
      //localStorage.setItem("is_superuser","false"); // Store the admin flag
      localStorage.setItem("is_superuser", user.is_superuser ? "true" : "false"); // Store the admin flag

      // Redirect user to homepage
      navigate("/");
      window.location.reload();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage("Invalid credentials. Please try again.");
        setTimeout(() => {
          setErrorMessage("");
        }, 3000);
      } else {
        setErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow w-50">
        <h1 className="text-center">Login</h1>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <Link to="/reset-password">Forgot your password?</Link>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
        <p className="text-center mt-3">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
