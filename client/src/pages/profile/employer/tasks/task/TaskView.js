// TaskDetails.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const TaskView = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const { taskId } = useParams(); // To get the task ID from the URL
	const token = localStorage.getItem("token");
	const [task, setTask] = useState(null);

	// Fetch task details based on task ID
	const fetchTask = async (taskId) => {
		if (token) {
			console.log("TOKEN EXISTS");
			try {
				const response = await axios.get(
					`http://localhost:5000/api/task/fetch/${taskId}`,
					{
						headers: { "x-auth-token": token },
					}
				);
				const myTask = response.data;
				console.log("MY TASK FETCHED USING API");
				setTask(myTask);
			} catch (err) {
				console.error("Error fetching task details", err);
			}
		} else {
			console.log("TOKEN DOESNT EXIST");
		}
	};

	useEffect(() => {
		if (location.state && location.state.task) {
			console.log("MY TASK FETCHED USING STATE");
			const myTask = location.state.task;
			setTask(myTask);
		} else fetchTask(taskId);
	}, []);

	if (!task) return <p>Loading task details...</p>; // Show a loading message until task details are fetched

	return (
		<div>
			<h2>Task Details</h2>
			<h3>{task.title}</h3>
			<p>{task.description}</p>
			<p>{task.status}</p>
			<p>Deadline: {new Date(task.deadline).toLocaleString()}</p>

			{/* Button to navigate to the Edit Task page */}
			<button
				onClick={() =>
					navigate(`/profile/task/edit/${task._id}`, {
						replace: true,
						state: { task },
					})
				}
			>
				Edit Task
			</button>
			{/* Button to navigate to the Edit Task page */}
			<button
				onClick={() =>
					navigate(`/profile/task/${task._id}/submissions`, {
						replace: true,
						state: { submissions: task.submissions },
					})
				}
			>
				View Submissions
			</button>
		</div>
	);
};

export default TaskView;
