import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
	const [tasks, setTasks] = useState([]);
	const navigate = useNavigate();

	// Fetch all tasks
	const fetchTasks = async () => {
		try {
			const response = await fetch("http://localhost:5000/api/tasks/fetchAll", {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			setTasks(data);
		} catch (error) {
			console.error("Error fetching tasks:", error);
		}
	};

	useEffect(() => {
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
						<button onClick={() => navigate(`/tasks/${task._id}`)}>
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
