import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ setIsAuthenticated }) => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [user, setUser] = useState(null); // State to hold user data

	const fetchUserData = async () => {
		// Make sure the token exists before making a request
		if (token) {
			console.log("TOKEN EXISTS");
			try {
				const response = await axios.get(
					"http://localhost:5000/api/auth/user",
					{
						headers: {
							"Content-Type": "application/json",
							"x-auth-token": token,
						},
					}
				);
				const userData = response.data;
				console.log("USER FETCHED USING API");
				setUser(userData);
			} catch (err) {
				console.error("Error fetching user data", err);
			}
		} else {
			console.log("TOKEN DOESNT EXIST");
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
			<button onClick={() => navigate("/profile", { replace: true })}>
				Go to Profile
			</button>
			<button
				onClick={() => navigate("/tasks", { replace: true, state: { user } })}
			>
				View Tasks
			</button>
		</div>
	);
};

export default Home;
