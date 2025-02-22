const express = require("express");
const router = express.Router();
const { getAdminDashboardStats } = require("../controller/admin.controller");
const { protectRoute } = require("../middleware/protectRoute");

router.get("/dashboard", protectRoute, getAdminDashboardStats);

module.exports = router;