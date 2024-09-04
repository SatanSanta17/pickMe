import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
	const [user, setUser] = useState({});
	const [name, setName] = useState("");
	const [number, setNumber] = useState("");
	const [resume, setResume] = useState("");
	const [profilePic, setProfilePic] = useState("");
	const [file, setFile] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		// Fetch user data
		axios
			.get("/api/users/profile")
			.then((res) => {
				setUser(res.data);
				setName(res.data.name);
				setNumber(res.data.number);
				setResume(res.data.resume);
				setProfilePic(res.data.profilePic);
			})
			.catch((err) => console.error(err));
	}, []);

	const handleFileChange = (e) => {
		setFile(e.target.files[0]);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append("profilePic", file);

		try {
			await axios.post("/api/users/upload-profile-pic", formData);
			alert("Profile picture uploaded successfully");
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<h1>Profile</h1>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					placeholder="Name"
				/>
				<input
					type="text"
					value={number}
					onChange={(e) => setNumber(e.target.value)}
					placeholder="Number"
				/>
				<input type="file" onChange={handleFileChange} />
				<button type="submit">Update Profile</button>
			</form>
		</div>
	);
};

export default Profile;
