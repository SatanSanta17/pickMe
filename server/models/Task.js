const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
	taskObject: {
		type: mongoose.Schema.Types.Mixed,
		required: true,
	},
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true, // Reference to the user who posted the task
	},
	deadline: {
		type: Date,
		required: true, // The deadline for task completion
	},
	createdAt: {
		type: Date,
		default: Date.now, // Automatically sets the task creation date
	},
	status: {
		type: String,
		enum: ["open", "close"], // Task can be either open or closed
		default: "open", // Default status is 'open'
	},
	submissions: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Submission", // Array of references to submission documents
		},
	],
});

module.exports = mongoose.model("Task", TaskSchema);
