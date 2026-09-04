const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, requireAdmin } = require('../middleware/auth');

// Strict Admin protection on all routes in this file
router.use(authenticate, requireAdmin);

router.get('/stats', adminController.getSystemStats);
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/:id/status', adminController.toggleUserStatus);
router.post('/users/:id/reset-password', adminController.resetUserPassword);
router.delete('/users/:id', adminController.deleteUser);

module.exports = router;
