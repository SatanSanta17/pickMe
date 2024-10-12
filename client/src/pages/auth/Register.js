import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Import the auth hook

const Register = () => {
	const auth = useAuth();

	const { register } = auth; // Use the register method from the auth hook
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		role: "candidate", // default role
	});
	const { name, email, password, role } = formData;
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await register(name, email, password, role); // Call the register method
		navigate("/profile-completion"); // Redirect after successful registration
	};

	// Check if auth is valid before destructuring
	if (!auth) {
		return <div>Loading...</div>; // Or handle null case
	}

	return (
		<div className="d-flex justify-content-center align-items-center mt-5">
			<div className="card col-6">
				<div className="card-body">
					<h2>Register</h2>
					<form onSubmit={handleSubmit}>
						<div className="mb-3">
							<label htmlFor="name" className="form-label">
								Name
							</label>
							<input
								type="text"
								className="form-control"
								id="name"
								name="name"
								value={name}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="email" className="form-label">
								Email address
							</label>
							<input
								type="email"
								className="form-control"
								id="email"
								name="email"
								value={email}
								onChange={handleChange}
								required
							/>
						</div>
						<div className="mb-3">
							<label htmlFor="password" className="form-label">
								Password
							</label>
							<input
								type="password"
								className="form-control"
								id="password"
								name="password"
								value={password}
								onChange={handleChange}
								required
							/>
						</div>
						<select
							className="form-select mb-3"
							aria-label="Default select example"
							name="role"
							value={role}
							onChange={handleChange}
						>
							<option selected disabled>
								Select
							</option>
							<option value="candidate">Candidate</option>
							<option value="employer">Employer</option>
						</select>
						<button type="submit" className="btn btn-primary">
							Register
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Register;
