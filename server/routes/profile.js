const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {
	getProfile,
	createProfile,
	updateProfile,
} = require("../controllers/candidateProfileController");

// @route    GET /api/profile/:role
// @desc     Get current user's profile (either candidate or employer)
// @access   Private
router.get("/fetch/:role", auth, getProfile);

// @route    POST /api/profile
// @desc     Create profile for a user (candidate or employer)
// @access   Private
router.post("/create", auth, createProfile);

// @route    PUT /api/profile
// @desc     Update profile for a user (candidate or employer)
// @access   Private
router.put("/update", auth, updateProfile);

module.exports = router;
