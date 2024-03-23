const User = require('../models/user.model');
const { ROLES } = require('../constants/constant');
const { mergeName } = require('../utils/class.util');

const getAllCoaches = async (req, res) => {
    const coaches = await User.find({roles: { $in: [ROLES.Coach]}});
    const resCoaches = coaches.map((coach) => {
        const name = mergeName({
            fn: coach.name.first, 
            ln: coach.name.last
        });
        return {
            id: coach._id,
            name: name
        }
    })
    res.status(200).json(resCoaches);
}

const getCoachInfo = async (req, res) => {
    const { id } = req.params;

    try {
        const coach = await User.findById(id);
        if(!coach) return res.status(404).json({error: 'Not found'});

        const name = mergeName({
            fn: coach.name.first, 
            ln: coach.name.last
        });
        const resCoach = {
            name: name,
            email: coach.email,
            phone: coach.phone
        }

        res.status(200).json(resCoach);
    } catch (err) {
        res.status(404).json({error: 'Not Found'});
    }
}

module.exports = {
    getAllCoaches,
    getCoachInfo
}