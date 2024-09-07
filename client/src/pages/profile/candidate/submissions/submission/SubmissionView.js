import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SubmissionView = () => {
	const { id } = useParams(); // Get submission ID from URL
	const [submission, setSubmission] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const fetchSubmission = async () => {
			try {
				const token = localStorage.getItem("token");
				const response = await axios.get(
					`http://localhost:5000/api/submission/fetch/${id}`,
					{
						headers: { "x-auth-token": token },
					}
				);
				setSubmission(response.data);
			} catch (err) {
				console.error(err);
			}
		};

		fetchSubmission();
	}, [id]);

	// Delete submission
	const handleDelete = async () => {
		try {
			const response = await axios.delete(
				`http://localhost:5000/api/submission/delete/${submission._id}`,
				{ headers: { "x-auth-token": localStorage.getItem("token") } }
			);
			navigate("/my-submissions", { replace: true });
			console.log("Submission deleted successfully", response.data);
		} catch (err) {
			console.error("Error deleting submission", err.response.data);
		}
	};

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
			</div>
			<div>
				{submission.status === "pending" && (
					<>
						<button
							onClick={() => {
								if (submission) {
									navigate(`/submission/${submission._id}/edit`, {
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
				)}
			</div>
		</>
	);
};

export default SubmissionView;
