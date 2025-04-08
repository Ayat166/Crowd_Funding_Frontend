import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios"; // Axios instance

function ProfilePage() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Retrieve the user ID from localStorage
        const userId = localStorage.getItem("userId");
        if (!userId) {
          console.error("User ID not found. Please log in.");
          return;
        }

        // Fetch the logged-in user's profile
        const response = await api.get(`/users/profile/${userId}`);
        console.log("PROFILE:", response.data);
        setProfile(response.data);
      } catch (error) {
        console.error("There was an error fetching the profile data!", error);
      }
    };

    fetchProfile();
  }, []);

  if (!profile || !profile.user) return <div>Loading...</div>;

  const user = profile.user;
  const projects = profile.projects || [];
  const donations = profile.donations || [];

  return (
    <div id="user-profile" className="container my-5 py-5">
      <div className="row">
        {/* Left Panel */}
        <div className="col-md-3 profile-nav shadow-lg h-100 p-0">
          <div className="user-heading round bg-gradient-primary text-white text-center py-4">
            <img
              src={
                user.profile_picture
                  ? `http://127.0.0.1:8000/${user.profile_picture}`
                  : "/default-profile.png"
              }
              alt="profile"
              className="card-img-top border border-2 rounded-circle my-3"
              style={{ width: 150, height: 150 }}
            />
            <h4>
              {user.first_name} {user.last_name}
            </h4>
            <p>{user.email}</p>
            <a href={user.facebook_profile || "#"} className="text-white">
              <i className="fa-brands fa-facebook-f mx-1"></i>
            </a>
            <a className="text-white">
              <i className="fa-brands fa-twitter mx-1"></i>
            </a>
            <a className="text-white">
              <i className="fa-brands fa-instagram mx-1"></i>
            </a>
          </div>

          <ul className="nav flex-column bg-white">
            <li className="py-1">
              <Link to={`/profile/edit/${user.id}`} className="btn btn-link">
                Edit Profile
              </Link>
            </li>
            <li className="py-1">
              <Link to="/projects/create" className="btn btn-link">
                Create Project
              </Link>
            </li>
            <li className="py-1">
              <Link to="/profile/delete" className="btn btn-link">
                Delete Account
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Panel */}
        <div className="col-md-9">
          <div className="row">
            {/* User Details */}
            <div className="col-md-9">
              <div className="profile-info shadow-lg bg-white rounded px-5 py-4 d-flex justify-content-around">
                <div>
                  <p>
                    First Name: <strong>{user.first_name}</strong>
                  </p>
                  <p>
                    Last Name: <strong>{user.last_name}</strong>
                  </p>
                  <p>
                    Country: <strong>{user.country}</strong>
                  </p>
                </div>
                <div>
                  <p>
                    Email: <strong>{user.email}</strong>
                  </p>
                  <p>
                    Mobile: <strong>{user.mobile}</strong>
                  </p>
                  <p>
                    Birthday: <strong>{user.birthdate}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="col-md-3 profile-info d-flex flex-column justify-content-between">
              <div className="bg-white rounded px-4 py-4 d-flex shadow-lg">
                <h5>
                  <i className="fa fa-coins text-primary"></i>
                </h5>
                <h5 className="mx-3">
                  {donations.length} <span>Donations</span>
                </h5>
              </div>
              <div className="bg-white rounded px-4 py-4 d-flex shadow-lg">
                <h5>
                  <i className="fa fa-chart-pie text-primary"></i>
                </h5>
                <h5 className="mx-3">
                  {projects.length} <span>Projects</span>
                </h5>
              </div>
            </div>
          </div>

          {/* Donations Table */}
          <div className="row mt-3">
            <div className="col-md-12">
              <table className="table table-hover bg-white rounded shadow-lg text-center">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Donation</th>
                    <th>Created at</th>
                  </tr>
                </thead>
                <tbody>
                  {projects.length > 0 ? (
                    projects.map((project, index) => (
                      <tr key={index}>
                        <td>{project.title}</td>
                        <td>{project.donation || 0} L.E</td>
                        <td>
                          {new Date(project.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">
                        You haven't donated to any project yet :(
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Projects */}
          <div className="row">
            {projects.map((project, idx) => (
              <div key={idx} className="col-md-4">
                <div style={{ height: "150px" }}>
                  <img
                    src={
                      project.images && project.images.length > 0
                        ? `http://127.0.0.1:8000${project.images[0].image}`
                        : "/default-profile.png"
                    }
                    alt="project"
                    className="card-img-top border border-2 rounded-circle my-3"
                    style={{ width: 150, height: 150 }}
                  />
                </div>
                <div className="d-flex justify-content-between bg-white px-3 pt-3">
                  <h5>{project.title}</h5>
                  <p>{project.total_target} L.E.</p>
                </div>
                <p className="bg-white px-3 pb-3">
                  {project.title === "My New Project1" &&
                    "This project is about Linux scripting."}
                  {project.title === "My New Project2" &&
                    "Educational app to help students learn."}
                  {project.title === "My New Project3" &&
                    "Helping fund small business owners."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
