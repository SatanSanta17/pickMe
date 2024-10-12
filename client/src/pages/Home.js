// src/pages/Home.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth"; // Import the useAuth hook
import { profileService } from "../services";

const Home = () => {
	const navigate = useNavigate();
	const { user, isAuthenticated, logout } = useAuth(); // Get user and auth state from useAuth
	const [profile, setProfile] = useState(null); // State to hold user data

	const fetchUserData = async () => {
		if (isAuthenticated && user) {
			console.log("TOKEN: ", localStorage.getItem("token"));
			console.log("USER: ", JSON.stringify(user));
			console.log("Fetching user data...");
			try {
				const response = await profileService.fetchProfile(user.id);
				const profileData = response.data;
				console.log("Profile fetched using API");
				setProfile(profileData);
			} catch (err) {
				console.error("Error fetching user data", err);
				// Handle potential errors (e.g., token expiration or user not found)
				if (err.response && err.response.status === 401) {
					logout(); // Logout if unauthorized
				}
			}
		} else {
			console.log("User is not authenticated or no user found");
		}
	};

	// Fetch user data when the component mounts
	useEffect(() => {
		fetchUserData();
	}, [isAuthenticated, user]); // Fetch user data when auth state or user changes

	const handleLogout = () => {
		logout(); // Use the logout method from useAuth
		navigate("/login");
	};

	return (
		<div>
			<h1>Welcome to the Task-Based Job Portal!</h1>

			{profile ? <h2>Hello, {profile.user.name}!</h2> : <p>Loading...</p>}

			<button onClick={handleLogout}>Logout</button>
			<button
				onClick={() =>
					navigate("/profile", { replace: true, state: { profile } })
				}
			>
				Go to Profile
			</button>
			<button onClick={() => navigate("/tasks", { replace: true })}>
				View Tasks
			</button>
		</div>
	);
};

export default Home;
