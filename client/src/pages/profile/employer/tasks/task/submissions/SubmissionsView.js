import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const TaskSubmissions = () => {
	const [submissions, setSubmissions] = useState([]);
	const { id } = useParams(); // Get the task ID from the URL

	useEffect(() => {
		const fetchSubmissions = async () => {
			console.log(id);
			try {
				const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
				const response = await axios.get(
					`http://localhost:5000/api/submission/fetchTaskSubmissions/${id}`,
					{
						headers: {
							"x-auth-token": token,
						},
					}
				);
				setSubmissions(response.data);
				console.log(submissions);
			} catch (err) {
				console.error("Error fetching submissions", err);
			}
		};

		fetchSubmissions();
	}, [id]);

	return (
		<div>
			<h3>Submissions for Task</h3>
			<h3>Number of Submissions:{submissions.length}</h3>

			<ul>
				{submissions.map((submission) => (
					<li key={submission._id}>
						{/* Customize based on what your submission object contains */}
						<p>Submitted by: {submission.submittedBy.name}</p>
						<p>Solution: {submission.solution}</p>
						<p>
							Date Submitted:{" "}
							{new Date(submission.submittedAt).toLocaleDateString()}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TaskSubmissions;
