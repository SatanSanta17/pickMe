// src/pages/CandidateProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CandidateProfile = () => {
	const [profile, setProfile] = useState(null);
	const [submissions, setSubmissions] = useState(null);
	const navigate = useNavigate();

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
				console.log(response.data);
				setProfile(response.data.profile);
				setSubmissions(response.data.submissions);
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

					<button onClick={() => navigate("/my-submissions")}>
						View My Submissions
					</button>
					<p>Tasks Submitted: {submissions?.length}</p>
					{/* Show task list */}
					<ul>
						{submissions?.map((submission) => (
							<li key={submission.task._id}>{submission.task.title}</li>
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
