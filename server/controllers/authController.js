const config = require("config");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CandidateProfile = require("../models/CandidateProfile");
const EmployerProfile = require("../models/EmployerProfile");
const jwtSecret = config.get("jwtSecret");

// Register user
const register = async (req, res) => {
	const { name, email, password, role } = req.body;
	try {
		let user = await User.findOne({ email });
		if (user) return res.status(400).json({ msg: "User already exists" });

		user = new User({ name, email, password, role });

		// Hash password
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);

		await user.save();

		if (role === "candidate") {
			const candidate = new CandidateProfile({ user: user._id });
			candidate.save();
		} else if (role === "employer") {
			const employer = new EmployerProfile({ user: user._id });
			employer.save();
		}

		// Generate JWT
		const payload = { user: { id: user.id, role: user.role } };
		const token = jwt.sign(payload, jwtSecret, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

// Login user
const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		let user = await User.findOne({ email });
		if (!user) return res.status(400).json({ msg: "wrong email" });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(400).json({ msg: "wrong password" });

		// Generate JWT
		const payload = { user: { id: user.id, role: user.role } };
		const token = jwt.sign(payload, jwtSecret, {
			expiresIn: "1h",
		});

		res.json({ token });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

module.exports = { register, login };
