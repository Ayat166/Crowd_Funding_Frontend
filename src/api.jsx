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

export const fetchCategories = async () => {
    try {
        console.log("Fetching categories..."); 
        const response = await axios.get(`${API_BASE_URL}/categories/`);
        
        console.log("Fetched categories:", response.data); 
        return response.data; // Use axios for uniformity
    } catch (error) {
        console.error("Error fetching categories:", error);
        return [];
    }
};

export const fetchCategoryProjects = async (categoryId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/category/${categoryId}/`);
      return response.data.projects || []; // Ensure we return an empty array if no projects are found
    } catch (error) {
      console.error("Error fetching category projects:", error);
      return [];
    }
};



export const searchProjects = async (searchTerm) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/search/`,
            { params: { query: searchTerm } }
        );
        return response.data;
    } catch (error) {
        console.error("Error searching projects:", error);
        throw error;
    }
};
export const fetchAllProjects = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_BASE_URL}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching all projects:", error);
      throw error;
    }
  };
  
  export const updateProjectFeatureStatus = async (projectId, isFeatured) => {
    try {
        const accessToken = localStorage.getItem("accessToken");

        const response = await axios.patch(
            `${API_BASE_URL}/${projectId}/`,
            {
                is_featured: isFeatured,
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Failed to update project:", error);
        throw error;
    }
};
