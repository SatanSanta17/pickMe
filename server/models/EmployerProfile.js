// models/EmployerProfile.js

const mongoose = require("mongoose");

const EmployerProfileSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	companyName: {
		type: String,
		required: true,
	},
	companyLogo: {
		type: String, // URL to the logo image
	},
	postedTasks: [
		{
			task: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "Task",
			},
		},
	],
});

module.exports = mongoose.model("EmployerProfile", EmployerProfileSchema);
