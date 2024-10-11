const express = require("express");
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
router.post("/submit", auth, submitSolution);

// Route to get a specific submission by ID
router.get("/fetch/:id", auth, getSubmissionById);

// GET /api/submission (Get all submissions for a candidate)
router.get("/fetchUserSubmissions/:userId", auth, getCandidateSubmissions);

// GET /api/submission (Get all submissions for a Task)
router.get("/fetchTaskSubmissions/:taskId", auth, getTaskSubmissions);

// GET /api/submission (Get all submissions)
router.get("/fetchAll", auth, roleMiddleware("admin"), getAllSubmissions);

// Update a submission (PUT)
router.put("/update/:id", auth, updateSubmission);

// Delete a submission (DELETE)
router.delete("/delete/:id", auth, deleteSubmission);

module.exports = router;
