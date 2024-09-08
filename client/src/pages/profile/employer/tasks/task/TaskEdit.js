// EditTask.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const TaskEdit = () => {
	const location = useLocation();
	const [task, setTask] = useState({
		title: "",
		description: "",
		deadline: "",
	});
	const { taskId } = useParams(); // To get the task ID from the URL
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const fetchTask = async () => {
		try {
			const response = await axios.get(
				`http://localhost:5000/api/task/fetch/${taskId}`,
				{
					headers: { "x-auth-token": token },
				}
			);
			const myTask = response.data;
			setTask({
				title: myTask.title,
				description: myTask.description,
				deadline: new Date(myTask.deadline).toISOString().slice(0, 16),
			});
		} catch (err) {
			console.error("Error fetching task", err);
		}
	};
	useEffect(() => {
		if (location.state && location.state.task) {
			console.log("USING LOCAL STATE");
			const myTask = location.state.task;
			setTask({
				title: myTask.title,
				description: myTask.description,
				deadline: new Date(myTask.deadline).toISOString().slice(0, 16),
			});
		} else fetchTask(taskId);
	}, []);

	const updateTask = async (e) => {
		e.preventDefault();
		try {
			await axios.put(`http://localhost:5000/api/task/update/${taskId}`, task, {
				headers: { "x-auth-token": token },
			});
			navigate(`/profile/task/${taskId}`, { replace: true }); // Redirect back to tasks list
		} catch (err) {
			console.error("Error updating task", err);
		}
	};

	return (
		<div>
			<h2>Edit Task</h2>
			<form onSubmit={updateTask}>
				<input
					type="text"
					placeholder="Title"
					value={task.title}
					onChange={(e) => setTask({ ...task, title: e.target.value })}
					required
				/>
				<textarea
					placeholder="Description"
					value={task.description}
					onChange={(e) => setTask({ ...task, description: e.target.value })}
					required
				/>
				<input
					type="datetime-local"
					value={task.deadline}
					onChange={(e) => setTask({ ...task, deadline: e.target.value })}
					required
				/>
				<button type="submit">Update Task</button>
			</form>
		</div>
	);
};

export default TaskEdit;
