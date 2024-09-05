const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	description: {
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
	applications: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Application",
		},
	],
});

module.exports = mongoose.model("Task", TaskSchema);
