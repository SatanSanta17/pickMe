const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
	getAllTasks,
	getTaskById,
	updateTask,
	deleteTask,
	getEmployerTasks,
	generateTask,
} = require("../controllers/taskController");

// Create a new task (only for employers)
// router.post("/create", authMiddleware, roleMiddleware("employer"), createTask);
router.post(
	"/create",
	authMiddleware,
	roleMiddleware("employer"),
	generateTask
);

// Get a specific task by ID
router.get("/fetch/:id", authMiddleware, getTaskById);

// Fetch tasks posted by the logged-in employer
router.get(
	"/fetchUserTasks/:userId",
	authMiddleware,
	roleMiddleware("employer"),
	getEmployerTasks
);

// Get all tasks (for candidates)
router.get(
	"/fetchAll",
	authMiddleware,
	roleMiddleware("candidate"),
	getAllTasks
);

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
	roleMiddleware("admin"),
	deleteTask
);

module.exports = router;
