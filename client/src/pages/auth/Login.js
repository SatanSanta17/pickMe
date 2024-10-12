// src/pages/Login.js
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth"; // Import the useAuth hook
import { useNavigate } from "react-router-dom";

const Login = () => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formData;
	const navigate = useNavigate();

	const { login } = useAuth(); // Use the login function from the auth hook

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await login(email, password); // Call the login function
			navigate("/"); // Navigate to home after successful login
		} catch (error) {
			console.error("Login error: ", error.message); // Use error.message for better readability
		}
	};

	return (
		<form onSubmit={handleSubmit} className="col-6 m-auto">
			<div className="mb-3">
				<label htmlFor="exampleInputEmail1" className="form-label">
					Email address
				</label>
				<input
					type="email"
					className="form-control"
					id="exampleInputEmail1"
					aria-describedby="emailHelp"
					name="email"
					placeholder="Email"
					value={email}
					onChange={handleChange}
					required
				/>
			</div>
			<div className="mb-3">
				<label htmlFor="exampleInputPassword1" className="form-label">
					Password
				</label>
				<input
					type="password"
					className="form-control"
					id="exampleInputPassword1"
					name="password"
					placeholder="Password"
					value={password}
					onChange={handleChange}
					required
				/>
			</div>
			<button type="submit" className="btn btn-primary">
				Login
			</button>
		</form>
	);
};

export default Login;
