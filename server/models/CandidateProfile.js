const mongoose = require("mongoose");

const CandidateProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	profilePicture: {
		type: String, // URL or file path to the profile picture
	},
	resume: {
		type: String, // URL or file path to the resume
	},
	completedTasks: [
		{
			title: { type: String },
			description: { type: String },
			completedAt: { type: Date, default: Date.now },
		},
	],
	applications: [
		{
			jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
			status: { type: String, default: "Applied" }, // Could be "Applied", "Under Review", etc.
		},
	],
});

module.exports = mongoose.model("CandidateProfile", CandidateProfileSchema);
