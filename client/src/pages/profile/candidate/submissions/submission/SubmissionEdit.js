import { useLocation, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";

const SubmissionActions = () => {
	const location = useLocation();
	const { submissionId } = useParams();
	const [solution, setSolution] = useState("");
	const [loading, setLoading] = useState(true);
	const [submission, setSubmission] = useState(null);

	useEffect(() => {
		// If state is not null, use it; otherwise, fetch the submission
		if (location.state && location.state.submission) {
			const { submission } = location.state;
			setSolution(submission.solution);
			setSubmission(submission);
			setLoading(false);
		} else {
			// Fetch the submission data from the server if state is not available
			const fetchSubmission = async () => {
				try {
					const response = await axios.get(
						`http://localhost:5000/api/submission/fetch/${submissionId}`
					);
					setSolution(response.data.solution);
					setSubmission(response.data);
					setLoading(false);
				} catch (error) {
					console.error("Error fetching submission:", error);
				}
			};
			fetchSubmission();
		}
	}, [location.state, submissionId]);

	// Edit submission
	const handleEdit = async () => {
		console.log("Solution to update:", solution);

		try {
			const response = await axios.put(
				`http://localhost:5000/api/submission/update/${submission._id}`,
				{ solution },
				{ headers: { "x-auth-token": localStorage.getItem("token") } }
			);
			console.log("Submission edited successfully", response.data);
		} catch (err) {
			console.error("Error editing submission", err.response.data);
		}
	};

	if (loading) return <div>Loading...</div>;
	return (
		<div>
			{submission.status === "pending" && (
				<>
					<h2>Edit Submission</h2>
					<textarea
						value={solution}
						onChange={(e) => {
							console.log(e.target.value);
							setSolution(e.target.value);
						}}
					/>
					<button onClick={handleEdit}>Save Edit</button>
				</>
			)}
		</div>
	);
};

export default SubmissionActions;
