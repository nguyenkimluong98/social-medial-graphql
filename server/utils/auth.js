const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");

const { SECRET_KEY } = require("../config");

module.exports = (context) => {
	const authHeader = context.req.headers.authorization;

	if (authHeader) {
		const token = authHeader.split("Bearer ")[1];

		if (token) {
			try {
				return jwt.verify(token, SECRET_KEY);
			} catch (error) {
				throw new AuthenticationError("Invalid/Expired token");
			}
		}

		throw new AuthenticationError(
			"Authentication token must be valid: Bearer [token]"
		);
	}

	throw new AuthenticationError("Authentication token must be provided");
};
