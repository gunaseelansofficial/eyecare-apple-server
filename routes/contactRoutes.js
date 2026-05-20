const express = require('express');
const { submitContactForm, getContactMessages } = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router
    .route('/')
    .post(submitContactForm)
    .get(protect, authorize('Admin'), getContactMessages);

module.exports = router;
