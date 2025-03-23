# Crowd-Funding Web App (Frontend)

## 📌 Project Overview
This is the **frontend** for the **Crowd-Funding Web Application**, built using **React.js** with **Vite** for fast development and **Bootstrap** for styling. The web app allows users to create fundraising projects, donate, comment, and manage their profiles.

## 🚀 Technologies Used
- **React.js** (Frontend Framework)
- **Vite** (Build Tool for Fast Performance)
- **React Router** (For Navigation)
- **Bootstrap** (UI Framework)
- **Axios** (For API Requests)

## ✨ Features Implemented
1. **User Authentication**
   - Registration with email verification
   - Login & Logout
   - Profile Management

2. **Project Management**
   - Users can create, view, and manage fundraising projects
   - Project details include title, description, images, target amount, and category
   - Users can donate and comment on projects

3. **Frontend Components**
   - ✅ **Navbar:** For navigation
   - ✅ **Footer:** With copyright info
   - ✅ **Homepage:** Displays featured projects
   - ✅ **Project Page:** Shows project details, comments, and donation options

## 🛠️ Getting Started

### 1️⃣ Clone the Repository
```sh
git clone https://github.com/Ayat166/Crowd_Funding_Frontend.git
cd crowdfunding-frontend
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Start the Development Server
```sh
npm run dev
```
The frontend will be available at **`http://localhost:5173/`**.

---

## 🏰️ **Project Structure**
```
📛 crowdfunding-frontend
 ├📂 src
 ┃ ├📂 components  # Reusable UI Components (Navbar, Footer)
 ┃ ├📂 pages       # Page Components (Home, Login, Signup)
 ┃ ├📂 services    # API Calls using Axios
 ┃ ├💚 App.jsx     # Main App Component
 ┃ ├💚 main.jsx    # React DOM Rendering
 ┃ ├💚 index.css   # Global Styles
 ├💚 package.json  # Project Dependencies
 ├💚 README.md     # Project Documentation
```

---

## 🌿 **Contributing (Branching Strategy)**
Each team member should work on their feature separately using Git branches.

### 1️⃣ Pull the Latest Code Before Working
```sh
git pull origin main
```

### 2️⃣ Create a New Branch
```sh
git checkout -b your-name   # ex: checkout -b amera
```

### 3️⃣ Make Changes & Commit
```sh
git add .
git commit -m "Added navbar component"
```

### 4️⃣ Push to GitHub
```sh
git push origin your-name
```

Happy Coding! 🚀

