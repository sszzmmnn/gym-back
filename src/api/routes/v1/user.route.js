const express = require('express');

const { loginUser, signupUser, logoutUser, getUser, getUserInfo, changePassword } = require('../../controllers/user.controller');
const requireAuth = require('../../middleware/requireAuth');

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', signupUser);
router.post('/logout', logoutUser);

router.use(requireAuth);
router.get('/', getUser);
router.get('/info/:id', getUserInfo);
router.post('/password', changePassword);

module.exports = router;