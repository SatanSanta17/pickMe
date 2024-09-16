// src/pages/Login.js
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formData;
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
				"http://localhost:5000/api/auth/login",
				formData
			);
			console.log("Login response: ", response);
			const { token } = response.data;
			console.log("TOKEN:", token);
			localStorage.setItem("token", token); // Save token to local storage
			setIsAuthenticated(true); // Set auth status to true
			navigate("/"); // Navigate to home after successful login
		} catch (error) {
			console.error("Login error: ", error.response.data);
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
