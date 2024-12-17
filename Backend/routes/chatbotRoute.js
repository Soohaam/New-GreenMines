const express = require("express");
const router = express.Router();
const chatbot=require("../controller/chatbot")

router.post("/chat",chatbot.chatBot)

module.exports = router;