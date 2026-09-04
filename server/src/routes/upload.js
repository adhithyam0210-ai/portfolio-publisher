const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const { authenticate } = require('../middleware/auth');
const { uploadAvatar, uploadResume, uploadProjectImage, uploadCertificate } = require('../middleware/upload');

// Protected file uploads
router.post('/avatar', authenticate, uploadAvatar.single('avatar'), uploadController.uploadAvatar);
router.post('/project-image', authenticate, uploadProjectImage.single('image'), uploadController.uploadProjectImage);
router.post('/certificate', authenticate, uploadCertificate.single('certificate'), uploadController.uploadCertificate);
router.post('/resume', authenticate, uploadResume.single('resume'), uploadController.uploadResume);
router.delete('/resume', authenticate, uploadController.deleteResume);

// Public download route (verifies publish status & privacy settings)
router.get('/resume/download/:slug', uploadController.downloadResumeBySlug);

module.exports = router;
