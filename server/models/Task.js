const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	taskFileURL: {
		type: String,
		required: true,
	},
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	deadline: {
		type: Date,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		enum: ["open", "close"], // Define the allowed roles
		default: "open", // Default role is candidate
	},
	submissions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Submission", // Ensure that Submission model is referenced correctly
		},
	],
});

module.exports = mongoose.model("Task", TaskSchema);
