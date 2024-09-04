const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs"); // For password hashing
const jwt = require("jsonwebtoken"); // For generating JWT tokens

const multer = require("multer");
const path = require("path");

const upload = multer({
	storage: multer.diskStorage({
		destination: function (req, file, cb) {
			cb(null, "uploads/");
		},
		filename: function (req, file, cb) {
			cb(null, Date.now() + path.extname(file.originalname));
		},
	}),
});

// Route to create a new user
router.post("/register", async (req, res) => {
	const { name, email, password } = req.body;
	// Hash password before saving
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);
	console.log("REGISTER REQUEST: ", req.body);

	// Basic validation
	if (!name || !email || !password) {
		return res
			.status(400)
			.json({ message: "Please provide all required fields." });
	}
	try {
		// Check if the user already exists
		let user = await User.findOne({ email });
		if (user) {
			return res.status(400).json({ message: "User already exists." });
		}

		// Create New User
		user = new User({
			name,
			email,
			password: hashedPassword,
		});

		// Save the user to the database
		await user.save();

		// Respond with the created user
		res.status(201).json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: "Server error" });
	}
});

// Route to login a user
router.post("/login", async (req, res) => {
	const { email, password } = req.body;
	console.log("LOGIN REQUEST: ", { email, password });

	if (!email || !password) {
		return res
			.status(400)
			.json({ message: "Please provide both email and password." });
	}

	try {
		// Find user by email
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ message: "Invalid credentials." });
		}

		// Check if the password matches
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			return res.status(400).json({ message: "Invalid credentials." });
		}

		// Generate JWT token
		const payload = {
			user: {
				id: user.id,
			},
		};

		const token = jwt.sign(payload, "your_jwt_secret", { expiresIn: "1h" });

		res.json({ token, user });
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: "Server error" });
	}
});

// Update user profile
router.put("/profile", async (req, res) => {
	const { name, number, resume, profilePic } = req.body;
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		user.name = name || user.name;
		user.number = number || user.number;
		user.resume = resume || user.resume;
		user.profilePic = profilePic || user.profilePic;

		await user.save();
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: "Server error" });
	}
});

// Profile picture upload
router.post(
	"/upload-profile-pic",
	upload.single("profilePic"),
	async (req, res) => {
		try {
			const user = await User.findById(req.user.id);
			if (!user) return res.status(404).json({ message: "User not found" });

			user.profilePic = req.file.path;
			await user.save();
			res.json(user);
		} catch (err) {
			console.error(err.message);
			res.status(500).json({ message: "Server error" });
		}
	}
);

// Resume upload
router.post("/upload-resume", upload.single("resume"), async (req, res) => {
	try {
		const user = await User.findById(req.user.id);
		if (!user) return res.status(404).json({ message: "User not found" });

		user.resume = req.file.path;
		await user.save();
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({ message: "Server error" });
	}
});

module.exports = router;
