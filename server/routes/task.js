const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const Application = require("../models/Application");
const User = require("../models/User");

// @route    POST /api/tasks
// @desc     Post a task (employers only)
// @access   Private
router.post("/", auth, async (req, res) => {
	try {
		// Get the user by ID
		const user = await User.findById(req.user.id);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		// Check if the user is an employer
		if (user.role !== "employer") {
			return res.status(403).json({ message: "Only employers can post tasks" });
		}

		const { title, description, deadline } = req.body;

		const task = new Task({
			title,
			description,
			deadline,
			postedBy: req.user.id,
		});
		await task.save();
		res.status(201).json(task);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/tasks/:id (Get details of a specific task)
router.get("/:id", auth, async (req, res) => {
	try {
		const task = await Task.findById(req.params.id).populate(
			"postedBy",
			"name"
		);
		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}
		res.json(task);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/tasks (Get all tasks for an employer)
router.get("/", auth, async (req, res) => {
	try {
		const tasks = await Task.find({ postedBy: req.user.id });
		res.json(tasks);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
