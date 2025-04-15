import React from "react";
import ImagesSlider from './ImagesSlider';


const ProjectCard = ({ project }) => {
    return (
        // <div className="col-md-4 mb-4">
        <div className="col-12 mb-4">
            <div className="card shadow-sm p-3" style={{ height: '400px', overflowY: 'auto' }}>
            <ImagesSlider images={project.images} carouselId={`carousel-${project.id}`} />
                <div className="card-body ">
                    <h5 className="card-title">{project.title}</h5>
                    <p className="card-text small">{project.details}</p>
                    <p className="card-text small"><strong>Donations:</strong>{project.total_donations} / {project.total_target} LE</p>

                </div>
            </div>
        </div>
    );
};

export default ProjectCard;
