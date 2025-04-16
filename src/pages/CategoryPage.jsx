import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import api from "../utils/axios"; // Axios instance
import ProjectCard from "../components/ProjectCard";

const CategoryPage = () => {
  const { categoryId } = useParams(); // Get the category ID from the URL parameters
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  //for category name
  const [categories, setCategories] = useState([]); // State to store categories
  const [categoryName, setCategoryName] = useState(""); // State to store the category name

  // Fetch categories when the component mounts
  useEffect(() => {
    const getCategoryProjects = async () => {
      try {
        const response = await api.get(`/projects/category/${categoryId}/`);
        console.log("Fetched Category Projects:", response.data);
        setProjects(response.data.projects || []); // Assuming the response contains a 'projects' array
      } catch (error) {
        console.error("Error fetching category projects:", error);
      } finally {
        setLoading(false);
      }
    };

    const category = categories.find((cat) => cat.id === parseInt(categoryId));
    setCategoryName(category ? category.name : "Unknown Category");

    getCategoryProjects();
  }, [categoryId, categories]); // Fetch projects when categoryId changes

  // Fetch categories to get the category name
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/projects/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  if (loading)
    return <p className="text-center text-lg font-bold">Loading Projects...</p>;
  if (!projects)
    return (
      <p className="text-center text-lg font-bold text-red-500">
        Failed to load projects.
      </p>
    );

  return (
    <div className="container mt-5">
      <h1 className="text-2xl font-bold mb-4">{categoryName} Projects</h1>
      {projects.length > 0 ? (
        <div className="row">
          {projects.map((project) => (
            <Link
              key={project.id} // ✅ Key moved here
              to={`/projects/${project.id}`}
              className="text-decoration-none"
            >
              <div className="col-md-6 mb-6">
                <ProjectCard project={project} />
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p>No projects available in this category.</p>
      )}
      <Link to="/" className="btn btn-primary mt-3">
        Back to Home
      </Link>
    </div>
  );
};
export default CategoryPage;
