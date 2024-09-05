// models/CandidateProfile.js

const mongoose = require("mongoose");

const CandidateProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	phone: {
		type: String,
	},
	profilePicture: {
		type: String,
	},
	resume: {
		type: String, // URL to the resume file
	},
	completedTasks: [
		{
			task: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Task",
			},
			completionDate: {
				type: Date,
			},
		},
	],
	applications: [
		{
			task: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Task",
			},
			status: {
				type: String,
				enum: ["pending", "reviewed", "rejected", "accepted"],
				default: "pending",
			},
		},
	],
});

module.exports = mongoose.model("CandidateProfile", CandidateProfileSchema);
