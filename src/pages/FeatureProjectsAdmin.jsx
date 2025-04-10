import React, { useEffect, useState } from "react";
import { updateProjectFeatureStatus, fetchAllProjects } from "../api";
import { useNavigate } from "react-router-dom";

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
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold text-center mb-6">Manage Featured Projects</h1>
            <div className="space-y-4">
                {projects.map((project) => {
                    const isChecked =
                        updatedProjects[project.id] !== undefined
                            ? Boolean(updatedProjects[project.id])
                            : Boolean(project.is_featured);
                    return (
                        <div
                            key={project.id}
                            className="flex items-center justify-between border-b pb-2 space-x-4"
                        >
                            <span className="flex-1">{project.title}</span>
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleFeature(project.id)}
                                className="w-5 h-5 bg-success"
                            />
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 text-center">
                <button
                    onClick={handleSave}
                    className="bg-success text-white px-6 py-2 rounded"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default FeatureProjectsAdmin;
