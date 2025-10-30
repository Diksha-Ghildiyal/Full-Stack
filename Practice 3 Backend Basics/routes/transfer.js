const express = require("express");
const router = express.Router();
const Account = require("../models/Account");

// POST /transfer
router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;

    // 1️⃣ Validate request fields
    if (!senderId || !receiverId || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid input data" });
    }

    // 2️⃣ Fetch accounts
    const sender = await Account.findById(senderId);
    const receiver = await Account.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(404).json({ error: "Sender or receiver not found" });
    }

    // 3️⃣ Check sender balance
    if (sender.balance < amount) {
      return res.status(400).json({ error: "Insufficient balance" });
    }

    // 4️⃣ Sequential update (No transaction)
    sender.balance -= amount;
    await sender.save();

    receiver.balance += amount;
    await receiver.save();

    // 5️⃣ Respond with success
    res.json({
      message: "Transfer successful",
      sender: { name: sender.name, newBalance: sender.balance },
      receiver: { name: receiver.name, newBalance: receiver.balance }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
