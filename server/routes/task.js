const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const User = require("../models/User");
const EmployerProfile = require("../models/EmployerProfile");

// @route    POST /api/tasks
// @desc     Post a task (employers only)
// @access   Private
router.post("/createTask", auth, async (req, res) => {
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
			postedBy: user._id,
		});
		await task.save();

		// Find the associated EmployerProfile and update it
		await EmployerProfile.findOneAndUpdate(
			{ user: task.postedBy },
			{ $push: { postedTasks: task._id } }
		);

		res.status(201).json(task);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/tasks/:id (Get details of a specific task)
router.get("/fetch/:id", auth, async (req, res) => {
	console.log("REQ USER ID:", req.user.id.toString());
	try {
		const task = await Task.findById(req.params.id).populate({
			path: "submissions", // Access the submissions field inside Task
			populate: { path: "submittedBy" }, // Populate candidate info
		});

		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}

		const submissions = task.submissions;
		let alreadySubmitted, submittedByID;

		for (let submission of submissions) {
			submittedByID = submission.submittedBy._id.toString();
			if (submittedByID === req.user.id) {
				console.log("inside if block");
				console.log("SUBMISSION ID:", submission._id.toString());
				console.log("ALREADY SUBMITTED BY:", submittedByID);
				alreadySubmitted = true;
				return res.status(200).json({
					alreadySubmitted,
					submittedByID,
					submissionID: submission._id.toString(),
				});
			}
		}
		console.log("outside for loop");
		res.json(task);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// Update a task (PUT)
router.put("/update/:id", auth, async (req, res) => {
	try {
		const { title, description, deadline, status } = req.body;
		let task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(404).json({ msg: "Task not found" });
		}

		// Only the employer who posted the task can edit it
		if (task.postedBy.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		// Update the task with the new values using findByIdAndUpdate
		task = await Task.findByIdAndUpdate(
			req.params.id,
			{ $set: { title, description, deadline, status } }, // Update fields
			{ new: true, omitUndefined: true } // Return the updated document
		);

		res.json(task);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// Delete a task (DELETE)
router.delete("/delete/:id", auth, async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(404).json({ msg: "Task not found" });
		}

		// Only the employer who posted the task can delete it
		if (task.postedBy.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		// Find the associated EmployerProfile and update it
		await EmployerProfile.findOneAndUpdate(
			{ user: task.postedBy },
			{ $pull: { postedTasks: task._id } }
		);

		await Task.findByIdAndDelete(task._id);
		res.json({ msg: "Task removed" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/tasks (Get all tasks)
router.get("/fetchAll", async (req, res) => {
	try {
		const tasks = await Task.find({}).populate({
			path: "submissions", // Access the submissions field inside Task
			select: "submittedBy", // Select solution and candidate from Submission
			populate: { path: "submittedBy", select: "name email" }, // Populate candidate info
		});
		res.json(tasks);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/tasks (Get all tasks for an employer)
router.get("/fetchMyTasks", auth, async (req, res) => {
	try {
		const tasks = await Task.find({ postedBy: req.user.id }).populate({
			path: "submissions", // Access the submissions field inside Task
			select: "solution submittedBy", // Select solution and candidate from Submission
			populate: { path: "submittedBy", select: "name email" }, // Populate candidate info
		});
		res.json(tasks);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
