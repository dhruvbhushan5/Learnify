const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const getDatabaseStatus = () => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
};

router.get("/", (req, res) => {
  const database = getDatabaseStatus();

  res.status(200).json({
    status: "ok",
    service: "learnify-backend",
    uptime: Math.round(process.uptime()),
    database,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
