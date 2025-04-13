import React, { useEffect, useState } from "react";
import { updateProjectFeatureStatus, fetchAllProjects } from "../api";
import { useNavigate,Link } from "react-router-dom";

const FeatureProjectsAdmin = () => {
    const [projects, setProjects] = useState([]);
    const [updatedProjects, setUpdatedProjects] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const getProjects = async () => {
            try {
                const data = await fetchAllProjects();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        getProjects();
    }, []);

    const toggleFeature = (projectId) => {
        setUpdatedProjects((prev) => ({
            ...prev,
            [projectId]:
                prev[projectId] !== undefined
                    ? !prev[projectId]
                    : !projects.find((p) => p.id === projectId)?.is_featured,
        }));
    };

    const handleSave = async () => {
        try {
            for (let projectId in updatedProjects) {
                await updateProjectFeatureStatus(projectId, updatedProjects[projectId]);
            }
            alert("Feature statuses updated!");
            navigate("/");
        } catch (error) {
            console.error("Failed to update:", error);
            alert("Update failed");
        }
    };

    if (loading) return <p className="text-center mt-10">Loading projects...</p>;

    return (
        <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Manage Featured Projects
        </h1>
      
        <div className="overflow-x-auto bg-white shadow rounded-lg w-50 flex my-5 mx-auto"> 
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100 text-gray-700 text-left">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-4 py-3">Project Title</th>
                <th className="px-4 py-3 text-center">Featured</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => {
                const isChecked =
                  updatedProjects[project.id] !== undefined
                    ? Boolean(updatedProjects[project.id])
                    : Boolean(project.is_featured);
                return (
                  <tr
                    key={project.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                        <Link to={`/projects/${project.id}`} className="text-decoration-none text-primary">
                            {project.title}
                        </Link>
                        </td>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleFeature(project.id)}
                        className="w-5 h-5 accent-green-600"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      
        <div className="my-4 text-center">
          <button
            onClick={handleSave}
            className="btn btn-primary"
          >
            Save Changes
          </button>
        </div>
      </div>
      

    );
};

export default FeatureProjectsAdmin;
