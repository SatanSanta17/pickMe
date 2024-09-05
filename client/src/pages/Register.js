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
			console.log("Register response: ", response);
			navigate("/login"); // Redirect to login after successful registration
		} catch (error) {
			console.error("Error registering user: ", error.response.data);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<h2>Register</h2>
			<input
				type="text"
				name="name"
				placeholder="Name"
				value={name}
				onChange={handleChange}
				required
			/>
			<input
				type="email"
				name="email"
				placeholder="Email"
				value={email}
				onChange={handleChange}
				required
			/>
			<input
				type="password"
				name="password"
				placeholder="Password"
				value={password}
				onChange={handleChange}
				required
			/>
			<select name="role" value={role} onChange={handleChange}>
				<option value="candidate">Candidate</option>
				<option value="employer">Employer</option>
			</select>
			<button type="submit">Register</button>
		</form>
	);
};

export default Register;
