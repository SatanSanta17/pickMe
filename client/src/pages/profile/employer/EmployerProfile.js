// src/pages/EmployerProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployerProfile = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [profile, setProfile] = useState(null);

	const fetchProfile = async () => {
		if (token) {
			console.log("TOKEN EXISTS");
			try {
				const response = await axios.get(
					"http://localhost:5000/api/profile/fetch/employer",
					{
						headers: {
							"x-auth-token": token,
						},
					}
				);
				const employerProfile = response.data;
				console.log("EMPLOYER PROFILE FETCHED THROUGH API");
				setProfile(employerProfile);
			} catch (error) {
				console.error("Error fetching employer profile", error);
			}
		} else {
			console.log("TOKEN DOESNT EXIST");
		}
	};

	useEffect(() => {
		fetchProfile();
	}, []);

	return (
		<div>
			{profile ? (
				<div>
					<h2>Employer Profile</h2>
					<p>Name: {profile.user.name}</p>
					<p>Email: {profile.user.email}</p>
					<p>Company: {profile.companyName}</p>
					{/* Button to navigate to Task Management Page */}
					{profile.postedTasks?.length !== 0 ? (
						<>
							<button
								onClick={() =>
									navigate("/profile/tasks", {
										replace: true,
										state: { tasks: profile.postedTasks },
									})
								}
							>
								View My Tasks
							</button>
						</>
					) : (
						<>
							<p>No Tasks Created</p>
							<button
								onClick={() =>
									navigate(`/profile/task/create`, {
										replace: true,
									})
								}
							>
								create Task
							</button>
						</>
					)}

					<p>Tasks Posted: {profile.postedTasks?.length}</p>
					{/* Show task list */}
					<ul>
						{profile.postedTasks?.map((task) => (
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
