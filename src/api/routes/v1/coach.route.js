const express = require('express')
const router = express.Router();

const { getAllCoaches, getCoachInfo } = require('../../controllers/coach.controller')

router.get('/', getAllCoaches);
router.get('/:id', getCoachInfo);

module.exports = router