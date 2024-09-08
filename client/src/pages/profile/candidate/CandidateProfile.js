// src/pages/CandidateProfile.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CandidateProfile = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [profile, setProfile] = useState(null);
	const [submissions, setSubmissions] = useState([]);

	const fetchProfile = async () => {
		if (token) {
			console.log("TOKEN EXISTS");
			try {
				const response = await axios.get(
					`http://localhost:5000/api/profile/fetch/candidate`,
					{
						headers: {
							"x-auth-token": token,
						},
					}
				);
				const candidateProfile = response.data;
				console.log("CANDIDATE PROFILE FETCHED USING API");
				setProfile(candidateProfile);
			} catch (error) {
				console.error("Error fetching candidate profile", error);
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

					{profile.postedTasks?.length !== 0 ? (
						<>
							<button
								onClick={() =>
									navigate("/profile/submissions", {
										replace: true,
										state: { submissions: profile.submissions },
									})
								}
							>
								View My Submissions
							</button>
						</>
					) : (
						<>
							<p>No Submissions Made</p>
							<button
								onClick={() =>
									navigate(`/tasks`, {
										replace: true,
									})
								}
							>
								View Tasks
							</button>
						</>
					)}

					<p>Tasks Submitted: {profile.submissions?.length}</p>
					{/* Show task list */}
					<ul>
						{profile.submissions?.map((submission) => (
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
