// routes/employerProfile.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const EmployerProfile = require("../models/EmployerProfile");
const User = require("../models/User");

// @route    GET /api/employerProfile/me
// @desc     Get current employer's profile
// @access   Private
router.get("/me", auth, async (req, res) => {
	try {
		const profile = await EmployerProfile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "email"]);
		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// @route    POST /api/employerProfile
// @desc     Create or update employer profile
// @access   Private
router.post("/", auth, async (req, res) => {
	const { companyName, companyLogo } = req.body;

	// Build profile object
	const profileFields = {
		user: req.user.id,
		companyName,
		companyLogo,
	};

	try {
		let profile = await EmployerProfile.findOne({ user: req.user.id });

		if (profile) {
			// Update
			profile = await EmployerProfile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);
			return res.json(profile);
		}

		// Create
		profile = new EmployerProfile(profileFields);
		await profile.save();
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
