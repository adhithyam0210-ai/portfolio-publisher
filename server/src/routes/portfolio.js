const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');
const { authenticate } = require('../middleware/auth');

// All routes in this router require authentication
router.use(authenticate);

// Profile and Customization
router.get('/me', portfolioController.getMyPortfolio);
router.put('/profile', portfolioController.updateProfile);
router.put('/customization', portfolioController.updateCustomization);
router.put('/settings', portfolioController.updateSettings);
router.put('/slug', portfolioController.updateSlug);

// Publish states
router.post('/publish', portfolioController.publishPortfolio);
router.post('/unpublish', portfolioController.unpublishPortfolio);
router.post('/draft', portfolioController.saveDraft);

// Education
router.post('/education', portfolioController.addEducation);
router.put('/education/:id', portfolioController.updateEducation);
router.delete('/education/:id', portfolioController.deleteEducation);

// Skills
router.post('/skills', portfolioController.addSkill);
router.put('/skills/:id', portfolioController.updateSkill);
router.delete('/skills/:id', portfolioController.deleteSkill);

// Projects
router.post('/projects', portfolioController.addProject);
router.put('/projects/:id', portfolioController.updateProject);
router.delete('/projects/:id', portfolioController.deleteProject);

// Experience
router.post('/experience', portfolioController.addExperience);
router.put('/experience/:id', portfolioController.updateExperience);
router.delete('/experience/:id', portfolioController.deleteExperience);

// Certifications
router.post('/certifications', portfolioController.addCertification);
router.put('/certifications/:id', portfolioController.updateCertification);
router.delete('/certifications/:id', portfolioController.deleteCertification);

// Achievements
router.post('/achievements', portfolioController.addAchievement);
router.put('/achievements/:id', portfolioController.updateAchievement);
router.delete('/achievements/:id', portfolioController.deleteAchievement);

module.exports = router;
