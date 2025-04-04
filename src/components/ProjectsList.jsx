import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For navigation
import api from '../api';  // Import Axios helper

import './css/ProjectsList.css'; // You can create a custom CSS file for the list styles

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects/');
        console.log(response.data); // Check the structure of the response
        setProjects(response.data.projects || response.data); // Adjust based on the response structure
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError('Error fetching projects, please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="projects-list-container">
      <h2>Projects</h2>
      <div className="button-container">
        <Link to="/projects/create" className="create-project-btn">Create New Project</Link>
      </div>

      {loading ? (
        <p>Loading projects...</p>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <ul className="projects-list">
          {Array.isArray(projects) && projects.length > 0 ? (
            projects.map((project) => (
              <li key={project.id} className="project-item">
                <h3>{project.title}</h3>
                <img src={`http://127.0.0.1:8000${project.image}`} alt={project.title} className="project-image" />
                <p>{project.details}</p>
              </li>
            ))
          ) : (
            <p>No projects available</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ProjectsList;
