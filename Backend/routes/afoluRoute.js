const express = require('express');
const router = express.Router();
const afoluController = require('../controller/afoluController');

router.post('/afolu', afoluController.afolu); // Ensure this exists

module.exports = router;
