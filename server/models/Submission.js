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
	solution: {
		type: String, // You can store a URL to a file or the solution text here
		required: true,
	},
	submittedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Submission", SubmissionSchema);
