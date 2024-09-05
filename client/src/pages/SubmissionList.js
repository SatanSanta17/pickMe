import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SubmissionList = () => {
	const [submissions, setSubmissions] = useState([]);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSubmissions = async () => {
			try {
				const token = localStorage.getItem("token"); // Get token
				const response = await axios.get(
					"http://localhost:5000/api/submission/my-submissions",
					{
						headers: { "x-auth-token": token },
					}
				);
				setSubmissions(response.data);
				console.log(submissions);
			} catch (err) {
				console.error(err);
			}
		};

		fetchSubmissions();
	}, []);

	const viewSubmission = (id) => {
		navigate(`/submission/${id}`);
	};

	return (
		<div>
			<h1>Your Submissions</h1>
			{submissions.length === 0 ? (
				<p>No submissions found</p>
			) : (
				<ul>
					{submissions.map((submission) => (
						<li key={submission._id}>
							<h3>{submission.task.title}</h3>
							<p>{submission.task.description}</p>
							<button onClick={() => viewSubmission(submission._id)}>
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
