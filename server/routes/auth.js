const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
	"/register",
	[
		check("name", "Name is required").not().isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check(
			"password",
			"Please enter a password with 6 or more characters"
		).isLength({ min: 6 }),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { name, email, password } = req.body;
		console.log("REGISTER REQUEST: ", req.body);

		try {
			// Check if the user already exists
			let user = await User.findOne({ email });
			if (user) {
				return res.status(400).json({ msg: "User already exists" });
			}

			// Create a new user instance
			user = new User({
				name,
				email,
				password,
			});

			// Hash the password before saving
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);

			await user.save();

			// Generate JWT token
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
				if (err) throw err;
				res.json({ token });
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
	"/login",
	[
		check("email", "Please include a valid email").isEmail(),
		check("password", "Password is required").exists(),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { email, password } = req.body;

		try {
			// Check if the user exists
			let user = await User.findOne({ email });
			if (!user) {
				return res.status(400).json({ msg: "Invalid Credentials" });
			}

			// Compare the entered password with the hashed password in the database
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({ msg: "Invalid Credentials" });
			}

			// Generate JWT token
			const payload = {
				user: {
					id: user.id,
				},
			};

			jwt.sign(payload, jwtSecret, { expiresIn: "1h" }, (err, token) => {
				if (err) throw err;
				res.json({ token, user });
			});
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	}
);

// @route   GET /api/auth/user
// @desc    Get logged in user details
// @access  Private
router.get("/user", authMiddleware, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password");
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
