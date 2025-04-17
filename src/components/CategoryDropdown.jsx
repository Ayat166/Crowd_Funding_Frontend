import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/categoryDropdown.css";
import api from "../utils/axios";

const CategoryDropdown = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("Category");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await api.get("/projects/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    // when URL changes, set the selected category if matching
    const match = location.pathname.match(/^\/category\/(\d+)/);
    if (match && categories.length > 0) {
      const id = parseInt(match[1]);
      const category = categories.find(cat => cat.id === id);
      if (category) {
        setSelectedCategory(category.name);
      } else {
        setSelectedCategory("Category");
      }
    } else {
      setSelectedCategory("Category");
    }
  }, [location, categories]);

  const handleCategorySelect = (id, name) => {
    setSelectedCategory(name);
    navigate(`/category/${id}`);
  };

  return (
    <li
      className="nav-item dropdown"
      onMouseEnter={(e) => e.currentTarget.querySelector(".dropdown-menu").classList.add("show")}
      onMouseLeave={(e) => e.currentTarget.querySelector(".dropdown-menu").classList.remove("show")}
    >
      <a
        className="nav-link dropdown-toggle text-light"
        href="#"
        role="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {selectedCategory}
      </a>
      <ul className="dropdown-menu custom-dropdown-menu">
        {categories.length > 0 ? (
          categories.map((category) => (
            <li key={category.id}>
              <button
                className="dropdown-item custom-dropdown-item"
                onClick={() => handleCategorySelect(category.id, category.name)}
              >
                {category.name}
              </button>
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
