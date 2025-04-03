import React from "react";

const ProjectCard = ({ project }) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="card shadow-sm p-3">
                <div className="card-body">
                    <h2 className="card-title">{project.title}</h2>
                    <p className="card-text">{project.details}</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
