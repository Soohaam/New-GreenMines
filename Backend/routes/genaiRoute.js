const express = require("express");
const router = express.Router();
const { analyzeEmissionsWithGenAI } = require("../controller/genaiController");

router.post("/genai/emissions-analysis", analyzeEmissionsWithGenAI);

module.exports = router;
