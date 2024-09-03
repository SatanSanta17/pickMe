const express = require("express");
require("dotenv").config();
const app = express();

const cors = require("cors"); // Import cors
const mongoose = require("mongoose");
const port = process.env.PORT || 5000; // Use port from environment or default to 5000

const jwtSecret = process.env.JWT_SECRET;

// Middleware
app.use(express.json()); // Parse JSON bodies

// Enable CORS for all routes
app.use(cors());

// Routes
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

app.use("/api/users", userRoutes);
app.use("/api", taskRoutes);

// Routes
app.get("/", (req, res) => {
	res.send("Hello World!");
});

mongoose
	.connect(
		"mongodb+srv://afthab7407:1fKoYXOKG95q4idi@pickme.5ps8n.mongodb.net/"
	)
	.then(() => console.log("Connected to MongoDB"))
	.catch((err) => console.error("Could not connect to MongoDB...", err));

// Start the server
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});
