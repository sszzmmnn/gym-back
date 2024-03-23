const express = require('express')
const router = express.Router();
const requireAuth = require('../../middleware/requireAuth');
const authenticateUserRoles = require('../../middleware/authenticateUserRoles');
const { ROLES } = require('../../constants/constant');

const { loginUser, 
    getUsers, 
    getMembers, 
    getPasses, newPass, deletePass,
    getInvoices,
    getClasses, getClassNames, newClass
} = require('../../controllers/admin.controller')

router.post('/login', loginUser);

router.use(requireAuth);
router.use(authenticateUserRoles(ROLES.Admin));
router.get('/user', getUsers);
router.get('/member', getMembers);
router.route('/pass')
    .get(getPasses)
    .post(newPass)
    .delete(deletePass);
router.get('/invoice', getInvoices);
router.route('/class')
    .get(getClasses)
    .post(newClass);
router.get('/class/names', getClassNames);

module.exports = router