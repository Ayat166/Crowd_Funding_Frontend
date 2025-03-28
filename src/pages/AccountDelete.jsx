import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AccountDelete() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [errors, setErrors] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {console.log("sending: ", { password, user_id: 2 });
      await axios.post("http://127.0.0.1:8000/api/users/delete-account/", { password,
        user_id: 1, });
      setMsg("Account deleted successfully.");
      navigate("/login");
    } catch (error) {
      setErrors(error.response?.data?.detail || "Failed to delete account.");
    }
  };

  return (
    <section className="page-header section-height-100">
      <div className="container">
        <div className="row">
          <div className="col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0 mx-auto">
            <div className="card card-plain">
              <div className="card-header pb-0 text-left">
                <h4 className="font-weight-bolder">Confirm password to delete your account</h4>
                {msg && <div className="alert alert-warning">{msg}</div>}
                {errors && <p className="text-danger">{errors}</p>}
              </div>
              <div className="card-body">
                <form onSubmit={handleDelete}>
                  <div className="mb-3">
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-control"
                      placeholder="Enter your password"
                      required
                    />
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-lg bg-danger w-100 mt-4 mb-0">
                      Delete
                    </button>
                    <button
                      type="button"
                      className="btn btn-lg bg-primary w-100 mt-3"
                      onClick={() => navigate("/profile")}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AccountDelete;