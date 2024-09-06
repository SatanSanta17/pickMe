const express = require("express");
const { check, validationResult } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const Submission = require("../models/Submission");
const Task = require("../models/Task");
const CandidateProfile = require("../models/CandidateProfile");

const router = express.Router();

// @route    POST api/submission
// @desc     Submit a task solution
// @access   Private (Candidates only)
router.post(
	"/submit",
	[auth, [check("solution", "Solution is required").not().isEmpty()]],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		const { taskId, solution } = req.body;

		try {
			const submission = new Submission({
				task: taskId,
				submittedBy: req.user.id,
				solution,
			});

			await submission.save();

			// Find the associated Task and update it
			await Task.findOneAndUpdate(
				{ _id: taskId },
				{ $push: { submissions: submission._id } }
			);

			// Find the associated CandidateProfile and update it
			await CandidateProfile.findOneAndUpdate(
				{ user: req.user.id },
				{ $push: { submissions: submission._id } }
			);

			res.json(submission);
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server Error");
		}
	}
);

// Route to get a specific submission by ID
router.get("/fetch/:id", auth, async (req, res) => {
	try {
		const submission = await Submission.findById(req.params.id).populate(
			"task"
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

// Update a submission (PUT)
router.put("/update/:id", auth, async (req, res) => {
	try {
		const { title, description, deadline, status } = req.body;
		let submission = await Submission.findById(req.params.id);

		if (!submission) {
			return res.status(404).json({ msg: "submission not found" });
		}

		// Only the candidate who posted the task can edit it
		if (submission.submittedBy.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		// Update the task with the new values using findByIdAndUpdate
		submission = await Submission.findByIdAndUpdate(
			req.params.id,
			{ $set: { solution } }, // Update fields
			{ new: true, omitUndefined: true } // Return the updated document
		);

		res.json(submission);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// Delete a submission (DELETE)
router.delete("/delete/:id", auth, async (req, res) => {
	try {
		const submission = await Submission.findById(req.params.id);

		if (!submission) {
			return res.status(404).json({ msg: "Submission not found" });
		}

		// Only the employer who posted the task can delete it
		if (submission.submittedBy.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		// Find the associated Task and update it
		await Task.findOneAndUpdate(
			{ _id: submission.task },
			{ $pull: { submissions: submission._id } }
		);

		// Find the associated CandidateProfile and update it
		await CandidateProfile.findOneAndUpdate(
			{ user: req.user.id },
			{ $pull: { submissions: submission._id } }
		);
		await Submission.findByIdAndDelete(submission._id);
		res.json({ msg: "Submission removed" });
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/submission (Get all submissions )
router.get("/fetchAll", async (req, res) => {
	try {
		const submission = await Submission.find({});
		res.json(submission);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/submission (Get all submission for a candidate)
router.get("/fetchMySubmissions", auth, async (req, res) => {
	try {
		const submissions = await Submission.find({
			submittedBy: req.user.id,
		}).populate("task");
		res.json(submissions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

// GET /api/submission (Get all submission for a Task)
router.get("/fetchTaskSubmissions/:id", auth, async (req, res) => {
	try {
		const submissions = await Submission.find({ task: req.params.id }).populate(
			"submittedBy"
		);
		res.json(submissions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
});

module.exports = router;
