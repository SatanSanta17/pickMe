const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	number: { type: String, required: true },
	resume: { type: String }, // URL or path to the resume file
	profilePic: { type: String }, // URL or path to the profile picture
	completedTasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
	applications: [
		{
			jobId: { type: Schema.Types.ObjectId, ref: "Job" },
			status: {
				type: String,
				enum: ["Applied", "Interviewing", "Hired", "Rejected"],
				default: "Applied",
			},
		},
	],
});

module.exports = mongoose.model("User", UserSchema);
