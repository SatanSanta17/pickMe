import React, { useState, useEffect } from "react";
import { taskService, profileService } from "../../../services"; // Import taskService

const Create = () => {
	const [formData, setFormData] = useState({
		role: "",
		experience: "",
		keyResponsibilities: "",
		requiredSkills: "",
		jobDescription: "",
		deadline: "",
		companyName: "",
	});
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(null);
	const [user, setUser] = useState(null);

	useEffect(() => {
		// Fetch user profile to determine profile
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
		// Fetch user profile to determine company name
		const fetchCompanyName = async (userId) => {
			try {
				const { companyName } = await profileService.fetchProfile(userId);
				if (companyName) {
					setFormData((prevData) => ({
						...prevData,
						companyName: companyName,
					}));
				}
			} catch (error) {
				console.error("Error fetching companyName:", error);
			}
		};

		fetchCompanyName(user.id);
	}, []);

	// Handle form input change
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		try {
			await taskService.createTask(formData); // Call the task service to create a task
			setSuccess("Task created successfully!");
			setLoading(false);
			// Reset form if needed
			setFormData({
				role: "",
				experience: "",
				keyResponsibilities: "",
				requiredSkills: "",
				jobDescription: "",
				deadline: "",
				companyName: formData.companyName,
			});
		} catch (error) {
			console.error("Error creating task:", error);
			setLoading(false);
			setSuccess("Error creating task.");
		}
	};

	return (
		<div className="container mt-5">
			<h2>Create Task</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Role</label>
					<input
						type="text"
						className="form-control"
						name="role"
						value={formData.role}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label>Experience</label>
					<input
						type="text"
						className="form-control"
						name="experience"
						value={formData.experience}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label>Key Responsibilities</label>
					<textarea
						className="form-control"
						name="keyResponsibilities"
						value={formData.keyResponsibilities}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label>Required Skills</label>
					<textarea
						className="form-control"
						name="requiredSkills"
						value={formData.requiredSkills}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label>Job Description</label>
					<textarea
						className="form-control"
						name="jobDescription"
						value={formData.jobDescription}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label>Deadline</label>
					<input
						type="date"
						className="form-control"
						name="deadline"
						value={formData.deadline}
						onChange={handleChange}
						required
					/>
				</div>

				<div className="form-group">
					<label>Company Name (Auto-filled)</label>
					<input
						type="text"
						className="form-control"
						name="companyName"
						value={formData.companyName}
						readOnly
					/>
				</div>

				<button type="submit" className="btn btn-primary" disabled={loading}>
					{loading ? "Creating..." : "Create Task"}
				</button>
			</form>

			{success && <p className="mt-3">{success}</p>}
		</div>
	);
};

export default Create;
