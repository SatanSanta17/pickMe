const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const Submission = require("../models/Submission");
const Task = require("../models/Task");

const router = express.Router();

// @route    POST api/submission
// @desc     Submit a task solution
// @access   Private (Candidates only)
router.post(
	"/",
	[auth, [check("solution", "Solution is required").not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { taskId, solution } = req.body;

		try {
			const task = await Task.findById(taskId);
			if (!task) {
				return res.status(404).json({ msg: "Task not found" });
			}

			const submission = new Submission({
				task: taskId,
				candidate: req.user.id,
				solution,
			});

			await submission.save();

			res.json(submission);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// Route to get all submissions
router.get("/", async (req, res) => {
	try {
		const submissions = await Submission.find({}).populate(
			"task",
			"title description"
		);
		res.json(submissions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// Route to get all submissions for a specific user
router.get("/my-submissions", auth, async (req, res) => {
	console.log(req.user.id);
	try {
		const submissions = await Submission.find({
			submittedBy: req.user.id,
		}).populate("task", "title description");
		res.json(submissions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// Route to get a specific submission by ID
router.get("/:id", auth, async (req, res) => {
	try {
		const submission = await Submission.findById(req.params.id).populate(
			"task",
			"title description"
		);
		if (!submission) {
			return res.status(404).json({ msg: "Submission not found" });
		}
		res.json(submission);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
