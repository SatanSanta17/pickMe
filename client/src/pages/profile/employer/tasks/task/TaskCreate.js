import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const TaskCreate = () => {
	const navigate = useNavigate();
	const token = localStorage.getItem("token");
	const [formData, setFormData] = useState({
		role: "",
		experience: "",
		keyResponsibilities: "",
		requiredSkills: "",
		jobDescription: "",
		deadline: "",
	});
	const [loading, setLoading] = useState(false);
	const [successMessage, setSuccessMessage] = useState("");

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true); // Show loader
		setSuccessMessage(""); // Clear previous success message

		try {
			const response = await axios.post(
				"http://localhost:5000/api/task/create",
				formData,
				{
					headers: { "x-auth-token": token },
				}
			);
			const taskDetails = response.data;
			console.log("Task generated:", taskDetails);
			setSuccessMessage("Task successfully created!"); // Set success message
			setFormData({
				// Clear inputs
				role: "",
				experience: "",
				keyResponsibilities: "",
				requiredSkills: "",
				jobDescription: "",
			});
			navigate(`/profile/task/${taskDetails._id}`, {
				replace: true,
				state: { task: taskDetails },
			}); // Redirect back to tasks list
		} catch (error) {
			console.error("Error generating task:", error);
			setSuccessMessage("Error generating task. Please try again."); // Set error message
		} finally {
			setLoading(false); // Hide loader
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<label htmlFor="role">Role:</label>
				<input
					type="text"
					name="role"
					value={formData.role}
					onChange={handleChange}
					placeholder="Role"
					required
				/>
				<label htmlFor="experience">Experience in years:</label>
				<input
					type="text"
					name="experience"
					value={formData.experience}
					onChange={handleChange}
					placeholder="Experience"
					required
				/>

				<label htmlFor="keyResponsibilities">Key Responsibilities:</label>
				<textarea
					id="keyResponsibilities"
					name="keyResponsibilities"
					value={formData.keyResponsibilities}
					onChange={handleChange}
					required
				></textarea>
				<br />
				<label htmlFor="requiredSkills">Required Skills:</label>
				<textarea
					id="requiredSkills"
					name="requiredSkills"
					value={formData.requiredSkills}
					onChange={handleChange}
					required
				></textarea>
				<br />
				<label htmlFor="jobDescription">Job Description:</label>
				<textarea
					id="jobDescription"
					name="jobDescription"
					value={formData.jobDescription}
					onChange={handleChange}
					required
				></textarea>
				<br />
				<input
					id="deadline"
					name="deadline"
					type="datetime-local"
					value={formData.deadline}
					onChange={handleChange}
					required
				/>
				<button type="submit" disabled={loading}>
					{loading ? "Generating..." : "Generate Task"}
				</button>
			</form>
			{loading && <div>Loading...</div>} {/* Show loader */}
			{successMessage && <div>{successMessage}</div>}{" "}
			{/* Show success or error message */}
		</div>
	);
};

export default TaskCreate;
