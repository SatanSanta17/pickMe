// src/App.js
import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateProfile from "./pages/CandidateProfile";
import EmployerProfile from "./pages/EmployerProfile";
import axios from "axios";

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
			// Fetch user role from backend
			axios
				.get("http://localhost:5000/api/auth/user", {
					headers: {
						"x-auth-token": token,
					},
				})
				.then((response) => {
					setUserRole(response.data.role);
				})
				.catch((error) => {
					console.error("Error fetching user role", error);
				});
		}
	}, []);

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						isAuthenticated ? (
							<Home setIsAuthenticated={setIsAuthenticated} />
						) : (
							<Navigate to="/login" />
						)
					}
				/>
				<Route
					path="/login"
					element={
						isAuthenticated ? (
							<Navigate to="/" />
						) : (
							<Login setIsAuthenticated={setIsAuthenticated} />
						)
					}
				/>
				<Route
					path="/register"
					element={isAuthenticated ? <Navigate to="/" /> : <Register />}
				/>
				<Route
					path="/profile"
					element={
						isAuthenticated ? (
							userRole === "candidate" ? (
								<CandidateProfile />
							) : (
								<EmployerProfile />
							)
						) : (
							<Navigate to="/login" />
						)
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
