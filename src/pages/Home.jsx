import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom"; // Import Link from React Router
import Slider from "react-slick";
import { fetchHomeProjects } from "../api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProjectCard from "../components/ProjectCard";

const Home = () => {
    const [projects, setProjects] = useState({ latest: [], topRated: [], featured: [] });
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("accessToken"));
    const latestSliderRef = useRef(null);
    const topRatedSliderRef = useRef(null);
    const featuredSliderRef = useRef(null);

    // Check if user is an admin
    const is_superuser = localStorage.getItem("is_superuser") === "true"; 

    useEffect(() => {
        const getProjects = async () => {
            try {
                const data = await fetchHomeProjects();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };
        getProjects();
    }, []);

    if (loading) return <p className="text-center text-lg font-bold">Loading ...</p>;
    if (!projects) return <p className="text-center text-lg font-bold text-red-500">Failed to load projects.</p>;

    const sliderSettings = {
        dots: false,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        arrows: true,
        responsive: [
            { breakpoint: 1024, settings: { slidesToShow: 2 } },
            { breakpoint: 768, settings: { slidesToShow: 1 } },
        ],
    };

    const renderProjectsSlider = (title, projectsList, sliderRef) => (
        <div className="mb-8 relative">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            {projectsList.length > 0 ? (
                <div className="relative">
                    <button
                        onClick={() => sliderRef.current.slickPrev()}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
                    >
                        ❮
                    </button>
                    <button
                        onClick={() => sliderRef.current.slickNext()}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
                    >
                        ❯
                    </button>

                    <Slider ref={sliderRef} {...sliderSettings}>
                        {projectsList.map((project) => (
                            <div key={project.id} className="p-4">
                                <div className="bg-white shadow-lg rounded-lg p-4">
                                    {/* Wrap ProjectCard with Link */}
                                    <Link to={`/projects/${project.id}`}>
                                        <ProjectCard project={project} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            ) : (
                <p className="text-gray-500">No {title}</p>
            )}


        </div>
    );

    return (
        <div className="container mx-auto p-4">
            {renderProjectsSlider("Top Rated Projects", projects.topRated, topRatedSliderRef)}
            {renderProjectsSlider("Latest Projects", projects.latest, latestSliderRef)}
            {renderProjectsSlider("Featured Projects", projects.featured, featuredSliderRef)}

            {/* Show Admin Button if user is admin */}
            {loggedIn && is_superuser && (
                <div className="text-center mt-8">
                    <Link
                        to="/admin/feature-projects"
                        className="bg-blue-600 text-black px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Manage Featured Projects
                    </Link>
                </div>
            )}
        </div>
    );
};

export default Home;

