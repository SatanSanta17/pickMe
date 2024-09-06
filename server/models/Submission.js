const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
	task: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Task",
		required: true,
	},
	submittedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
		required: true,
	},
	submittedAt: {
		type: Date,
		default: Date.now,
	},
	solution: {
		type: String, // You can store a URL to a file or the solution text here
		required: true,
	},
	status: {
		type: String,
		enum: ["pending", "reviewed", "rejected", "accepted"],
		default: "pending",
	},
});

module.exports = mongoose.model("Submission", SubmissionSchema);
