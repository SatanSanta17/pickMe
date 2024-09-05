const mongoose = require("mongoose");

const ApplicationSchema = new mongoose.Schema({
	candidate: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	task: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Task",
		required: true,
	},
	submission: {
		type: String,
		required: true,
	},
	submittedAt: {
		type: Date,
		default: Date.now,
	},
	status: {
		type: String,
		default: "pending",
		enum: ["pending", "accepted", "rejected"],
	},
});

module.exports = mongoose.model("Application", ApplicationSchema);
