const User = require('../models/User'); // Assuming you have a User model
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
require('dotenv').config();

// Cloudinary config (use your actual Cloudinary credentials)
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
});

// Multer middleware to handle file upload
const storage = multer.memoryStorage(); // Store files in memory for Cloudinary upload
const upload = multer({ storage }).single('profilePicture');

exports.getUserByEmail = async (req, res) => {
    const { email } = req.params; // Expect email in URL params

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            profilePicture : user.profilePicture,
            CO2Goal:user.CO2Goal
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
};

// Controller function to update profile picture
exports.updateProfilePicture = (req, res) => {
  const userId = req.body.userId || req.user.id; // Ensure userId is available (from body or middleware)
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Upload image to Cloudinary
  cloudinary.uploader.upload_stream(
    {
      resource_type: 'image',
      public_id: `user_profiles/${userId}_profile_pic`, // Set a public ID for the image
      folder: 'user_profiles', // Store in a folder in Cloudinary
    },
    async (error, result) => {
      if (error) {
        return res.status(500).json({ message: 'Error uploading image', error });
      }

      // Save Cloudinary image URL in the user's profile
      try {
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profilePicture: result.secure_url },
          { new: true }
        );

        res.status(200).json({
          message: 'Profile picture updated successfully',
          profilePicture: result.secure_url, // Return the Cloudinary URL
        });
      } catch (err) {
        res.status(500).json({ message: 'Error updating user profile', err });
      }
    }
  ).end(file.buffer); // Pipe the file buffer to Cloudinary
};

// Middleware to handle file uploads
exports.uploadProfilePicture = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: 'Error uploading file', err });
    }
    next(); // Proceed to the next middleware (which is the updateProfilePicture function)
  });
};

exports.updateCO2Goal = async (req , res , )=>{
  const { id } = req.params;
  const { CO2Goal } = req.body;

  if (!CO2Goal || isNaN(CO2Goal) || CO2Goal <= 0) {
    return res.status(400).json({ message: 'Invalid CO2 goal value' });
  }

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.CO2Goal = CO2Goal;
    await user.save();

    res.status(200).json({ message: 'CO2 goal updated successfully', CO2Goal });
  } catch (error) {
    console.error('Error updating CO2 goal:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
