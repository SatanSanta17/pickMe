// src/App.js
import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/authenticationPages/Login";
import Register from "./pages/authenticationPages/Register";
import CandidateProfile from "./pages/profilePages/candidatePages/CandidateProfile";
import EmployerProfile from "./pages/profilePages/employerPages/EmployerProfile";
import axios from "axios";
import TaskManagement from "./pages/profilePages/employerPages/TaskManagement";
import TaskList from "./pages/taskPages/TaskList";
import TaskDetail from "./pages/taskPages/TaskDetail";
import SubmissionList from "./pages/profilePages/candidatePages/SubmissionList";
import SubmissionView from "./pages/submissionPages/SubmissionView";
import TaskSubmissions from "./pages/profilePages/employerPages/TaskSubmissions";
import ProfileCompletion from "./pages/ProfileCompletion";

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
		<div className="container">
			<div className="row">
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
						<Route path="/profile-completion" element={<ProfileCompletion />} />
						<Route path="/myTasks" element={<TaskManagement />} />
						<Route path="/tasks" element={<TaskList />} />
						<Route path="/tasks/:id" element={<TaskDetail />} />
						<Route path="/my-submissions" element={<SubmissionList />} />
						<Route path="/submission/:id" element={<SubmissionView />} />
						<Route path="/task/submissions/:id" element={<TaskSubmissions />} />
					</Routes>
				</Router>
			</div>
		</div>
	);
};

export default App;
