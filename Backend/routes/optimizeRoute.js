const express = require("express");
const router = express.Router();
const optimize = require("../controller/routeController");

router.post("/optimize-route",optimize.optimizeRoute);

module.exports = router;