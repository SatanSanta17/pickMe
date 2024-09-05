const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const CandidateProfile = require("../models/CandidateProfile");

// @route   GET /api/candidateProfile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req, res) => {
	try {
		console.log("REQUEST:", req); // Log user ID
		console.log("USER ID:", req.user.id); // Log user ID

		const profile = await CandidateProfile.findOne({
			user: req.user.id,
		}).populate("user", ["name", "email"]);
		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

// @route   POST /api/candidateProfile
// @desc    Create or update candidate profile
// @access  Private
router.post("/", auth, async (req, res) => {
	const { profilePicture, resume, completedTasks, applications } = req.body;

	// Build profile object
	const profileFields = {};
	profileFields.user = req.user.id;
	if (profilePicture) profileFields.profilePicture = profilePicture;
	if (resume) profileFields.resume = resume;
	if (completedTasks) profileFields.completedTasks = completedTasks;
	if (applications) profileFields.applications = applications;

	try {
		let profile = await CandidateProfile.findOne({ user: req.user.id });

		if (profile) {
			// Update existing profile
			profile = await CandidateProfile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);
			return res.json(profile);
		}

		// Create new profile
		profile = new CandidateProfile(profileFields);
		await profile.save();
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
});

module.exports = router;
