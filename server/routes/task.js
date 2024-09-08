const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const Task = require("../models/Task");
const User = require("../models/User");
const EmployerProfile = require("../models/EmployerProfile");
const Submission = require("../models/Submission");

// @route    POST /api/tasks
// @desc     Post a task (employers only)
// @access   Private
router.post("/create", auth, async (req, res) => {
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
router.get("/fetch/:id", async (req, res) => {
	console.log("REQ USER ID:", req.user.id.toString());
	try {
		const task = await Task.findById(req.params.id).populate({
			path: "submissions", // Access the submissions field inside Task
			populate: { path: "submittedBy" }, // Populate candidate info
		});

		if (!task) {
			return res.status(404).json({ message: "Task not found" });
		}
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

		// Step 1: Find and delete submissions linked to the task
		const submissions = await Submission.find({ task: task._id });
		if (submissions.length > 0) {
			for (const submission of submissions) {
				// Step 2: Remove submissions from candidate profiles
				await CandidateProfile.findOneAndUpdate(
					{ user: submission.submittedBy }, // Find the candidate
					{ $pull: { submissions: submission._id } } // Remove the submission
				);

				// Delete the submission
				await Submission.findByIdAndDelete(submission._id);
			}
		}
		// Step 3: Update the employer profile to remove the task
		await EmployerProfile.findOneAndUpdate(
			{ user: task.postedBy },
			{ $pull: { postedTasks: task._id } }
		);

		// Step 4: Finally, delete the task
		await Task.findByIdAndDelete(task._id);

		res.json({ msg: "Task and related submissions removed" });
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
		const tasks = await Task.find({ postedBy: req.user.id })
			.populate("postedBy")
			.populate({
				path: "submissions", // Access the submissions field inside Task
				select: "solution submittedBy", // Select solution and candidate from Submission
				populate: { path: "submittedBy" }, // Populate candidate info
			});
		res.json(tasks);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
