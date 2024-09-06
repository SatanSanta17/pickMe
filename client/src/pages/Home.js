import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ setIsAuthenticated }) => {
	const [user, setUser] = useState(null); // State to hold user data
	const navigate = useNavigate();

	const fetchUserData = async () => {
		const token = localStorage.getItem("token");
		// Make sure the token exists before making a request
		if (token) {
			try {
				const response = await fetch("http://localhost:5000/api/auth/user", {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"x-auth-token": token,
					},
				});
				const userData = await response.json();
				console.log(userData);
				setUser(userData);
			} catch (err) {
				console.error("Error fetching user data", err);
			}
		}
	};
	// Fetch user data when the component mounts
	useEffect(() => {
		fetchUserData();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false);
		navigate("/login");
	};

	return (
		<div>
			<h1>Welcome to the Task-Based Job Portal!</h1>

			{user ? <h2>Hello, {user.name}!</h2> : <p>Loading...</p>}

			<button onClick={handleLogout}>Logout</button>
			<button onClick={() => navigate("/profile")}>Go to Profile</button>
			<button onClick={() => navigate("/tasks")}>View Tasks</button>
		</div>
	);
};

export default Home;
