const express = require("express");
const { check } = require("express-validator");
const auth = require("../middleware/authMiddleware");
const {
	submitSolution,
	getSubmissionById,
	updateSubmission,
	deleteSubmission,
	getAllSubmissions,
	getCandidateSubmissions,
	getTaskSubmissions,
} = require("../controllers/submissionController");

const router = express.Router();

// @route    POST api/submission
// @desc     Submit a task solution
// @access   Private (Candidates only)
router.post(
	"/submit",
	[auth, [check("solution", "Solution is required").not().isEmpty()]],
	submitSolution
);

// Route to get a specific submission by ID
router.get("/fetch/:id", auth, getSubmissionById);

// Update a submission (PUT)
router.put("/update/:id", auth, updateSubmission);

// Delete a submission (DELETE)
router.delete("/delete/:id", auth, deleteSubmission);

// GET /api/submission (Get all submissions)
router.get("/fetchAll", getAllSubmissions);

// GET /api/submission (Get all submissions for a candidate)
router.get("/fetchMySubmissions", auth, getCandidateSubmissions);

// GET /api/submission (Get all submissions for a Task)
router.get("/fetchTaskSubmissions/:taskId", auth, getTaskSubmissions);

module.exports = router;
