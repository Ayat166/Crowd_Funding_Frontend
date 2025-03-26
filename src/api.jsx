import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:8000/api/projects";

export const fetchHomeProjects = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/home/`);
        console.log("Fetched Projects:", response.data);
        return {
            latest: response.data.latest_projects || [],
            topRated: response.data.top_rated_projects || [],
            featured: response.data.featured_projects || [],
        };
    } catch (error) {
        console.error("Error fetching home projects", error);
        return { latest: [], topRated: [], featured: [] };
    }
};
