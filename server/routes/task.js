const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");
const {
	createTask,
	getAllTasks,
	getTaskById,
	updateTask,
	deleteTask,
	getMyTasks,
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

// // AI generated Task
// router.post(
// 	"/generate-task",
// 	authMiddleware,
// 	roleMiddleware("employer"),
// 	generateTask
// );

// Get all tasks (for candidates)
router.get(
	"/fetchAll",
	authMiddleware,
	roleMiddleware("candidate"),
	getAllTasks
);

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
	getMyTasks
);

module.exports = router;
