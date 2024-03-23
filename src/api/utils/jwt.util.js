require('dotenv').config();
const jwt = require('jsonwebtoken');

const signJWT = (payload, issuer, expiresIn) => {
    return jwt.sign(payload, process.env.SECRET, {issuer, expiresIn})
}

const verifyJWT = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        return { ...decoded };
    } catch (err) {
        throw Error;
    }
}

const decodeJWT = (token) => {
    try {
        const decoded = jwt.decode(token, process.env.SECRET);
        return { ... decoded };
    } catch (err) {
        throw Error;
    }
}

const tokenAndDataToJSON = (token, user) => {
    return [
        {
            token: token,
            roles: user.roles
        },
        {
            _id: user._id
        }
    ]
    
}

module.exports = {
    signJWT,
    verifyJWT,
    decodeJWT,
    tokenAndDataToJSON
}