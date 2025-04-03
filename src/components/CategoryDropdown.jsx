import React, { useEffect, useState } from "react";
import "../styles/categoryDropdown.css";
import axios from "axios";

const CategoryDropdown = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/projects/categories/");
                console.log("Fetched Categories:", response.data);
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        getCategories();
    }, []);

    return (
        <li className="nav-item dropdown"
        onMouseEnter={(e) => e.currentTarget.querySelector(".dropdown-menu").classList.add("show")}
        onMouseLeave={(e) => e.currentTarget.querySelector(".dropdown-menu").classList.remove("show")}
        > 
            <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                Category
            </a>
            <ul className="dropdown-menu ">
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <li key={category.id}>
                            <a className="dropdown-item" href={`/category/${category.id}`}>
                                {category.name}
                            </a>
                        </li>
                    ))
                ) : (
                    <li className="dropdown-item text-muted">No categories available</li>
                )}
            </ul>
        </li>
    );
};

export default CategoryDropdown;