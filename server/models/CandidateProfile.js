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
	submissions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Submission",
		},
	],
});

module.exports = mongoose.model("CandidateProfile", CandidateProfileSchema);
