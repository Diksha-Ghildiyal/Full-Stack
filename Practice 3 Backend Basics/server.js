const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const transferRoute = require("./routes/transfer");

const app = express();
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/accountDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ MongoDB connected"))
.catch(err => console.error(err));

// Routes
app.use("/transfer", transferRoute);

// Start Server
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
