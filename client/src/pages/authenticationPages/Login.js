import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
	MDBInput,
	MDBCol,
	MDBRow,
	MDBCheckbox,
	MDBBtn,
	MDBIcon,
} from "mdb-react-ui-kit";

const Login = ({ setIsAuthenticated }) => {
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	});
	const { email, password } = formData;
	const navigate = useNavigate();

	// Handle input field changes
	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"http://localhost:5000/api/auth/login",
				formData
			);
			console.log("LOGIN RESPONSE: ", response.data);
			const { token } = response.data;
			console.log("TOKEN:", token);
			localStorage.setItem("token", token); // Save token to local storage
			setIsAuthenticated(true); // Set auth status to true
			navigate("/"); // Navigate to home after successful login
		} catch (error) {
			console.error("Login error: ", error.response.data);
		}
	};

	return (
		<div className="d-flex justify-content-center align-items-center mt-5">
			<div className="card col-6">
				<div className="card-body">
					<form onSubmit={handleSubmit}>
						<MDBInput
							className="mb-4"
							type="email"
							id="form2Example1"
							label="Email address"
							name="email"
							value={email}
							onChange={handleChange}
							required
						/>

						<MDBInput
							className="mb-4"
							type="password"
							id="form2Example2"
							label="Password"
							name="password"
							value={password}
							onChange={handleChange}
							required
						/>

						<MDBRow className="mb-4">
							<MDBCol className="d-flex justify-content-center">
								<MDBCheckbox
									id="form2Example3"
									label="Remember me"
									defaultChecked
								/>
							</MDBCol>
							<MDBCol>
								<a href="#!">Forgot password?</a>
							</MDBCol>
						</MDBRow>
						<MDBBtn type="submit" className="mb-4" block>
							Sign in
						</MDBBtn>
						<div className="text-center">
							<p>
								Not a member? <a href="/register">Register</a>
							</p>
							<p>or sign up with:</p>

							<MDBBtn floating color="secondary" className="mx-1">
								<MDBIcon fab icon="facebook-f" />
							</MDBBtn>

							<MDBBtn floating color="secondary" className="mx-1">
								<MDBIcon fab icon="google" />
							</MDBBtn>

							<MDBBtn floating color="secondary" className="mx-1">
								<MDBIcon fab icon="twitter" />
							</MDBBtn>

							<MDBBtn floating color="secondary" className="mx-1">
								<MDBIcon fab icon="github" />
							</MDBBtn>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
