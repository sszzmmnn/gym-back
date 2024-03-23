require('dotenv').config();

const Refresh = require('../models/refresh.model')
const { signJWT, verifyJWT } = require('../utils/jwt.util')
const jwt = require('jsonwebtoken');

// login handler
const refreshToken = async (req, res) => {
    // odnawianie refresh tokena, podac callback metode zeby odzyskac _id z tokena bo inaczej sie z tokena nic nie odzyska
    const { token } = req.body;
    if(!token || token === undefined) return res.status(403).json({error: 'No token'});

    //TODO: Add logging out on outdated jwt token

    try{
        const { _id, email } = jwt.verify(token, process.env.SECRET, { ignoreExpiration: true });
        const refresh = await Refresh.findOne({ _id });
        const refreshToken = jwt.verify(refresh.token, process.env.SECRET);
        if(email !== refreshToken.email) return res.status(403).json({error: 'Tokens mismatching'})
        const newToken = signJWT({_id: _id, email: email}, "ja", "10s");
        console.log(`new token: ${newToken}`);
        res.status(200).json({token: newToken});
    }catch(err){
        try {
            const { _id } = jwt.verify(token, process.env.SECRET, { ignoreExpiration: true });
            await Refresh.findOneAndDelete(_id);
        } catch (err) {
            console.log('Refresh: Failed to delete a token');
        }

        res.status(418).json({token: null});
    }
}

// getting session handler
const getSession = (req, res) => {
    const { token } = req.params;
    res.send(verifyJWT(token));
}

// logout handler
const deleteSession = (req, res) => {
    
}

module.exports = {
    refreshToken,
    getSession,
    deleteSession
}