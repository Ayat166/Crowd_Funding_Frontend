import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick"; // Use react-slick carousel for multiple items
import { fetchHomeProjects } from "../api";
import ProjectCard from "../components/ProjectCard";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
  const [projects, setProjects] = useState({
    latest: [],
    topRated: [],
    featured: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchHomeProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true, // Changed to true for infinite loop
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true, // Added autoplay
    autoplaySpeed: 3000, // Set autoplay interval (3 seconds)
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  const renderProjectsSlider = (title, list) => {
    return (
      <div className="mb-5">
        <h2 className="fw-bold text-success mb-3">{title}</h2>
        {list.length > 0 ? (
          <Slider {...sliderSettings}>
            {list.map((project) => (
              <div key={project.id} className="px-2">
                <Link
                  to={`/projects/${project.id}`}
                  className="text-decoration-none"
                >
                  <ProjectCard project={project} />
                </Link>
              </div>
            ))}
          </Slider>
        ) : (
          <p className="text-muted">No {title.toLowerCase()}</p>
        )}
      </div>
    );
  };

  if (loading) {
    return <p className="text-center fw-bold fs-4 my-5">Loading ...</p>;
  }

  return (
    <div className="container py-4">
      {renderProjectsSlider("Top Rated Projects", projects.topRated)}
      {renderProjectsSlider("Latest Projects", projects.latest)}
      {renderProjectsSlider("Featured Projects", projects.featured)}

      <div className="text-center mt-5">
        <Link
          to="/projects/list"
          className="btn btn-warning text-white fw-bold fs-5 px-4 py-2"
        >
          See All Projects
        </Link>
      </div>
    </div>
  );
};

export default Home;
