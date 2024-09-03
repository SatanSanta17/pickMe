import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const navigate = useNavigate();

	const handleLogin = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/api/users/login",
				{ email, password }
			);
			console.log("RESPONSE: ", response);
			// Access the token and user from the response
			if (response && response.data) {
				const { token, user } = response.data;
				localStorage.setItem("token", token); // Save token to local storage
				console.log("Navigating to Home"); // Debugging
				navigate("/"); // Redirect to home page
			} else {
				console.error("Unexpected response structure:", response);
			}
			setIsAuthenticated(true);
		} catch (error) {
			console.error(error.response.data);
			// Handle login error
		}
	};

	return (
		<form onSubmit={handleLogin}>
			<h2>Login</h2>
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
			<button type="submit">Login</button>
		</form>
	);
};

export default Login;
