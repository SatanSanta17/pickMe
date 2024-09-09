const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/authMiddleware");
const { roleMiddleware } = require("../middlewares/roleMiddleware");
const {
	createTask,
	getTasks,
	getTaskById,
	updateTask,
	deleteTask,
	fetchMyTasks,
} = require("../controllers/taskController");

// Create a new task (only for employers)
router.post("/create", authMiddleware, roleMiddleware("employer"), createTask);

// Get all tasks (for candidates)
router.get("/fetchAll", authMiddleware, roleMiddleware("candidate"), getTasks);

// Get a specific task by ID
router.get("/fetch/:id", authMiddleware, getTaskById);

// Update a task (only for employers who posted the task)
router.put(
	"/update/:id",
	authMiddleware,
	roleMiddleware("employer"),
	updateTask
);

// Delete a task (only for employers who posted the task)
router.delete(
	"/delete/:id",
	authMiddleware,
	roleMiddleware("employer"),
	deleteTask
);

// Fetch tasks posted by the logged-in employer
router.get(
	"/fetchMyTasks",
	authMiddleware,
	roleMiddleware("employer"),
	fetchMyTasks
);

module.exports = router;
