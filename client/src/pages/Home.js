import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = ({ setIsAuthenticated }) => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [profile, setProfile] = useState(null); // State to hold user data

	const fetchUserData = async () => {
		// Make sure the token exists before making a request
		if (token) {
			console.log("TOKEN EXISTS");
			const decodedToken = jwtDecode(token); // Decode the JWT token
			const userRole = decodedToken.user.userRole;
			try {
				const response = await axios.get(
					`http://localhost:5000/api/profile/${userRole}`,
					{
						headers: {
							"Content-Type": "application/json",
							"x-auth-token": token,
						},
					}
				);
				const profileData = response.data;
				console.log("PROFILE FETCHED USING API");
				setProfile(profileData);
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

			{user ? <h2>Hello, {profile.user.name}!</h2> : <p>Loading...</p>}

			<button onClick={handleLogout}>Logout</button>
			<button
				onClick={() =>
					navigate("/profile", { replace: true, state: { profile } })
				}
			>
				Go to Profile
			</button>
			<button
				onClick={() =>
					navigate("/tasks", { replace: true, state: { user: profile.user } })
				}
			>
				View Tasks
			</button>
		</div>
	);
};

export default Home;
