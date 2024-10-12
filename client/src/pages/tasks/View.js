import React, { useState, useEffect } from "react";
import { taskService } from "../../services";
import TaskCard from "../../components/cards/task";

const View = () => {
	const [tasks, setTasks] = useState([]);
	const [user, setUser] = useState(null); // State to store user role
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Fetch user profile to determine role
		const fetchUser = async () => {
			try {
				setUser(localStorage.getItem("user"));
			} catch (error) {
				console.error("Error fetching user:", error);
			}
		};

		fetchUser();
	}, []);

	useEffect(() => {
		if (user.role) {
			// Fetch tasks based on user role
			const fetchTasks = async () => {
				setLoading(true);
				try {
					let response;
					if (user.role === "candidate") {
						// Fetch all tasks for Candidates
						response = await taskService.fetchAllTasks(); // Replace with your actual API endpoint
					} else if (user.role === "employer") {
						// Fetch tasks posted by this employer
						response = await taskService.fetchEmployerTasks(user.id); // Replace with your actual API endpoint
					}
					setTasks(response.data);
				} catch (error) {
					console.error("Error fetching tasks:", error);
				} finally {
					setLoading(false);
				}
			};
			fetchTasks();
		}
	}, [user]);

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h2>Task List</h2>
			{tasks.length > 0 ? (
				<div className="d-flex flex-wrap justify-content-start">
					{tasks.map((task) => (
						<TaskCard
							key={task._id}
							title={task.taskObject.title}
							company={task.companyName}
							role={task.role}
							deadline={task.deadline}
						/>
					))}
				</div>
			) : (
				<p>No tasks available</p>
			)}
		</div>
	);
};

export default View;
