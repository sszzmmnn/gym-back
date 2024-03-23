const express = require('express')
const router = express.Router();

const { refreshToken, getSession } =require('../../controllers/refresh.controller');

router.post('/', refreshToken);
router.get('/:token', getSession);

module.exports = router