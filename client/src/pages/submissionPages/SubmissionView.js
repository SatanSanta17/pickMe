import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SubmissionView = () => {
	const { id } = useParams(); // Get submission ID from URL
	const [submission, setSubmission] = useState(null);

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

	if (!submission) {
		return <p>Loading...</p>;
	}

	return (
		<div>
			<h1>Submission Details</h1>
			<h3>Task: {submission.task.title}</h3>
			<p>{submission.task.description}</p>
			<h4>Your Solution:</h4>
			<p>{submission.solution}</p>
		</div>
	);
};

export default SubmissionView;
