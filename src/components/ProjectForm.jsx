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
  const [images, setImages] = useState([]);
  const [imageNames, setImageNames] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('You must be logged in to create a project.');
      navigate('/login'); // Redirect to login page
    }
  }, [navigate]);

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setImages([...images, ...selectedFiles]);
    setImageNames([...imageNames, ...selectedFiles.map((file) => file.name)]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !details || !totalTarget || !startTime || !endTime || images.length === 0) {
      setError('All fields are required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('details', details);
    formData.append('total_target', totalTarget);
    formData.append('start_time', startTime);
    formData.append('end_time', endTime);
    images.forEach((image) => formData.append('images', image));

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
      setImages([]);
      setImageNames([]);
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
          <label htmlFor="images">Project Images</label>
          <input
            id="images"
            type="file"
            multiple
            onChange={handleImageChange}
            required
          />
          <div>
            {imageNames.map((name, index) => (
              <p key={index}>{name}</p>
            ))}
          </div>
        </div>

        <button type="submit" className="submit-btn">Create Project</button>
      </form>
    </div>
  );
};

export default ProjectForm;