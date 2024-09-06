import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileCompletion = () => {
	const [userRole, setUserRole] = useState(null);
	const [formData, setFormData] = useState({
		phone: "",
		profilePicture: "",
		resume: "",
		companyLogo: "",
		companyName: "",
	});
	const navigate = useNavigate();

	const { phone, profilePicture, resume, companyLogo, companyName } = formData;

	useEffect(() => {
		// Fetch user data if necessary and pre-fill formData
		const token = localStorage.getItem("token");
		console.log("TOKEN:", token);
		if (token) {
			// Fetch user role from backend
			axios
				.get("http://localhost:5000/api/auth/user", {
					headers: {
						"x-auth-token": token,
					},
				})
				.then((response) => {
					setUserRole(response.data.role);
					console.log(response.data.role);
				})
				.catch((error) => {
					console.error("Error fetching user role", error);
				});
		}
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/api/profile/create",
				{ userRole, formData },
				{
					headers: {
						"x-auth-token": localStorage.getItem("token"),
						"Content-Type": "application/json", // Add this header
					},
				}
			);
			console.log("Profile create response: ", response.data);
			navigate("/"); // Navigate to home after successful login
			// Handle success (navigate, show message, etc.)
		} catch (error) {
			console.error("Profile create error: ", error.response.data);
		}
	};

	return (
		<div className="profile-completion">
			<h2>Complete Your Profile</h2>
			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label>Phone Number</label>
					<input
						type="text"
						name="phone"
						value={phone}
						onChange={handleChange}
					/>
				</div>

				{userRole === "candidate" ? (
					<>
						<div className="form-group">
							<label>Profile Picture</label>
							<input
								type="text"
								name="profilePicture"
								value={profilePicture}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label>Resume</label>
							<input
								type="text"
								name="resume"
								value={resume}
								onChange={handleChange}
							/>
						</div>
					</>
				) : (
					<>
						<div className="form-group">
							<label>Company Logo</label>
							<input
								type="text"
								name="companyLogo"
								value={companyLogo}
								onChange={handleChange}
							/>
						</div>
						<div className="form-group">
							<label>Company Name</label>
							<input
								type="text"
								name="companyName"
								value={companyName}
								onChange={handleChange}
							/>
						</div>
					</>
				)}

				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default ProfileCompletion;
