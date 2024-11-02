const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Authenticates the token provided in the request headers.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @return {undefined} This function does not return a value.
 */
function authenticateToken(req, res, next) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	if (token == null) return res.sendStatus(401); // Unauthorized

	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) return res.sendStatus(403); // Forbidden
		req.user = user;
		next();
	});
}

module.exports = authenticateToken;
