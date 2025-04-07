import React, { useEffect, useState } from "react";
import {Link, useLocation } from "react-router-dom";
import { searchProjects } from "../api";
import ProjectCard from "../components/ProjectCard";

const SearchResultsPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  
  const query = new URLSearchParams(location.search).get('query');  // Get the query parameter from URL

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      try {
        const results = await searchProjects(query);
        setSearchResults(results);
      } catch (error) {
        console.error("Error fetching search results", error);
      } finally {
        setLoading(false);
      }
    };
    if (query) {
      fetchResults();
    }
  }, [query]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!searchResults.length) return <p className="text-center">No results found for "{query}"</p>;

  return (
    <div className="container mt-5">
        <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
        {searchResults.length > 0 ? (
            <div className="row">
                {searchResults.map((project) => (
                    <div className="col-md-6 mb-6" key={project.id}>
                        <ProjectCard key={project.id} project={project} />
                    </div>
                ))}
            </div>
        ) : (
            <p>No projects available in this category.</p>
        )}
        <Link to="/" className="btn btn-primary mt-3">Back to Home</Link>
    </div>
);
//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
//         {searchResults.map((project) => (
//           <div key={project.id} className="p-4">
//             <div className="bg-white shadow-lg rounded-lg p-4 col-md-5 mb-5" key={project.id}>
//               <ProjectCard project={project} />
//             </div>
//           </div>
//         ))}
        
//       </div>
//     </div>
//   );
};

export default SearchResultsPage;
