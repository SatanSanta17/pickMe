// src/pages/EmployerProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployerProfile = () => {
	const [profile, setProfile] = useState(null);
	const [tasks, setTasks] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					"http://localhost:5000/api/employerProfile/me",
					{
						headers: {
							"x-auth-token": token,
						},
					}
				);
				setProfile(response.data.profile);
				setTasks(response.data.tasks);
			} catch (error) {
				console.error("Error fetching employer profile", error);
			}
		};

		fetchProfile();
	}, []);

	return (
		<div>
			{profile ? (
				<div>
					<h2>Employer Profile</h2>
					<p>Name: {profile.user.name}</p>
					<p>Email: {profile.user.email}</p>
					<p>Company: {profile.company}</p>
					{/* Button to navigate to Task Management Page */}
					<button onClick={() => navigate("/myTasks")}>View My Tasks</button>
					<p>Tasks Posted: {profile.postedTasks?.length}</p>
					{/* Show task list */}
					<ul>
						{tasks?.map((task) => (
							<li key={task._id}>{task.title}</li>
						))}
					</ul>
				</div>
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
};

export default EmployerProfile;
