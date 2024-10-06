import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import the jwt-decode library

const TaskDetail = () => {
	const { taskId } = useParams(); // Get the task ID from the URL
	const navigate = useNavigate();
	const location = useLocation();
	const token = localStorage.getItem("token");
	const [task, setTask] = useState(null);
	const [solution, setSolution] = useState("");
	const [alreadySubmitted, setAlreadySubmitted] = useState(false);
	const [submissionId, setSubmissionId] = useState(null);

	// Fetch the task details

	const fetchTaskDetails = async () => {
		if (token) {
			console.log("TOKEN EXISTS");
			const decodedToken = jwtDecode(token); // Decode the JWT token
			const userId = decodedToken.user.id; // Assuming the token contains the user ID
			try {
				const response = await axios.get(
					`http://localhost:5000/api/task/fetch/${taskId}`
				);
				const taskDetails = response.data;
				// If the task has already been submitted

				for (let submission of taskDetails.submissions) {
					if (submission.submittedBy._id.toString() === userId) {
						console.log("TASK ALREADY SUBMITTED");
						setAlreadySubmitted(true);
						setSubmissionId(submission._id.toString());
						return;
					}
				}
				console.log("TASK NOT SUBMITTED");
				setTask(taskDetails);
				setAlreadySubmitted(false);
				console.log("TASK RECEIVED THROUGH API");
			} catch (error) {
				console.error("Error fetching task", error);
			}
		} else {
			console.log("TOKEN DOESNT EXIST");
		}
	};

	// Handle solution submission
	const submitSolution = async () => {
		if (token) {
			console.log("TOKEN EXISTS");
			try {
				const response = await axios.post(
					"http://localhost:5000/api/submission/submit",
					{
						taskId: task._id,
						solution,
					},
					{
						headers: {
							"Content-Type": "application/json",
							"x-auth-token": token,
						},
					}
				);

				const submission = response.data;
				alert("Solution submitted successfully!");
				console.log("SOLUTION SUBMITTED");
				setSolution(""); // Clear the input after submission
				navigate(`/profile/submission/${submission._id}`, { replace: true });
			} catch (error) {
				alert("Failed to submit solution");
				console.error("Error submitting solution:", error);
			}
		} else {
			console.log("TOKEN DOESNT EXIST");
		}
	};

	useEffect(() => {
		if (location.state && location.state.user) {
			const currentUser = location.state.user;
			const userId = currentUser.id;
			console.log("USER RECEIVED THROUGH STATE");
			if (location.state && location.state.task) {
				console.log("TASK RECEIVED THROUGH STATE");
				const taskDetails = location.state.task;
				// If the task has already been submitted
				for (let submission of taskDetails.submissions) {
					if (submission.submittedBy._id.toString() === userId) {
						console.log("TASK ALREADY SUBMITTED");
						setAlreadySubmitted(true);
						setSubmissionId(submission._id.toString());
						return;
					}
				}
				console.log("TASK NOT SUBMITTED");
				setTask(taskDetails);
				setAlreadySubmitted(false);
			} else {
				console.log("TASK DID NOT RECEIVED THROUGH STATE");

				fetchTaskDetails();
			}
		} else {
			console.log("USER DID NOT RECEIVED THROUGH STATE");
			fetchTaskDetails();
		}
	}, []);

	return (
		<div>
			{alreadySubmitted ? (
				<>
					<div>Task Already Submitted Please view your submission</div>
					<button
						onClick={() =>
							navigate(`/profile/submission/${submissionId}`, { replace: true })
						}
					>
						View Solution
					</button>
				</>
			) : task ? (
				<>
					<div>
						<h1>{task.taskObject.taskTitle}</h1>
						<p>{task.taskObject.taskObjective}</p>

						{/* Requirements List */}
						<ul>
							{task.taskObject.requirements.map((requirement, index) => (
								<li key={index}>{requirement}</li> // Key added and return fixed
							))}
						</ul>

						{/* Deliverables List */}
						<ul>
							{task.taskObject.deliverables.map((deliverable, index) => (
								<li key={index}>{deliverable}</li> // Key added and return fixed
							))}
						</ul>

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
