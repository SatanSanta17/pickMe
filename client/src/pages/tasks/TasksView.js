import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const TaskList = () => {
	const navigate = useNavigate();
	const location = useLocation();
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
		if (location.state && location.state.user) {
			const currentUser = location.state.user;
			console.log("USER RECEIVED THROUGH STATE");
			setUser(currentUser);
		} else {
			console.log("NO USER RECEIVED THROUGH STATE");
		}
		fetchTasks();
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
