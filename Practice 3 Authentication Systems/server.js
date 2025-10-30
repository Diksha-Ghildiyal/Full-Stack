const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Secret key (keep this secure!)
const SECRET_KEY = "supersecretkey123";

// Mock users (pretend database)
const users = [
  { username: "admin", password: "admin123", role: "Admin" },
  { username: "mod", password: "mod123", role: "Moderator" },
  { username: "user", password: "user123", role: "User" },
];

// Login route: generates JWT with role embedded
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const foundUser = users.find(
    (u) => u.username === username && u.password === password
  );

  if (!foundUser) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Create token containing username & role
  const token = jwt.sign(
    { username: foundUser.username, role: foundUser.role },
    SECRET_KEY,
    { expiresIn: "1h" }
  );

  res.json({
    message: "Login successful",
    role: foundUser.role,
    token,
  });
});

// Middleware: verify token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Format: Bearer <token>

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    req.user = decoded; // Attach user info (username, role)
    next();
  });
}

// Middleware: authorize specific roles
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
}

// Public route (no auth)
app.get("/", (req, res) => {
  res.send("Welcome to the RBAC API. Please log in to access restricted routes.");
});

// Protected routes by role
app.get("/admin", verifyToken, authorizeRoles("Admin"), (req, res) => {
  res.json({ message: `Hello Admin ${req.user.username}! Access granted.` });
});

app.get("/moderator", verifyToken, authorizeRoles("Admin", "Moderator"), (req, res) => {
  res.json({ message: `Hello Moderator ${req.user.username}! Access granted.` });
});

app.get("/profile", verifyToken, authorizeRoles("Admin", "Moderator", "User"), (req, res) => {
  res.json({ message: `Hello ${req.user.username}! This is your profile.` });
});

// Start server
app.listen(3000, () => console.log("Server running at http://localhost:3000"));
