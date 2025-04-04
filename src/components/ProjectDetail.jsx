import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // To read the ID from the URL
import api from '../api'; // Import the Axios helper file

const ProjectDetail = () => {
  const { id } = useParams(); // Get the project ID from the URL
  const [project, setProject] = useState(null); // State to hold the project data

  useEffect(() => {
    // Fetch the single project details when the component mounts
    const fetchProject = async () => {
      try {
        const response = await api.get(`/projects/${id}/`); // API request to get the single project
        setProject(response.data); // Set the project data into the state
      } catch (error) {
        console.error("Error fetching project details:", error); // Handle any errors
      }
    };

    fetchProject(); // Call the function to fetch data
  }, [id]); // Dependency array with the ID to re-fetch when the project ID changes

  if (!project) {
    return <div>Loading...</div>; // Show a loading state if the project is not yet fetched
  }

  return (
    <div>
      <h2>{project.title}</h2>
      <p>{project.details}</p>
      <p><strong>Target:</strong> {project.total_target}</p>
      <p><strong>Current Donations:</strong> {project.current_donations}</p>
      <img src={`http://127.0.0.1:8000${project.image}`} alt={project.title} />
      </div>
  );
};

export default ProjectDetail;
