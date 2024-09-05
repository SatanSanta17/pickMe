// src/pages/CandidateProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const CandidateProfile = () => {
	const [profile, setProfile] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					"http://localhost:5000/api/candidateProfile/me",
					{
						headers: {
							"x-auth-token": token,
						},
					}
				);
				setProfile(response.data);
			} catch (error) {
				console.error("Error fetching candidate profile", error);
			}
		};

		fetchProfile();
	}, []);

	return (
		<div>
			{profile ? (
				<div>
					<h2>Candidate Profile</h2>
					<p>Name: {profile.user.name}</p>
					<p>Email: {profile.user.email}</p>
					<p>
						Resume:{" "}
						{profile.resume ? (
							<a href={profile.resume}>Download Resume</a>
						) : (
							"Not uploaded"
						)}
					</p>
					<p>Tasks Applied: {profile.appliedTasks?.length}</p>
					{/* Show task list */}
					<ul>
						{profile.appliedTasks?.map((task) => (
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

export default CandidateProfile;
