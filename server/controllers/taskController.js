const Task = require("../models/Task");
const EmployerProfile = require("../models/EmployerProfile");
const CandidateProfile = require("../models/CandidateProfile");
const Submission = require("../models/Submission");
const { generateContent } = require("./AI-function"); // Import your AI function
const fs = require("fs");
const path = require("path");

// Create a new task (Employer only)
const createTask = async (req, res) => {
	try {
		const { title, description, deadline } = req.body;
		const task = new Task({
			title,
			description,
			deadline,
			postedBy: req.user.id, // User ID from the token
		});
		await task.save();

		// Add task reference to employer's profile
		await EmployerProfile.findOneAndUpdate(
			{ user: req.user.id },
			{ $push: { postedTasks: task._id } }
		);

		res.status(201).json(task);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

// Generate Task (Employer Only)
const generateTask = async (req, res) => {
	const {
		role,
		experience,
		keyResponsibilities,
		requiredSkills,
		jobDescription,
		deadline,
	} = req.body;

	try {
		const task = await generateContent(
			role,
			experience,
			keyResponsibilities,
			requiredSkills,
			jobDescription
		);

		const taskObject = JSON.parse(task);

		const newTask = new Task({
			taskObject,
			postedBy: req.user.id, // User ID from the token
			deadline,
		});
		await newTask.save();

		// Add task reference to employer's profile
		await EmployerProfile.findOneAndUpdate(
			{ user: req.user.id },
			{ $push: { postedTasks: newTask._id } }
		);

		res.status(201).json({ task: newTask });
	} catch (error) {
		res.status(500).json({ message: "Task did not created", error });
	}
};

// Get all tasks (Candidates only)
const getAllTasks = async (req, res) => {
	try {
		const tasks = await Task.find({}).populate({
			path: "submissions", // Access the submissions field inside Task
			populate: { path: "submittedBy" }, // Populate candidate info
		}); // Optionally populate the employer info
		res.json(tasks);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

// Get a specific task by ID
const getTaskById = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id).populate({
			path: "submissions", // Access the submissions field inside Task
			populate: { path: "submittedBy" }, // Populate candidate info
		});
		if (!task) return res.status(404).json({ msg: "Task not found" });

		res.json(task);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

// Update a task (Employer only)
const updateTask = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(404).json({ msg: "Task not found" });
		}

		// Ensure the user is the owner of the task
		if (task.postedBy.toString() !== req.user.id) {
			return res.status(401).json({ msg: "User not authorized" });
		}

		const { title, description, deadline } = req.body;

		task.title = title || task.title;
		task.description = description || task.description;
		task.deadline = deadline || task.deadline;

		await task.save();

		res.json(task);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

// Delete a task (Employer only)
const deleteTask = async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);

		if (!task) {
			return res.status(404).json({ msg: "Task not found" });
		}

		// Ensure the user is the owner of the task
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

		await Task.findByIdAndDelete(task._id);

		res.json({ msg: "Task removed" });
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

// Fetch tasks posted by the logged-in employer
const getMyTasks = async (req, res) => {
	try {
		const tasks = await Task.find({ postedBy: req.user.id })
			.populate("postedBy")
			.populate({
				path: "submissions", // Access the submissions field inside Task
				select: "solution submittedBy", // Select solution and candidate from Submission
				populate: { path: "submittedBy" }, // Populate candidate info
			});
		res.json(tasks);
	} catch (error) {
		console.error(error.message);
		res.status(500).send("Server error");
	}
};

module.exports = {
	createTask,
	getAllTasks,
	getTaskById,
	updateTask,
	deleteTask,
	getMyTasks,
	generateTask,
};
