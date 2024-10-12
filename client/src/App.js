// src/App.js
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes"; // Import the routes

const App = () => {
	const { isAuthenticated, user } = useAuth(); // Use the login function from the auth hook

	return (
		<div className="container">
			<div className="row">
				<Router>
					<AppRoutes isAuthenticated={isAuthenticated} user={user} />
				</Router>
			</div>
		</div>
	);
};

export default App;
