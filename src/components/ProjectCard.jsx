import React from "react";
import ImagesSlider from './ImagesSlider';


const ProjectCard = ({ project }) => {
    return (
        // <div className="col-md-4 mb-4">
        <div className="col-12 mb-4">
            <div className="card shadow-sm p-3" style={{ height: '400px', overflowY: 'auto' }}>
            <ImagesSlider images={project.images} carouselId={`carousel-${project.id}`} />
                <div className="card-body">
                    <h2 className="card-title">{project.title}</h2>
                    <p className="card-text">{project.details}</p>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
