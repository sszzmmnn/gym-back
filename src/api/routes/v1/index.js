const express = require('express');

const userRoutes = require('./user.route');
const sessionRoutes = require('./refresh.route');
const passRoutes = require('./pass.route');
const checkoutRoutes = require('./checkout.route');
const orderRoutes = require('./order.route');
const classRoutes = require('./class.route');
const coachRoutes = require('./coach.route');
const adminRoutes = require('./admin.route');
const requireAuth = require('../../middleware/requireAuth');

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).send({ 'dziala': true })
})

router.use('/user', userRoutes);
router.use('/refresh', sessionRoutes);
router.use('/pass', passRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/order', orderRoutes);
router.use('/class', classRoutes);
router.use('/coach', coachRoutes);
router.use('/admin', adminRoutes);

router.use(requireAuth);
router.get('/test', (req, res) => {
    res.status(200).send({
        test1: "abc",
        test2: "def",
        test3: "ghijkl"
    })
})

module.exports = router