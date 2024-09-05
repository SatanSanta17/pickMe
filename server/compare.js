// routes/application.js

const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Application = require("../models/Application");
const Task = require("../models/Task");
const EmployerProfile = require("../models/EmployerProfile");

// @route    POST /api/applications
// @desc     Apply for a task with submission
// @access   Private
router.post("/", auth, async (req, res) => {
	const { taskId, submission } = req.body;

	try {
		// Check if task exists
		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(400).json({ msg: "Task not found" });
		}

		// Create application with submission content
		const application = new Application({
			candidate: req.user.id,
			task: taskId,
			submission,
		});

		await application.save();
		res.status(201).json(application);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// @route    GET /api/applications/task/:taskId
// @desc     Get applications for a task
// @access   Private (Employer)
router.get("/:taskId", auth, async (req, res) => {
	try {
		// Ensure the user is an employer
		const employerProfile = await EmployerProfile.findOne({
			user: req.user.id,
		});
		if (!employerProfile) {
			return res.status(403).json({ msg: "Access denied" });
		}
		// Find applications for the task
		const applications = await Application.find({
			task: req.params.taskId,
		}).populate("candidate", ["name", "email"]);

		res.json(applications);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});
