const express = require("express");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Secret key for signing tokens (keep this secure!)
const SECRET_KEY = "mysecretkey123";

// Dummy user data
const user = {
  username: "admin",
  password: "password123"
};

// Login route: issues a JWT if credentials are valid
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Validate credentials
  if (username === user.username && password === user.password) {
    // Create JWT payload
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });

    return res.json({
      message: "Login successful",
      token: token
    });
  }

  res.status(401).json({ message: "Invalid username or password" });
});

// Middleware to verify JWT
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expect format: "Bearer <token>"

  if (!token) {
    return res.status(403).json({ message: "Access denied. No token provided." });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Store decoded info (like username) in request
    req.user = decoded;
    next();
  });
}

// Protected route
app.get("/dashboard", verifyToken, (req, res) => {
  res.json({
    message: `Welcome, ${req.user.username}! You have access to this protected route.`,
  });
});

// Public route
app.get("/", (req, res) => {
  res.send("Public route: no authentication required.");
});

// Start server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
