// src/App.js
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Import the jwt-decode library
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
import CandidateSubmissions from "./pages/profile/candidate/submissions/SubmissionsView";
import CandidateSubmission from "./pages/profile/candidate/submissions/submission/SubmissionView";
import EditSubmission from "./pages/profile/candidate/submissions/submission/SubmissionEdit";
import EmployerProfile from "./pages/profile/employer/EmployerProfile";
import EmployerTasks from "./pages/profile/employer/tasks/TasksView";
import EmployerTask from "./pages/profile/employer/tasks/task/TaskView";
import TaskCreate from "./pages/profile/employer/tasks/task/TaskCreate";
import TaskEdit from "./pages/profile/employer/tasks/task/TaskEdit";
import TaskSubmissions from "./pages/profile/employer/tasks/task/submissions/SubmissionsView";
import TaskSubmission from "./pages/profile/employer/tasks/task/submissions/submission/SubmissionView";
import Tasks from "./pages/tasks/TasksView";
import Task from "./pages/tasks/task/TaskView";

const App = () => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userRole, setUserRole] = useState(null);
	const [loading, setLoading] = useState(true);
	const token = localStorage.getItem("token");
	useEffect(() => {
		if (token) {
			console.log("TOKEN EXISTS");
			const decodedToken = jwtDecode(token); // Decode the JWT token
			// console.log(decodedToken.user);
			setUserRole(decodedToken.user.role);
			setIsAuthenticated(true);
			setLoading(false);
		}
	}, [token]);

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
								loading ? (
									<div>Loading...</div>
								) : isAuthenticated ? (
									userRole === "candidate" ? (
										<CandidateProfile />
									) : userRole === "employer" ? (
										<EmployerProfile />
									) : (
										<Navigate to="/login" />
									)
								) : (
									<Navigate to="/login" />
								)
							}
						/>
						<Route path="/profile-completion" element={<ProfileCompletion />} />
						<Route
							path="/profile/submissions"
							element={<CandidateSubmissions />}
						/>
						<Route
							path="/profile/submission/:submissionId"
							element={<CandidateSubmission />}
						/>
						<Route
							path="/profile/submission/edit/:submissionId"
							element={<EditSubmission />}
						/>
						<Route path="/profile/tasks" element={<EmployerTasks />} />
						<Route path="/profile/task/:taskId" element={<EmployerTask />} />
						<Route path="/profile/task/create" element={<TaskCreate />} />
						<Route path="/profile/task/edit/:taskId" element={<TaskEdit />} />
						<Route
							path="/profile/task/:taskId/submissions"
							element={<TaskSubmissions />}
						/>
						<Route
							path="/profile/task/:taskId/submission/:submissionId"
							element={<TaskSubmission />}
						/>
						<Route path="/tasks" element={<Tasks />} />
						<Route path="/task/:taskId" element={<Task />} />
					</Routes>
				</Router>
			</div>
		</div>
	);
};

export default App;
