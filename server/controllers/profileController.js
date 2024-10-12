const CandidateProfile = require("../models/CandidateProfile");
const EmployerProfile = require("../models/EmployerProfile");
const User = require("../models/User");

// @desc    Get user's profile
// @route   GET /api/profile/:userId
// @access  Private
const getProfile = async (req, res) => {
	const userId = req.params.id;
	try {
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		const role = user.role;
		let profile;
		if (role === "candidate") {
			profile = await CandidateProfile.findOne({ user: userId })
				.populate("user")
				.populate({
					path: "submissions",
					populate: {
						path: "task",
						populate: { path: "postedBy" },
					},
				});
		} else if (role === "employer") {
			profile = await EmployerProfile.findOne({ user: userId })
				.populate("user")
				.populate({
					path: "postedTasks",
					populate: {
						path: "submissions",
						populate: { path: "submittedBy" },
					},
				});
		} else {
			return res.status(400).json({ msg: "Invalid role" });
		}

		if (!profile) {
			return res.status(400).json({ msg: "There is no profile for this user" });
		}
		return res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @desc    Get user profiles
// @route   GET /api/profile/fetchAll
// @access  Private, role based
const getAllProfiles = async (req, res) => {
	try {
		// Fetch all candidate profiles and employer profiles
		const candidateProfiles = await CandidateProfile.find().populate("user");
		const employerProfiles = await EmployerProfile.find().populate("user");

		// Combine both types of profiles in one array
		const profiles = [...candidateProfiles, ...employerProfiles];

		// Return the combined profiles
		return res.json(profiles);
	} catch (error) {
		console.error("Error fetching profiles:", error.message);
		return res.status(500).json({ msg: "Server error" });
	}
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
const updateProfile = async (req, res) => {
	const userId = req.params.id;
	try {
		const user = await User.findById(userId);
		const role = user.role; // Use the userRole passed from the frontend
		let profile;
		if (role === "candidate") {
			const { phone, profilePicture, resume } = req.body;

			const profileFields = {
				user: userId,
				phone,
				profilePicture,
				resume,
			};

			profile = await CandidateProfile.findOneAndUpdate(
				{ user: userId },
				{ $set: profileFields },
				{ new: true }
			);
		} else if (role === "employer") {
			const { phone, companyName, companyLogo } = req.body;

			const profileFields = {
				user: userId,
				phone,
				companyName,
				companyLogo,
			};

			profile = await EmployerProfile.findOneAndUpdate(
				{ user: userId },
				{ $set: profileFields },
				{ new: true }
			);
		} else {
			return res.status(400).json({ msg: "Invalid role" });
		}

		if (!profile) {
			return res.status(400).json({ msg: "Profile not found" });
		}

		return res.json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @desc    Delete user profile
// @route   DELETE /api/profile
// @access  Private
const deleteProfile = async (req, res) => {
	const userId = req.params.id;
	try {
		// Find the user by ID
		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ msg: "User not found" });
		}

		// Check the role and delete the corresponding profile
		const role = user.role;
		if (role === "candidate") {
			await CandidateProfile.findOneAndDelete({ user: userId });
		} else if (role === "employer") {
			await EmployerProfile.findOneAndDelete({ user: userId });
		}

		// Delete the user itself
		await User.findOneAndDelete({ _id: userId });

		// Return success message
		res.json({ msg: "User and profile deleted successfully" });
	} catch (error) {
		// Log and send error response
		console.error("Error deleting profile:", error.message);
		res.status(500).json({ msg: "Server error" });
	}
};

module.exports = {
	getProfile,
	deleteProfile,
	updateProfile,
	getAllProfiles,
};
