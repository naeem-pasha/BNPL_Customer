const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    // 1. Get token from cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in.",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Attach user info to request
    req.user = decoded; // Contains `id` and `role` from the payload

    next(); // Pass control to the next middleware/route
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

module.exports = authMiddleware;
