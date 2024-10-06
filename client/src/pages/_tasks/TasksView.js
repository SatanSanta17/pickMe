import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import the jwt-decode library

const TaskList = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [tasks, setTasks] = useState([]);
	const [user, setUser] = useState([]);

	// Fetch all tasks
	const fetchTasks = async () => {
		try {
			const response = await axios.get(
				"http://localhost:5000/api/task/fetchAll",
				{
					headers: {
						"Content-Type": "application/json",
						"x-auth-token": token,
					},
				}
			);
			const availableTasks = await response.data;
			console.log("TASKS RECEIVED THROUGH API");
			setTasks(availableTasks);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		}
	};

	useEffect(() => {
		if (token) {
			console.log("TOKEN EXISTS");
			fetchTasks();
			const decodedToken = jwtDecode(token); // Decode the JWT token
			setUser(decodedToken.user); // Assuming the token contains the user ID
		} else {
			console.log("TOKEN DOESNT EXIST");
		}
	}, []);

	return (
		<div>
			<h1>Available Tasks</h1>
			{tasks.length > 0 ? (
				tasks.map((task) => (
					<div key={task._id}>
						<h2>{task.title}</h2>
						<p>{task.description}</p>
						{/* Navigate to the individual task page */}
						<button
							onClick={() =>
								navigate(`/task/${task._id}`, {
									replace: true,
									state: { task: task, user: user },
								})
							}
						>
							View Task Details
						</button>
					</div>
				))
			) : (
				<p>No tasks available</p>
			)}
		</div>
	);
};

export default TaskList;
