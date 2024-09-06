// routes/candidateProfile.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const CandidateProfile = require("../models/CandidateProfile");
const { populate } = require("../models/Submission");

// @route    GET /api/candidateProfile/me
// @desc     Get current candidate's profile
// @access   Private
router.get("/fetch", auth, async (req, res) => {
	try {
		console.log("USER ID:", req.user.id); // Log user ID
		const profile = await CandidateProfile.findOne({
			user: req.user.id,
		})
			.populate("user")
			.populate({
				path: "submissions", // Populate the task field inside postedTasks
				populate: {
					path: "task",
					populate: {
						path: "postedBy",
					},
				},
			});
		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}

		res.json({ profile });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// @route    POST /api/candidateProfile
// @desc     Create or update candidate profile
// @access   Private
router.post("/update", auth, async (req, res) => {
	const { phone, profilePicture, resume } = req.body;

	// Build profile object
	const profileFields = {
		user: req.user.id,
		phone,
		profilePicture,
		resume,
	};

	try {
		let profile = await CandidateProfile.findOne({ user: req.user.id });

		if (profile) {
			// Update
			profile = await CandidateProfile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);
			return res.json(profile);
		}

		// Create
		profile = new CandidateProfile(profileFields);
		await profile.save();
		res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
