import React from "react";

const Home = ({ onLogout }) => {
	return (
		<div>
			<h1>Welcome to the Home Page!</h1>
			<p>You are successfully logged in.</p>
			<button onClick={onLogout}>Log Out</button>
		</div>
	);
};

export default Home;
