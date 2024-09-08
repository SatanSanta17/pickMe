import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const TasksView = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const location = useLocation();
	const [tasks, setTasks] = useState([]);

	const fetchMyTasks = async () => {
		if (token) {
			console.log("TOKEN EXISTS");
			try {
				const response = await axios.get(
					"http://localhost:5000/api/task/fetchMyTasks",
					{
						headers: { "x-auth-token": token },
					}
				);
				const myTasks = response.data;
				console.log("MY TASKS FETCHED USING API");
				setTasks(myTasks);
			} catch (err) {
				console.error("Error fetching tasks", err);
			}
		} else {
			console.log("TOKEN DOESNT EXIST");
		}
	};

	const deleteTask = async (taskId) => {
		try {
			const response = await axios.delete(
				`http://localhost:5000/api/task/delete/${taskId}`,
				{
					headers: { "x-auth-token": localStorage.getItem("token") },
				}
			);
			alert("TASK DELETED SUCCESSFULLY");
			console.log("TASK DELETED SUCCESSFULLY USING API.", response.msg);
			const updatedTasks = tasks.filter((task) => task._id !== taskId);
			setTasks(updatedTasks);
			navigate("/profile/tasks", {
				replace: true,
				state: { tasks: updatedTasks },
			});
		} catch (err) {
			console.error("Error deleting task", err);
			alert("TASK DID NOT DELETE");
		}
	};

	// Redirect candidate users to the home page
	useEffect(() => {
		if (location.state && location.state.tasks) {
			console.log("MY TASKS FETCHED USING STATE");
			const myTasks = location.state.tasks;
			setTasks(myTasks);
		} else fetchMyTasks();
	}, []);

	return (
		<div>
			<h2>Task Management</h2>

			{/* Task List */}
			<h3>Posted Tasks</h3>
			<ul>
				{tasks.map((task) => (
					<li key={task._id}>
						<h4>{task.title}</h4>
						<p>{task.description}</p>
						<p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
						<button
							onClick={() =>
								navigate(`/profile/task/${task._id}`, {
									replace: true,
									state: { task },
								})
							}
						>
							View Task
						</button>
						<button onClick={() => deleteTask(task._id)}>Delete</button>
					</li>
				))}
			</ul>
			<button
				onClick={() =>
					navigate(`/profile/task/create`, {
						replace: true,
					})
				}
			>
				create Task
			</button>
		</div>
	);
};

export default TasksView;
