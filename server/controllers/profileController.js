const CandidateProfile = require("../models/CandidateProfile");
const EmployerProfile = require("../models/EmployerProfile");

// @desc    Get current user's profile
// @route   GET /api/profile/:role
// @access  Private
const getProfile = async (req, res) => {
	const role = req.params.role;
	try {
		if (role === "candidate") {
			const profile = await CandidateProfile.findOne({ user: req.user.id })
				.populate("user")
				.populate({
					path: "submissions",
					populate: {
						path: "task",
						populate: { path: "postedBy" },
					},
				});

			if (!profile) {
				return res
					.status(400)
					.json({ msg: "There is no profile for this user" });
			}
			res.json(profile);
		} else if (role === "employer") {
			const profile = await EmployerProfile.findOne({ user: req.user.id })
				.populate("user")
				.populate({
					path: "postedTasks",
					populate: {
						path: "submissions",
						populate: { path: "submittedBy" },
					},
				});

			if (!profile) {
				return res
					.status(400)
					.json({ msg: "There is no profile for this user" });
			}
			res.json(profile);
		} else {
			return res.status(400).json({ msg: "Invalid role" });
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @desc    Create user profile
// @route   POST /api/profile
// @access  Private
const createProfile = async (req, res) => {
	const role = req.body.userRole;
	try {
		if (role === "candidate") {
			const { phone, profilePicture, resume } = req.body.formData;

			const profileFields = {
				user: req.user.id,
				phone,
				profilePicture,
				resume,
			};

			let profile = new CandidateProfile(profileFields);
			await profile.save();
			res.json(profile);
		} else if (role === "employer") {
			const { phone, companyName, companyLogo } = req.body.formData;

			const profileFields = {
				user: req.user.id,
				phone,
				companyName,
				companyLogo,
			};

			let profile = new EmployerProfile(profileFields);
			await profile.save();
			res.json(profile);
		} else {
			return res.status(400).json({ msg: "Invalid role" });
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
	const role = req.body.userRole; // Use the userRole passed from the frontend
	try {
		if (role === "candidate") {
			const { phone, profilePicture, resume } = req.body;

			const profileFields = {
				user: req.user.id,
				phone,
				profilePicture,
				resume,
			};

			let profile = await CandidateProfile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);

			if (!profile) {
				return res.status(400).json({ msg: "Profile not found" });
			}

			return res.json(profile);
		} else if (role === "employer") {
			const { phone, companyName, companyLogo } = req.body;

			const profileFields = {
				user: req.user.id,
				phone,
				companyName,
				companyLogo,
			};

			let profile = await EmployerProfile.findOneAndUpdate(
				{ user: req.user.id },
				{ $set: profileFields },
				{ new: true }
			);

			if (!profile) {
				return res.status(400).json({ msg: "Profile not found" });
			}

			return res.json(profile);
		} else {
			return res.status(400).json({ msg: "Invalid role" });
		}
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

module.exports = {
	getProfile,
	createProfile,
	updateProfile,
};
