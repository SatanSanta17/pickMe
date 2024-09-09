const { validationResult } = require("express-validator");
const Submission = require("../models/Submission");
const Task = require("../models/Task");
const CandidateProfile = require("../models/CandidateProfile");

// @desc     Submit a task solution
// @route    POST api/submission/submit
// @access   Private (Candidates only)
const submitSolution = async (req, res) => {
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
};

// @desc     Get submission by ID
// @route    GET api/submission/fetch/:id
// @access   Private
const getSubmissionById = async (req, res) => {
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
};

// @desc     Update submission
// @route    PUT api/submission/update/:id
// @access   Private
const updateSubmission = async (req, res) => {
	try {
		const { solution } = req.body;

		let submission = await Submission.findById(req.params.id);

		if (!submission) {
			return res.status(404).json({ msg: "Submission not found" });
		}

		// Only the candidate who posted the task can edit it
		if (submission.submittedBy.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		// Update the task with the new values
		submission = await Submission.findByIdAndUpdate(
			req.params.id,
			{ $set: { solution } },
			{ new: true, omitUndefined: true }
		);

		res.json(submission);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @desc     Delete a submission
// @route    DELETE api/submission/delete/:id
// @access   Private
const deleteSubmission = async (req, res) => {
	try {
		const submission = await Submission.findById(req.params.id);

		if (!submission) {
			return res.status(404).json({ msg: "Submission not found" });
		}

		// Only the candidate who posted the task can delete it
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
};

// @desc     Get all submissions
// @route    GET api/submission/fetchAll
// @access   Public
const getAllSubmissions = async (req, res) => {
	try {
		const submissions = await Submission.find({});
		res.json(submissions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @desc     Get all submissions for a candidate
// @route    GET api/submission/fetchMySubmissions
// @access   Private
const getCandidateSubmissions = async (req, res) => {
	try {
		const submissions = await Submission.find({
			submittedBy: req.user.id,
		}).populate("task");
		res.json(submissions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

// @desc     Get all submissions for a Task
// @route    GET api/submission/fetchTaskSubmissions/:taskId
// @access   Private
const getTaskSubmissions = async (req, res) => {
	try {
		const submissions = await Submission.find({
			task: req.params.taskId,
		}).populate("submittedBy");
		res.json(submissions);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server error");
	}
};

module.exports = {
	submitSolution,
	getSubmissionById,
	updateSubmission,
	deleteSubmission,
	getAllSubmissions,
	getCandidateSubmissions,
	getTaskSubmissions,
};
