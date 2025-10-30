const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'
    if (!token) {
      return res.status(401).json({ error: "Token missing" });
    }

    // Verify token
    const decoded = jwt.verify(token, "SECRET_KEY"); // Replace with env var in real app
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = auth;
