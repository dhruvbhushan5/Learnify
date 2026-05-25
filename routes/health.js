const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();

const getDatabaseStatus = () => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
};

router.get("/", (req, res) => {
  const database = getDatabaseStatus();
  const healthy = database === "connected";

  res.status(healthy ? 200 : 503).json({
    status: healthy ? "ok" : "degraded",
    service: "learnify-backend",
    uptime: Math.round(process.uptime()),
    database,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
