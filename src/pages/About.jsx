import React from "react";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center text-center mb-4">
        <div className="col-md-8">
          <h1 className="text-warning mb-3">About Crowd Funding</h1>
          <p className="lead text-muted">
            Crowd Funding is a platform that empowers people to bring their ideas to life through the power of community.
            Whether you're an innovator with a groundbreaking idea or someone passionate about supporting meaningful projects,
            Crowd Funding connects creators and supporters in a seamless and secure way.
          </p>
        </div>
      </div>

      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow">
            <div className="card-body">
              <h4 className="card-title text-success">Our Mission</h4>
              <p className="card-text">
                To democratize fundraising and provide everyone with the tools they need to launch, grow, and fund their projects.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow">
            <div className="card-body">
              <h4 className="card-title text-primary">Our Vision</h4>
              <p className="card-text">
                To build a world where anyone can make an impact, regardless of their background or financial status.
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow">
            <div className="card-body">
              <h4 className="card-title text-danger">Why Crowd Funding?</h4>
              <p className="card-text">
                We believe in the power of people coming together to support innovation, creativity, and positive change.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        <div className="col-md-10 text-center">
          <h3 className="text-secondary mb-3">Join Us</h3>
          <p className="text-muted">
            Whether you're here to start a project or support one, Crowd Funding gives you the tools and the community to
            succeed. Together, we can make ideas a reality.
          </p>
          <Link
                  to='/signup'
                  className="text-decoration-none"
                ><p className="btn btn-warning text-dark px-4 mt-3">
            Get Started
          </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default About;
