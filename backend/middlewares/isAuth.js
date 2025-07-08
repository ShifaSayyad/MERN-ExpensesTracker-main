const jwt = require("jsonwebtoken");

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers?.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, "shifa"); // throws if expired/invalid

    // Attach user ID (or full decoded user if needed)
    req.user = decoded.id;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Token expired or invalid. Please login again." });
  }
};

module.exports = isAuthenticated;
