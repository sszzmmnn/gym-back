const express = require('express')
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');
const authenticateUserRoles = require('../../middleware/authenticateUserRoles');
const { ROLES } = require('../../constants/constant');

const { getClasses, createNewClass, enrollIntoClass, claimClass } = require('../../controllers/class.controller')

router.post('/', createNewClass);
router.get('/', getClasses);

router.use(requireAuth);
router.use(authenticateUserRoles(ROLES.User));
router.post('/enroll', enrollIntoClass);

router.use(authenticateUserRoles(ROLES.Coach));
router.post('/claim', claimClass);

module.exports = router