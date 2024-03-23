const express = require('express')
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');

const { getAllCheckouts, getOneCheckout, createCheckout, updateCheckout } = require('../../controllers/checkout.controller')

router.use(requireAuth);
router.get('/', getAllCheckouts);
router.get('/:userId', getOneCheckout);
router.post('/', createCheckout);
router.put('/:userId', updateCheckout);

module.exports = router