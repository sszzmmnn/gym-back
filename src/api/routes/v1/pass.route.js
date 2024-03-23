const express = require('express')
const router = express.Router();

const { getAllPasses, getOnePass } = require('../../controllers/pass.controller')

router.get('/', getAllPasses);
router.get('/:id', getOnePass);

module.exports = router