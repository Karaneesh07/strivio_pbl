const express = require('express');
const router = express.Router();
const { getReflections, createReflection, deleteReflection } = require('../controllers/reflectionController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getReflections);
router.post('/', protect, createReflection);
router.delete('/:id', protect, deleteReflection);

module.exports = router;
