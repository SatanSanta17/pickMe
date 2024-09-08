import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const SubmissionList = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const location = useLocation();
	const [submissions, setSubmissions] = useState([]);

	const fetchMySubmissions = async () => {
		if (token) {
			console.log("TOKEN EXISTS");
			try {
				const response = await axios.get(
					"http://localhost:5000/api/submission/fetchMySubmissions",
					{
						headers: { "x-auth-token": token },
					}
				);
				const mySubmissions = response.data;
				console.log("MY SUBMISSIONS FETCHED USING API");
				setSubmissions(mySubmissions);
			} catch (err) {
				console.error(err);
			}
		} else {
			console.log("TOKEN DOESNT EXIST");
		}
	};

	useEffect(() => {
		if (location.state && location.state.submissions) {
			console.log("MY SUBMISSIONS FETCHED USING STATE");
			const mySubmissions = location.state.submissions;
			setSubmissions(mySubmissions);
		} else fetchMySubmissions();
	}, []);

	return (
		<div>
			<h1>Your Submissions</h1>
			{submissions?.length === 0 ? (
				<p>No submissions found</p>
			) : (
				<ul>
					{submissions?.map((submission) => (
						<li key={submission._id}>
							<h3>{submission.task.title}</h3>
							<p>{submission.task.description}</p>
							<button
								onClick={() =>
									navigate(`/profile/submission/${submission._id}`, {
										replace: true,
										state: { submission },
									})
								}
							>
								View Submission
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default SubmissionList;
