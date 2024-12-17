const express = require("express");
const router = express.Router();
const userController = require("../controller/userController");
const multer = require('multer');

// Multer middleware to handle file upload
const storage = multer.memoryStorage(); // Store files in memory for Cloudinary upload
const upload = multer({ storage: storage });

// Route to get user by email
router.get('/user/:email', userController.getUserByEmail);  

// Route to handle profile picture update
router.post('/user/update-profile-picture', userController.uploadProfilePicture, userController.updateProfilePicture);

router.put('/user/update-co2-goal/:id',userController.updateCO2Goal)
module.exports = router;
