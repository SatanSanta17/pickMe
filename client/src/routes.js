// src/routes.js
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ProfileCompletion from "./pages/ProfileCompletion";
import CandidateProfile from "./pages/profile/candidate/CandidateProfile";
import CandidateSubmissions from "./pages/profile/candidate/submissions/SubmissionsView";
import CandidateSubmission from "./pages/profile/candidate/submissions/submission/SubmissionView";
import EditSubmission from "./pages/profile/candidate/submissions/submission/SubmissionEdit";
import EmployerProfile from "./pages/profile/employer/EmployerProfile";
import TaskCreate from "./pages/tasks/task/Create";
import Tasks from "./pages/tasks/View";
import Task from "./pages/tasks/task/View";
import TaskEdit from "./pages/profile/employer/tasks/task/TaskEdit";
import TaskSubmissions from "./pages/profile/employer/tasks/task/submissions/SubmissionsView";
import TaskSubmission from "./pages/profile/employer/tasks/task/submissions/submission/SubmissionView";

const AppRoutes = ({ isAuthenticated, user }) => {
	const userRole = user ? user.role : null; // Get user role if user exists

	return (
		<Routes>
			<Route
				path="/"
				element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
			/>
			<Route
				path="/login"
				element={isAuthenticated ? <Navigate to="/" /> : <Login />}
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
			<Route path="/profile/submissions" element={<CandidateSubmissions />} />
			<Route
				path="/profile/submission/:submissionId"
				element={<CandidateSubmission />}
			/>
			<Route
				path="/profile/submission/edit/:submissionId"
				element={<EditSubmission />}
			/>
			<Route path="/tasks" element={<Tasks />} />
			<Route path="/task/:id" element={<Task />} />
			<Route path="/task/create" element={<TaskCreate />} />
			<Route path="/task/edit/:id" element={<TaskEdit />} />
			<Route path="/task/:id/submissions" element={<TaskSubmissions />} />
			<Route path="/submission/:id" element={<TaskSubmission />} />
		</Routes>
	);
};

export default AppRoutes;
