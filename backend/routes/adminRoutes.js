const express = require('express');
const { verifyItem } = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
const router = express.Router();


router.post('/verify/:id', protectAdmin, verifyItem);

module.exports = router;