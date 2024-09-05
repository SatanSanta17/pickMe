const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const Application = require("../models/Application");

// POST /api/applications (Candidate submits an application)
router.post("/", auth, async (req, res) => {
	const { taskId, submission } = req.body;
	try {
		const task = await Task.findById(taskId);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		const application = new Application({
			candidate: req.user.id,
			task: taskId,
			submission,
		});

		await application.save();

		// Add the application to the task's list of applications
		task.applications.push(application._id);
		await task.save();

		res.status(201).json(application);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/applications/:taskId (Get applications for a specific task)
router.get("/:taskId", auth, async (req, res) => {
	try {
		const applications = await Application.find({
			task: req.params.taskId,
		}).populate("candidate", "name");
		res.json(applications);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
