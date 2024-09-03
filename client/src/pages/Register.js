import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = ({ setIsAuthenticated }) => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleRegister = async (e) => {
		e.preventDefault();
		try {
			await axios.post("http://localhost:5000/api/users/register", {
				name,
				email,
				password,
			});
			navigate("/login"); // Redirect to login page after successful registration
		} catch (error) {
			console.error(error.response.data);
			// Handle registration error
		}
	};

	return (
		<form onSubmit={handleRegister}>
			<h2>Register</h2>
			<input
				type="text"
				placeholder="Name"
				value={name}
				onChange={(e) => setName(e.target.value)}
				required
			/>
			<input
				type="email"
				placeholder="Email"
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				required
			/>
			<input
				type="password"
				placeholder="Password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				required
			/>
			<button type="submit">Register</button>
		</form>
	);
};

export default Register;
