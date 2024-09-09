// roleMiddleware.js

module.exports = (requiredRole) => {
	return (req, res, next) => {
		try {
			// The user's role is assumed to be stored in req.user.role from the authMiddleware
			const userRole = req.user.role;

			// Check if the user role matches the required role for the route
			if (userRole !== requiredRole) {
				return res
					.status(403)
					.json({ msg: "Access denied: Insufficient role" });
			}

			// If the role matches, proceed to the next middleware/controller
			next();
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	};
};
