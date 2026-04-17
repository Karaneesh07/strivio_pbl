const express = require('express');
const router = express.Router();
const { getGoals, createGoal, updateGoal } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getGoals);
router.post('/', protect, createGoal);
router.patch('/:id', protect, updateGoal);

module.exports = router;
