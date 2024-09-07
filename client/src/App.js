// src/App.js
import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Navigate,
} from "react-router-dom";
import axios from "axios";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProfileCompletion from "./pages/ProfileCompletion";
import CandidateProfile from "./pages/profile/candidate/CandidateProfile";
import SubmissionList from "./pages/profile/candidate/submissions/SubmissionsView";
import SubmissionView from "./pages/profile/candidate/submissions/submission/SubmissionView";
import SubmissionEdit from "./pages/profile/candidate/submissions/submission/SubmissionEdit";
import EmployerProfile from "./pages/profile/employer/EmployerProfile";
import TaskManagement from "./pages/profile/employer/tasks/TasksView";
import TaskSubmissions from "./pages/profile/employer/tasks/task/submissions/SubmissionsView";
import TaskList from "./pages/tasks/TasksView";
import TaskDetail from "./pages/tasks/task/TaskView";

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
						<Route path="/task/:id" element={<TaskDetail />} />
						<Route path="/my-submissions" element={<SubmissionList />} />
						<Route path="/submission/:id" element={<SubmissionView />} />
						<Route path="/submission/:id/edit" element={<SubmissionEdit />} />
						<Route path="/task/submissions/:id" element={<TaskSubmissions />} />
					</Routes>
				</Router>
			</div>
		</div>
	);
};

export default App;
