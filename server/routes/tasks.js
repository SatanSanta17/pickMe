const express = require("express");
const router = express.Router();
const Task = require("../models/Task");

// Route to create a new task
router.post("/tasks", async (req, res) => {
	const { title, description, assignedTo } = req.body;
	try {
		const task = new Task({ title, description, assignedTo });
		await task.save();
		res.status(201).send(task);
	} catch (err) {
		res.status(400).send(err);
	}
});

// Route to get all tasks
router.get("/tasks", async (req, res) => {
	try {
		const tasks = await Task.find();
		res.status(200).send(tasks);
	} catch (err) {
		res.status(400).send(err);
	}
});

module.exports = router;
