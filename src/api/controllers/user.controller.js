const User = require('../models/user.model');
const Member = require('../models/member.model');
const Refresh = require('../models/refresh.model');
const { signJWT, tokenAndDataToJSON, decodeJWT } = require('../utils/jwt.util');
const { mergeName } = require('../utils/class.util');

// user login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.login(email, password);
        const refreshToken = signJWT({email}, "ja", "1h");
        const { _id } = await Refresh.create({token: refreshToken});
        const accessToken = signJWT({_id: _id, email: email}, "ja", "1m");
        console.log(`main: ${JSON.stringify({token: accessToken, roles: user.roles})}`);

        const localStorageData = tokenAndDataToJSON(accessToken, user);
        res.status(200).send(localStorageData);
    } catch (err) {
        console.log(err.message);
        res.status(401).json({error: err.message});
    }
}

// user signup
// TODO: dodac pole z numerem telefonu i wywalic adre i pierdoly (imie inazwisko tez wsm)
const signupUser = async (req, res) => {
    const { email, password, phone, firstName, lastName } = req.body;
    
    try {
        const user = await User.signup(email, password, firstName, lastName, phone);
        res.status(200).json({email, user});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

const logoutUser = async (req, res) => {
    const { token } = req.body;
    console.log(token);
    if(!token) return res.status(400).json({
        logout: false,
        message: "Missing auth token neccessary to log out"
    });

    try{
        const { _id } = decodeJWT(token);
        const ref = await Refresh.deleteOne({_id});
        console.log(ref);
        res.status(200).json({
            logout: true,
            message: "Logged out successfully"
        });
    } catch (err) {
        res.status(400).json({
            logout: false,
            message: "Failed to decode the token"
        });
    }
}

// funkcja uzywana do profilu uzytkownika
const getUser = async (req, res) => {
    const _id = req.query._id;
    const user = await User.findOne({ _id });
    const member = await Member.findOne({ userId: _id });
    const isActivePass = member ? member.exp > Math.floor(Date.now()/1000) : false;
    res.status(200).json({
        name: mergeName({ fn: user.name.first, ln: user.name.last }) || "Not provided",
        member: {
            active: isActivePass,
            data: isActivePass ? member.accessCode : ""
        }
    });
}

// funkcja uzywana do /checkout
const getUserInfo = async (req, res) => {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if(!user) return res.status(404).json({error: 'No such user found'});
    // const userInfo = { ...user.info, address: { ...user.info.address, country: getName(user.info.address.countryCode) } };
    res.status(200).json({
        name: mergeName({ fn: user.name.first, ln: user.name.last }),
        email: user.email,
        phone: user.phone || 'Not provided'
    })

}

const changePassword = async(req, res) => {
    const { userId, oldPw, newPw } = req.body;

    if(!userId || !oldPw || !newPw) return res.status(400).json({error: 'Parameter missing'});
    
    try{
        const user = await User.changePassword(userId, oldPw, newPw);
        res.status(200).json({updated: true});
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

module.exports = {
    loginUser,
    signupUser,
    logoutUser,
    getUser,
    getUserInfo,
    changePassword
}