// CreateTask.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TaskCreate = () => {
	const navigate = useNavigate();
	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		deadline: "",
	});
	const token = localStorage.getItem("token");

	const createTask = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/api/task/create",
				newTask,
				{
					headers: { "x-auth-token": token },
				}
			);
			const taskDetails = response.data;
			setNewTask({ title: "", description: "", deadline: "" });
			navigate(`/profile/task/${taskDetails._id}`, {
				replace: true,
				state: { task: taskDetails },
			}); // Redirect back to tasks list
		} catch (err) {
			console.error("Error creating task", err);
		}
	};

	return (
		<div>
			<h2>Create Task</h2>
			<form onSubmit={createTask}>
				<input
					type="text"
					placeholder="Title"
					value={newTask.title}
					onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
					required
				/>
				<textarea
					placeholder="Description"
					value={newTask.description}
					onChange={(e) =>
						setNewTask({ ...newTask, description: e.target.value })
					}
					required
				/>
				<input
					type="datetime-local"
					value={newTask.deadline}
					onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
					required
				/>
				<button type="submit">Create Task</button>
			</form>
		</div>
	);
};

export default TaskCreate;
