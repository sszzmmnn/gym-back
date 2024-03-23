const { verifyJWT } = require('../utils/jwt.util');
const Refresh = require('../models/refresh.model');
const User = require('../models/user.model');

const requireAuth = async (req, res, next) => {
    const { authorization } = req.headers;

    if(!authorization) {
        return res.status(403).json({error: 'Unauthorized'});
    }

    if(!authorization.startsWith('Bearer ')) {
        return res.status(403).json({error: 'Unauthorized'})
    }

    const token = authorization.split(' ')[1];

    try {
        const decoded = verifyJWT(token);
        const refreshToken = await Refresh.findById(decoded._id);
        if(!refreshToken) return res.status(403).json({error: 'Unauthorized'});

        req.user = decoded.email;
        next();
    } catch(e) {
        res.status(403).json({error: 'Unauthorized'});
    }
}

module.exports = requireAuth