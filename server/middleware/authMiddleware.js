const jwt = require("jsonwebtoken");
const config = require("config");
const jwtSecret = config.get("jwtSecret");
const authMiddleware = (req, res, next) => {
	// Your middleware logic here
	// Get token from header
	const token = req.header("x-auth-token");

	// Check if no token
	if (!token) {
		return res.status(401).json({ msg: "No token, authorization denied" });
	}

	// Verify token
	try {
		const decoded = jwt.verify(token, jwtSecret);
		req.user = decoded.user;
		next();
	} catch (err) {
		res.status(401).json({ msg: "Token is not valid" });
	}
};

module.exports = authMiddleware;
