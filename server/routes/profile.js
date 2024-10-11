const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
	getProfile,
	deleteProfile,
	updateProfile,
	getAllProfiles,
} = require("../controllers/profileController");

// @route    GET /api/profile/:userId
// @desc     Get current user's profile (either candidate or employer)
// @access   Private
router.get("/:userId", auth, getProfile);

// @route    GET /api/profile/
// @desc     Get current user's profile (either candidate or employer)
// @access   Private
router.get("/fetchAll", roleMiddleware("admin"), auth, getAllProfiles);

// @route    PUT /api/profile
// @desc     Update profile for a user (candidate or employer)
// @access   Private
router.put("/:userId", auth, updateProfile);

// @route    DELETE /api/profile
// @desc     Delete profile for a user (candidate or employer)
// @access   Private
router.delete("/:userId", auth, deleteProfile);

module.exports = router;
