import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For navigation
import api from "../utils/axios"; // Axios instance
import './css/ProjectForm.css';  // You can create a custom CSS file for the form styles

const ProjectForm = () => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [totalTarget, setTotalTarget] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState(null);
  const [tags, setTags] = useState(''); // New field for tags
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('You must be logged in to create a project.');
      navigate('/login'); // Redirect to login page
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !details || !totalTarget || !startTime || !endTime || !image || !tags) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('details', details);
    formData.append('total_target', totalTarget);
    formData.append('start_time', startTime);
    formData.append('end_time', endTime);
    formData.append('image', image);
    formData.append('tags', tags); // Add tags to the form data

    try {
      const token = localStorage.getItem('accessToken'); // Retrieve the token
      const response = await api.post('/projects/', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log('Project created:', response.data);

      // Alert success and navigate back to the profile page
      alert('Project created successfully!');
      navigate('/profile'); // Redirect to the profile page

      // Reset the form after successful submission
      setTitle('');
      setDetails('');
      setTotalTarget('');
      setStartTime('');
      setEndTime('');
      setImage(null);
      setTags('');
    } catch (error) {
      console.error('Error creating project:', error);
      setError('There was an issue creating your project. Please try again.');
    }
  };

  return (
    <div className="project-form-container">
      <h2>Create New Project</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit} className="project-form">
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter the project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="details">Project Details</label>
          <textarea
            id="details"
            placeholder="Provide detailed description of the project"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="totalTarget">Total Target (in USD)</label>
          <input
            id="totalTarget"
            type="number"
            placeholder="Set the funding target"
            value={totalTarget}
            onChange={(e) => setTotalTarget(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="startTime">Start Time</label>
          <input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="endTime">End Time</label>
          <input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">Project Image</label>
          <input
            id="image"
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            placeholder="Enter tags separated by commas"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Create Project</button>
      </form>
    </div>
  );
};

export default ProjectForm;