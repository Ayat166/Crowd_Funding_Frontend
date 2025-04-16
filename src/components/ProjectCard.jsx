import React from "react";
import ImagesSlider from "./ImagesSlider";

const ProjectCard = ({ project }) => {
  const fundingPercent = Math.min(
    Math.round((project.total_donations / project.total_target) * 100),
    100
  );

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={i <= rating ? "text-warning" : "text-secondary"}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="col-12 mb-4">
      <div
        className="card shadow-sm h-100 d-flex flex-column"
        style={{ minHeight: "500px", maxHeight: "500px" }}
      >
        {/* Image Slider */}
        <div style={{ height: "200px", overflow: "hidden" }}>
          <ImagesSlider
            images={project.images}
            carouselId={`carousel-${project.id}`}
          />
        </div>

        {/* Card Body */}
        <div className="card-body text-dark d-flex flex-column flex-grow-1">
          {/* Tag */}
          <div className="mb-2">
            <span className="badge bg-warning text-dark text-uppercase">
              {project.tags}
            </span>
          </div>

          {/* Title & Description */}
          <h5 className="card-title">{project.title}</h5>
          <p className="card-text small text-muted flex-grow-1">
            {project.details}
          </p>

          {/* Rating */}
          <div className="mb-2">{renderStars(project.avg_rating)}</div>

          {/* Funding Progress */}
          <div>
            <div className="d-flex justify-content-between small">
              <span>${Number(project.total_donations).toFixed(2)} raised</span>
              <span className="text-success">{fundingPercent}% funded</span>
            </div>
            <div className="progress" style={{ height: "8px" }}>
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${fundingPercent}%` }}
                aria-valuenow={fundingPercent}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
