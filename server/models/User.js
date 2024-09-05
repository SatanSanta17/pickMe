// models/User.js

const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		enum: ["candidate", "employer"], // Define the allowed roles
		default: "candidate", // Default role is candidate
	},
});

module.exports = mongoose.model("User", UserSchema);
