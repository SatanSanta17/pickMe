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

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (token) {
			setIsAuthenticated(true);
		}
	}, [isAuthenticated]);

	const handleLogout = () => {
		localStorage.removeItem("token");
		setIsAuthenticated(false); // Update authentication state
	};

	return (
		<Router>
			<Routes>
				<Route
					path="/"
					element={
						isAuthenticated ? (
							<Home onLogout={handleLogout} />
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
					element={
						isAuthenticated ? (
							<Navigate to="/" />
						) : (
							<Register onRegister={() => setIsAuthenticated(true)} />
						)
					}
				/>
			</Routes>
		</Router>
	);
};

export default App;
