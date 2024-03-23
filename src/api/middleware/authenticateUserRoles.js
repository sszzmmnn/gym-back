const User = require('../models/user.model');
const Refresh = require('../models/refresh.model');

const authenticateUserRoles = (...allowedRoles) => {
    return async (req, res, next) => {
        const email = req.user;

        if(!email) {
            return res.status(401).json({error: 'Missing user identifier'});
        }

        const {roles: userRoles} = await User.findOne({email});
        console.log(userRoles);
        if(!userRoles) return res.status(404).json({error: 'User not found'});

        const rolesArray = [...allowedRoles];
        const result = userRoles.map(role => rolesArray.includes(role)).find(val => val === true);
        if(!result) return res.status(403).json({error: 'Unauthorized'});

        next();
    }
}

module.exports = authenticateUserRoles;