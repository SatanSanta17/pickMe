import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const TaskSubmissions = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [submissions, setSubmissions] = useState([]);
	const { taskId } = useParams(); // Get the task ID from the URL

	const fetchTaskSubmissions = async (taskId) => {
		console.log(taskId);
		try {
			const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
			const response = await axios.get(
				`http://localhost:5000/api/submission/fetchTaskSubmissions/${taskId}`,
				{
					headers: {
						"x-auth-token": token,
					},
				}
			);
			const taskSubmissions = response.data;
			setSubmissions(taskSubmissions);
			console.log(submissions);
		} catch (err) {
			console.error("Error fetching submissions", err);
		}
	};
	useEffect(() => {
		if (location.state && location.state.submissions) {
			const taskSubmissions = location.state.submissions;
			setSubmissions(taskSubmissions);
		} else fetchTaskSubmissions(taskId);
	}, []);

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
						<button
							onClick={() =>
								navigate(
									`/profile/task/${taskId}/submission/${submission._id}`,
									{ replace: true, state: { submission } }
								)
							}
						>
							View Submission
						</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TaskSubmissions;
