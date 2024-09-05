// src/pages/EmployerProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const EmployerProfile = () => {
	const [profile, setProfile] = useState(null);
	const [tasks, setTasks] = useState(null);

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
				setProfile(response.data);
			} catch (error) {
				console.error("Error fetching employer profile", error);
			}
		};
		const fetchTasks = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get("http://localhost:5000/api/tasks/", {
					headers: {
						"x-auth-token": token,
					},
				});
				setTasks(response.data);
			} catch (error) {
				console.error("Error fetching employer profile", error);
			}
		};

		fetchProfile();
		fetchTasks();
	}, []);

	return (
		<div>
			{profile ? (
				<div>
					<h2>Employer Profile</h2>
					<p>Name: {profile.user.name}</p>
					<p>Email: {profile.user.email}</p>
					<p>Company: {profile.company}</p>
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
