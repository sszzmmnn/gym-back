const express = require('express')
const router = express.Router();

const { handleOrder } = require('../../controllers/order.controller')

router.post('/', handleOrder);

module.exports = router