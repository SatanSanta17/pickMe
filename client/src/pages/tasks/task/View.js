import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { taskService, submissionService } from "../../../services";
import { useAuth } from "../../../hooks/useAuth"; // Assuming you have an auth hook

const View = () => {
	const auth = useAuth();
	const { user } = auth; // Now it is safe to destructure
	const { taskId } = useParams();
	const [task, setTask] = useState(null);
	const [alreadySubmitted, setAlreadySubmitted] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchTaskData = async () => {
			try {
				const taskData = await taskService.fetchTask(taskId);
				setTask(taskData);

				// Check if the user is a candidate and has already submitted the task
				if (user.role === "candidate") {
					const submissions = await submissionService.viewSubmissionsByTask(
						taskId
					);
					const submitted = submissions.some(
						(submission) => submission.submittedBy === user.id
					);
					setAlreadySubmitted(submitted);
				}
			} catch (error) {
				console.error("Error fetching task data", error);
			} finally {
				setLoading(false);
			}
		};

		fetchTaskData();
	}, [taskId, user]);

	if (loading) {
		return <div>Loading...</div>;
	}

	// Check if auth is valid before destructuring
	if (!auth) {
		return <div>Loading...</div>; // Or handle null case
	}

	if (!task) {
		return <div>Task not found!</div>;
	}

	return (
		<div className="container mt-5">
			<h1 className="text-center mb-4">{task.taskObject.taskTitle}</h1>

			{/* Task Details */}
			<div className="card mb-4">
				<div className="card-body">
					<h5 className="card-title">Task Objective</h5>
					<p>{task.taskObject.taskObjective}</p>

					<h5 className="card-title">Requirements</h5>
					<ul>
						{task.taskObject.requirements.map((req, idx) => (
							<li key={idx}>{req}</li>
						))}
					</ul>

					<h5 className="card-title">Deliverables</h5>
					<ul>
						{task.taskObject.deliverables.map((deliverable, idx) => (
							<li key={idx}>{deliverable}</li>
						))}
					</ul>

					<h5 className="card-title">Timeline</h5>
					<p>{task.taskObject.timeline}</p>

					<h5 className="card-title">Company Name</h5>
					<p>{task.companyName}</p>

					<h5 className="card-title">Status</h5>
					<p>{task.status === "open" ? "Open for submissions" : "Closed"}</p>

					<h5 className="card-title">Deadline</h5>
					<p>{new Date(task.deadline).toLocaleDateString()}</p>

					<h5 className="card-title">Submissions</h5>
					<p>{task.submissions.length} submissions received</p>
				</div>
			</div>

			{/* Conditional UI based on user role */}
			{user.role === "candidate" ? (
				alreadySubmitted ? (
					<div className="alert alert-info">
						You have already submitted this task.{" "}
						<a href={`/view-submission/${taskId}`}>View your submission</a>.
					</div>
				) : (
					<div className="alert alert-success">
						This task is open for submission. You can submit your solution{" "}
						<a href={`/submit-task/${taskId}`}>here</a>.
					</div>
				)
			) : user.role === "employer" ? (
				<div>
					<button className="btn btn-primary mr-2" onClick={() => {}}>
						Edit Task
					</button>
					<button className="btn btn-danger" onClick={() => {}}>
						Delete Task
					</button>
				</div>
			) : null}
		</div>
	);
};

export default View;
