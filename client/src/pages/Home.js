// src/pages/Home.js
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ setIsAuthenticated }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		navigate("/login");
	};

	return (
		<div>
			<h1>Welcome to the Task-Based Job Portal!</h1>
			<button onClick={handleLogout}>Logout</button>
			<button onClick={() => navigate("/profile")}>Go to Profile</button>
			<button onClick={() => navigate("/tasks")}>View Tasks</button>
		</div>
	);
};

export default Home;
