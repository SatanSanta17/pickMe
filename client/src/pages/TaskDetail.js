import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const TaskDetail = () => {
	const { id } = useParams(); // Get the task ID from the URL
	const [task, setTask] = useState(null);
	const [solution, setSolution] = useState("");

	// Fetch the task details
	const fetchTask = async () => {
		try {
			const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": localStorage.getItem("token"),
				},
			});
			const data = await response.json();
			setTask(data);
		} catch (error) {
			console.error("Error fetching task:", error);
		}
	};

	useEffect(() => {
		fetchTask();
	}, [id]);

	// Handle solution submission
	const submitSolution = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/submission", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"x-auth-token": localStorage.getItem("token"),
				},
				body: JSON.stringify({
					taskId: task._id,
					solution,
				}),
			});

			if (response.ok) {
				alert("Solution submitted successfully!");
				setSolution(""); // Clear the input after submission
			} else {
				alert("Failed to submit solution");
			}
		} catch (error) {
			console.error("Error submitting solution:", error);
		}
	};

	return (
		<div>
			{task ? (
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
			) : (
				<p>Loading task details...</p>
			)}
		</div>
	);
};

export default TaskDetail;
