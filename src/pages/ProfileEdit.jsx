import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";


function ProfileEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    country: "",
    birthdate: "",
    password: "",
    confirmPassword: "",
    phone: "",
    profile_picture: null,
    facebook_profile: ""
  });

  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    axios.get(`http://127.0.0.1:8000/api/users/profile/${id}/`)
      .then((res) => {
        const user = res.data.user;
        setFormData({
          ...formData,
          first_name: user.first_name || "",
          last_name: user.last_name || "",
          country: user.country || "",
          birthdate: user.birthdate || "",
          phone: user.mobile || "",
          facebook_profile: user.facebook_profile || ""
        });
      })
      .catch((err) => {
        console.error("Error fetching profile:", err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = new FormData();
    for (let key in formData) {
      updateData.append(key, formData[key]);
    }

    try {
      await axios.put(`http://127.0.0.1:8000/api/users/update/${id}/`, updateData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setMsg("Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      setErrors(err.response?.data || {});
      setMsg("There was an error updating the profile.");
    }
  };

  return (
    <div className="container py-5">
      <div className="col-md-8 card shadow-lg p-4 mt-5 mx-auto">
        <div className="text-center">
          <h3 className="font-weight-bolder">Edit Profile</h3>
          {msg && <div className="alert alert-warning">{msg}</div>}
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {[
            { label: "First Name", name: "first_name" },
            { label: "Last Name", name: "last_name" },
            { label: "Country", name: "country" },
            { label: "Birthdate", name: "birthdate", type: "date" },
            { label: "Password", name: "password", type: "password" },
            { label: "Confirm Password", name: "confirmPassword", type: "password" },
            { label: "Mobile", name: "phone" },
            { label: "Facebook Account", name: "facebook_profile" }
          ].map(({ label, name, type = "text" }) => (
            <div className="mb-3" key={name}>
              <label className="form-label">{label}</label>
              <input
                type={type}
                name={name}
                value={formData[name] || ""}
                onChange={handleChange}
                className="form-control"
              />
              {errors[name] && <div className="text-danger">{errors[name]}</div>}
            </div>
          ))}

          <div className="mb-3">
            <label className="form-label">Avatar</label>
            <input
              type="file"
              name="profile_picture"
              onChange={handleChange}
              className="form-control"
            />
            {errors.profile_picture && <div className="text-danger">{errors.profile_picture}</div>}
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-lg bg-gradient-primary w-100 mt-4 mb-0">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileEdit;
