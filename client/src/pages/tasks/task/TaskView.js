import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const TaskDetail = () => {
	const { id } = useParams(); // Get the task ID from the URL
	const [task, setTask] = useState(null);
	const [solution, setSolution] = useState("");
	const navigate = useNavigate();
	const [alreadySubmitted, setAlreadySubmitted] = useState(false);
	const [submissionId, setSubmissionId] = useState(null);

	// Fetch the task details

	useEffect(() => {
		const fetchTaskData = async () => {
			const token = localStorage.getItem("token");
			if (token) {
				try {
					const response = await axios.get(
						`http://localhost:5000/api/tasks/fetch/${id}`,
						{
							headers: {
								"x-auth-token": token,
							},
						}
					);

					// If the task has already been submitted
					if (response.data.alreadySubmitted) {
						console.log(response.data);
						setAlreadySubmitted(true);
						setSubmissionId(response.data.submissionID);
						// Redirect to the submission view page
						// navigate(`/submission/${response.data.submissionId}`);
					} else {
						console.log(response.data);
						setTask(response.data);
						setAlreadySubmitted(false);
					}
				} catch (error) {
					console.error("Error fetching task", error);
				}
			}
		};

		fetchTaskData();
	}, [id, navigate]);

	// Handle solution submission
	const submitSolution = async () => {
		try {
			const response = await fetch(
				"http://localhost:5000/api/submission/submit",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"x-auth-token": localStorage.getItem("token"),
					},
					body: JSON.stringify({
						taskId: task._id,
						solution,
					}),
				}
			);

			if (response.ok) {
				// Properly parse the response as JSON
				const userData = await response.json();
				console.log(userData);
				setSubmissionId(userData._id);
				alert("Solution submitted successfully!");
				setSolution(""); // Clear the input after submission
				navigate(`/submission/${submissionId}`, { replace: true });
			} else {
				alert("Failed to submit solution");
			}
		} catch (error) {
			console.error("Error submitting solution:", error);
		}
	};

	return (
		<div>
			{alreadySubmitted ? (
				<>
					<div>Task Already Submitted Please view your submission</div>
					<button
						onClick={() =>
							navigate(`/submission/${submissionId}`, { replace: true })
						}
					>
						Submit Solution
					</button>
				</>
			) : task ? (
				<>
					<div>
						<h1>{task.title}</h1>
						<p>{task.description}</p>
						<p>Deadline: {new Date(task.deadline).toLocaleDateString()}</p>

						{/* Solution submission form */}
						<textarea
							value={solution}
							onChange={(e) => setSolution(e.target.value)}
							placeholder="Enter your solution here"
							required
						/>
						<button onClick={submitSolution}>Submit Solution</button>
					</div>
				</>
			) : (
				<>
					<p>Loading task details...</p>
				</>
			)}
		</div>
	);
};

export default TaskDetail;
