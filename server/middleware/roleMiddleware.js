// roleMiddleware.js
const roleMiddleware = (requiredRole) => {
	return (req, res, next) => {
		try {
			const userRole = req.user.role;
			if (userRole !== requiredRole) {
				return res
					.status(403)
					.json({ msg: "Access denied: Insufficient role" });
			}
			next();
		} catch (err) {
			console.error(err.message);
			res.status(500).send("Server error");
		}
	};
};

module.exports = roleMiddleware;
