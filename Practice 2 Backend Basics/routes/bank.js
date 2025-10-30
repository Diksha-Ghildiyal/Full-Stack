const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");

// 🏦 GET /balance
router.get("/balance", auth, async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ balance: user.balance });
});

// 💰 POST /deposit
router.post("/deposit", auth, async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: "Invalid deposit amount" });

  const user = await User.findById(req.user.id);
  user.balance += amount;
  await user.save();

  res.json({ message: "Deposit successful", newBalance: user.balance });
});

// 💸 POST /withdraw
router.post("/withdraw", auth, async (req, res) => {
  const { amount } = req.body;
  if (amount <= 0) return res.status(400).json({ error: "Invalid withdrawal amount" });

  const user = await User.findById(req.user.id);
  if (user.balance < amount)
    return res.status(400).json({ error: "Insufficient balance" });

  user.balance -= amount;
  await user.save();

  res.json({ message: "Withdrawal successful", newBalance: user.balance });
});

module.exports = router;
