// routes/candidateProfile.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const CandidateProfile = require("../models/CandidateProfile");
const EmployerProfile = require("../models/EmployerProfile");

// @route    GET /api/candidateProfile/me
// @desc     Get current candidate's profile
// @access   Private
router.get("/fetch/:role", auth, async (req, res) => {
	const role = req.params.role;
	// console.log("ROLE:", role);
	try {
		if (role === "candidate") {
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
				return res
					.status(400)
					.json({ msg: "There is no profile for this user" });
			}
			res.json(profile);
		} else if (role === "employer") {
			const profile = await EmployerProfile.findOne({
				user: req.user.id,
			})
				.populate("user")
				.populate({
					path: "postedTasks", // Populate the task field inside postedTasks
					populate: {
						path: "submissions", // Access the submissions field inside Task
						populate: { path: "submittedBy" }, // Populate candidate info
					},
				});
			if (!profile) {
				return res
					.status(400)
					.json({ msg: "There is no profile for this user" });
			}
			res.json(profile);
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// @route    POST /api/candidateProfile
// @desc     Create profile
// @access   Private
router.post("/create", auth, async (req, res) => {
	const role = req.body.userRole;
	console.log("REQUEST:", req.body.formData);
	console.log("ROLE:", role);
	try {
		if (role === "candidate") {
			const { phone, profilePicture, resume } = req.body.formData;
			// Build profile object
			const profileFields = {
				user: req.user.id,
				phone,
				profilePicture,
				resume,
			};
			// Create
			let profile = new CandidateProfile(profileFields);
			await profile.save();
			res.json(profile);
		} else if (role === "employer") {
			const { phone, companyName, companyLogo } = req.body.formData;
			// Build profile object
			const profileFields = {
				user: req.user.id,
				phone,
				companyName,
				companyLogo,
			};
			// Create
			let profile = new EmployerProfile(profileFields);
			await profile.save();
			res.json(profile);
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// @route    PUT /api/candidateProfile
// @desc     update profile
// @access   Private
router.put("/update", auth, async (req, res) => {
	const role = req.user.id;
	try {
		if (role === "candidate") {
			const { phone, profilePicture, resume } = req.body;

			// Build profile object
			const profileFields = {
				user: req.user.id,
				phone,
				profilePicture,
				resume,
			};
			let profile = await CandidateProfile.findOne({ user: req.user.id });

			if (!profile) {
			}
			// Update
			profile = await CandidateProfile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);
			return res.json(profile);
		} else if (role === "employer") {
			const { phone, companyName, companyLogo } = req.body;

			// Build profile object
			const profileFields = {
				user: req.user.id,
				phone,
				companyName,
				companyLogo,
			};
			let profile = await EmployerProfile.findOne({ user: req.user.id });

			if (!profile) {
			}

			// Update
			profile = await EmployerProfile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);
			return res.json(profile);
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
