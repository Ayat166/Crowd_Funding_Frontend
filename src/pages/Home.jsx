
import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import { fetchHomeProjects } from "../api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Home = () => {
    //console.log("Home - Component");
    const [projects, setProjects] = useState({ latest: [], topRated: [], featured: [] });
    const [loading, setLoading] = useState(true);

    // useRef for each slider
    const latestSliderRef = useRef(null);
    const topRatedSliderRef = useRef(null);
    const featuredSliderRef = useRef(null);

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

    // fuvction to render the slider
    const renderProjectsSlider = (title, projectsList, sliderRef) => (
        <div className="mb-8 relative">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            {projectsList.length > 0 ? (
                <div className="relative">
                    {/* Prev Button */}
                    <button
                        onClick={() => sliderRef.current.slickPrev()}
                        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"
                    >
                        ❮
                    </button>
                            
                        {/* Next Button */}
                    <button
                        onClick={() => sliderRef.current.slickNext()}
                        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full z-10"

                    >
                        ❯
                    </button>

                    {/* Slider */}
                    <Slider ref={sliderRef} {...sliderSettings}>
                        {projectsList.map((project) => (
                            <div key={project.id} className="p-4">
                                <div className="bg-white shadow-lg rounded-lg p-4">
                                    <h2 className="text-xl font-semibold">{project.title}</h2>
                                    <p className="text-gray-600">{project.details}</p>
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
        </div>
    );
};

export default Home;

