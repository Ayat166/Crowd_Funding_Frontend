import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    profile_picture: null,
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();


  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    if (name === "password" || name === "confirmPassword") {
      if (
        updatedFormData.password &&
        updatedFormData.confirmPassword &&
        updatedFormData.password !== updatedFormData.confirmPassword
      ) {
        setPasswordError("Passwords do not match");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();

    formDataToSend.append("first_name", formData.first_name);
    formDataToSend.append("last_name", formData.last_name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("password", formData.password);
    formDataToSend.append("mobile", formData.mobile);

    // Append the profile picture if it exists
    if (formData.profile_picture) {
      formDataToSend.append("profile_picture", formData.profile_picture);
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/register/", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setSuccessMessage("Registration successful!, Now let's login to your account");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobile: "",
        profile_picture: null,
      });
      setTimeout(() => setSuccessMessage(""), 3000);
      setTimeout(() => {
        navigate("/Login");
      }, 3000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage("Error during signup: " + (error.response.data.detail || "Please try again"));
      } else {
        setErrorMessage("An unexpected error occurred. Please try again later.");
      }
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (

    <div className="container d-flex justify-content-center align-items-center vh-10">
      <div className="card p-4 shadow w-50">
        <h1 className="text-center">Sign Up</h1>
        {successMessage && (
          <div className="alert alert-success text-center mb-3">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleSignup}>
          <div className="mb-1">
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="first_name"
              className="form-control"
              value={formData.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-1">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="last_name"
              className="form-control"
              value={formData.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-1">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-1">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <small className="text-muted">
            Password must be at least 8 characters long, contain an uppercase letter and a number.
          </small>
          <div className="mb-1">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              className={`form-control ${passwordError ? "is-invalid" : ""}`}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {passwordError && (
              <div className="invalid-feedback">{passwordError}</div>
            )}
          </div>

          <div className="mb-1">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="mobile"
              className={`form-control ${phoneError ? 'is-invalid' : ''}`}
              value={formData.mobile}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, mobile: value });

                const egyptianRegex = /^01[0-2,5][0-9]{8}$/;
                if (!egyptianRegex.test(value)) {
                  setPhoneError("Invalid Egyptian phone number");
                } else {
                  setPhoneError("");
                }
              }}
            />
            {phoneError && <div className="invalid-feedback">{phoneError}</div>}
          </div>

          <div className="mb-1">
            <label className="form-label">Profile Picture</label>
            <input
              type="file"
              name="profile_picture"
              className="form-control"
              onChange={(e) => {
                const file = e.target.files[0];
                setFormData({ ...formData, profile_picture: file });
              }}
            />
          </div>
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {errorMessage}
            </div>
          )}
          <button type="submit" className="btn btn-primary w-100">
            Sign Up
          </button>
        </form>
        <p className="text-center mt-3">
          Already have an account?{" "}
          <Link to="/login" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}


export default Signup;
