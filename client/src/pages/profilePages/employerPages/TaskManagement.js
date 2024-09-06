import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TaskManagement = () => {
	const [tasks, setTasks] = useState([]);
	const [newTask, setNewTask] = useState({
		title: "",
		description: "",
		deadline: "",
	});
	const [isEditing, setIsEditing] = useState(false);
	const [editingTaskId, setEditingTaskId] = useState(null);
	const [userRole, setUserRole] = useState(null);
	const navigate = useNavigate();
	const token = localStorage.getItem("token");

	const createTask = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/api/tasks/createTask",
				newTask,
				{ headers: { "x-auth-token": localStorage.getItem("token") } }
			);
			setTasks([...tasks, response.data]);
			setNewTask({ title: "", description: "", deadline: "" });
		} catch (err) {
			console.error("Error creating task", err);
		}
	};

	const fetchMyTasks = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5000/api/tasks/fetchMyTasks",
				{
					headers: { "x-auth-token": token },
				}
			);
			console.log(response.data);
			setTasks(response.data);
		} catch (err) {
			console.error("Error fetching tasks", err);
		}
	};

	const updateTask = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.put(
				`http://localhost:5000/api/tasks/update/${editingTaskId}`,
				newTask,
				{ headers: { "x-auth-token": localStorage.getItem("token") } }
			);
			setTasks(
				tasks.map((task) => (task._id === editingTaskId ? response.data : task))
			);
			setIsEditing(false);
			setEditingTaskId(null);
			setNewTask({ title: "", description: "", deadline: "" });
		} catch (err) {
			console.error("Error updating task", err);
		}
	};

	const handleEdit = (task) => {
		setIsEditing(true);
		setEditingTaskId(task._id);
		setNewTask({
			title: task.title,
			description: task.description,
			deadline: new Date(task.deadline).toISOString().slice(0, 16),
		});
	};

	const deleteTask = async (taskId) => {
		try {
			await axios.delete(`http://localhost:5000/api/tasks/delete/${taskId}`, {
				headers: { "x-auth-token": localStorage.getItem("token") },
			});
			setTasks(tasks.filter((task) => task._id !== taskId));
		} catch (err) {
			console.error("Error deleting task", err);
		}
	};

	// Fetch user data including the role
	const fetchUser = async () => {
		try {
			if (!token) {
				// If no token, redirect to login
				navigate("/login");
				return;
			}

			// Fetch user data
			const response = await axios.get("http://localhost:5000/api/auth/user", {
				headers: { "x-auth-token": token },
			});

			setUserRole(response.data.role); // Set the user role
		} catch (error) {
			console.error("Error fetching user data", error);
			// Redirect to login if there's an error (e.g., invalid token)
			navigate("/login");
		}
	};

	// Redirect candidate users to the home page
	useEffect(() => {
		fetchUser().then(() => {
			if (userRole === "candidate") {
				navigate("/"); // Redirect candidates to home page
			} else if (userRole === "employer") {
				fetchMyTasks(); // Fetch tasks for employers
			}
		});
	}, [userRole, navigate]);

	return (
		<div>
			<h2>Task Management</h2>

			{/* Task Form */}
			<form onSubmit={isEditing ? updateTask : createTask}>
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
				<button type="submit">
					{isEditing ? "Update Task" : "Create Task"}
				</button>
			</form>

			{/* Task List */}
			<h3>Posted Tasks</h3>
			<ul>
				{tasks.map((task) => (
					<li key={task._id}>
						<h4>{task.title}</h4>
						<p>{task.description}</p>
						<p>Deadline: {new Date(task.deadline).toLocaleString()}</p>
						<button onClick={() => navigate(`/task/submissions/${task._id}`)}>
							View Submissions
						</button>
						<button onClick={() => handleEdit(task)}>Edit</button>
						<button onClick={() => deleteTask(task._id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default TaskManagement;
