const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

// Sample product data
const products = [
  { id: 1, name: "Laptop", price: 800 },
  { id: 2, name: "Smartphone", price: 500 },
  { id: 3, name: "Headphones", price: 120 },
];

// Route to get products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Start server
app.listen(5000, () => {
  console.log("✅ Express API running on http://localhost:5000");
});
