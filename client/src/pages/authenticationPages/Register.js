// src/pages/Register.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "candidate", // default role
	});
	const { name, email, password, role } = formData;
	const navigate = useNavigate();

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
				"http://localhost:5000/api/auth/register",
				formData
			);
			console.log("REGISTER RESPONSE: ", response);
			const { token } = response.data;
			console.log("TOKEN:", token);
			localStorage.setItem("token", token); // Save token to local storage
			// setIsAuthenticated(true); // Set auth status to true
			navigate("/profile-completion"); // Redirect to login after successful registration
		} catch (error) {
			console.error("Error registering user: ", error.response.data);
		}
	};

	return (
		<div className="d-flex justify-content-center align-items-center mt-5">
			<div className="card col-6">
				<div className="card-body">
					<h2>Register</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label htmlFor="name" className="form-label">
								Name
							</label>
							<input
								type="text"
								className="form-control"
								id="name"
								name="name"
								value={name}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">
								Email address
							</label>
							<input
								type="email"
								className="form-control"
								id="email"
								name="email"
								value={email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="password" className="form-label">
								Password
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								name="password"
								value={password}
								onChange={handleChange}
								required
							/>
						</div>
						<select
							className="form-select mb-3"
							aria-label="Default select example"
							name="role"
							value={role}
							onChange={handleChange}
						>
							<option selected disabled>
								Select
							</option>
							<option value="candidate">Candidate</option>
							<option value="employer">Employer</option>
						</select>
						<button type="submit" className="btn btn-primary">
							Register
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
