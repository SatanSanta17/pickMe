import React, { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SubmissionView = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const { submissionId } = useParams(); // Get submission ID from URL
	const [submission, setSubmission] = useState(null);

	const fetchSubmission = async (submissionId) => {
		if (token) {
			console.log("TOKEN EXISTS");
			try {
				const response = await axios.get(
					`http://localhost:5000/api/submission/fetch/${submissionId}`,
					{
						headers: { "x-auth-token": token },
					}
				);
				const taskSubmission = response.data;
				console.log("TASK SUBMISSION FETCHED USING API");
				setSubmission(taskSubmission);
			} catch (err) {
				console.error(err);
			}
		} else {
			console.log("TOKEN DOESNT EXIST");
		}
	};

	// Delete submission
	const handleDelete = async (submissionId) => {
		try {
			const response = await axios.delete(
				`http://localhost:5000/api/submission/delete/${submissionId}`,
				{ headers: { "x-auth-token": localStorage.getItem("token") } }
			);
			console.log("SUBMISSION DELETED SUCCESSFULLY");
			alert("Submission deleted successfully", response.msg);
			navigate("/profile/submissions", { replace: true });
		} catch (err) {
			console.error("Error deleting submission", err.response.data);
		}
	};

	useEffect(() => {
		if (location.state && location.state.submission) {
			console.log("TASK SUBMISSION FETCHED USING STATE");
			const taskSubmission = location.state.submission;
			setSubmission(taskSubmission);
		} else fetchSubmission(submissionId);
	}, []);

	if (!submission) {
		return <p>Loading...</p>;
	}

	return (
		<>
			<div>
				<h1>Submission Details</h1>
				<h3>Task: {submission.task.title}</h3>
				<p>{submission.task.description}</p>
				<h4>Your Solution:</h4>
				<p>{submission.solution}</p>
				<h4>Submission Status:</h4>
				<p>{submission.status}</p>
			</div>
			<div>
				{submission.status === "pending" ? (
					<>
						<button
							onClick={() => {
								if (submission) {
									navigate(`/profile/submission/edit/${submission._id}`, {
										state: { submission }, // Ensure submission exists here
									});
								} else {
									console.error("Submission is undefined!");
								}
							}}
						>
							Edit Submission
						</button>

						<button onClick={handleDelete}>Delete Submission</button>
					</>
				) : (
					<>SUBMISSION IS UNDER REVIEW</>
				)}
			</div>
		</>
	);
};

export default SubmissionView;
