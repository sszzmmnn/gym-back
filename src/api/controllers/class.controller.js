const User = require('../models/user.model');
const Class = require('../models/class.model');
const { CLASSES } = require('../constants/constant');
const { mapUsers, mergeName } = require('../utils/class.util');

const getClasses = async (req, res) => {
    const {perms, user: userId} = req.query;
    const date = () => {
        if (perms === 'coach') return Date.now() + 2629800000; // 1 month
        else return Date.now() + 1209600000; // 2 weeks
    }
    const currentDate = new Date();
    const current1Hr = currentDate.setHours(currentDate.getHours() - 1);

    const classes = await Class.find({ date: { $lte: date(), $gt: current1Hr }}).sort({date: 1});
    const allCoachIds = classes.map((oneClass) => oneClass.claimedBy);
    const coaches = await User.find({ _id: { $in: allCoachIds }}).select('name.first name.last');
    const coachMap = mapUsers(coaches);

    const resClasses = classes.map((oneClass) => {
        const coach = coachMap.get(oneClass.claimedBy.toString());

        const claimedBy = mergeName(coach);

        // console.log(`userId: ${userId}\noneClassUser: ${oneClass.enrolled.toString()}`);
        return {
            _id: oneClass._id.toString(),
            date: oneClass.date.getTime(),
            name: oneClass.name,
            enrolled: oneClass.enrolled.length,
            isUserEnrolled: oneClass.enrolled.includes(userId),
            isCoachClaimed: oneClass.claimedBy.toString() === userId,
            claimedBy: claimedBy
        }

    });

    res.status(200).json(resClasses);
}

const createNewClass = async (req, res) => {
    const { name, date } = req.body;
    if(!CLASSES.includes(name)) return res.status(400).json({error: 'Couldn\'t find such class'});

    try {
        const newClass = await Class.create({name, date: new Date(date)});
        res.status(200).json(newClass);
    } catch (err) {
        console.trace();
        console.log(err);
        res.status(500).json({error: 'Failed to add a new class to database'});
    }
}

const enrollIntoClass = async (req, res) => {
    const { userId, classId } = req.body;
    if(!userId || !classId) return res.status(400).json({error: 'Missing parameters'});

    const exists = await User.findById(userId);
    if(!exists) return res.status(404).json({error: 'User not found'});

    const enrolledList = await Class.findOne({ _id: classId }).select('enrolled');
    if(!enrolledList) return res.status(404).json({error: 'Class not found'});
    if(enrolledList.enrolled.includes(userId)) {
        const withdrawn = await Class.findOneAndUpdate(
            {_id: classId},
            {$pull: {
                enrolled: userId
            }},
            {returnDocument: "after"}
        )

        return res.status(200).json({
            _id: withdrawn._id,
            enrolled: withdrawn.enrolled.length,
            isUserEnrolled: false
        });
    }

    const updated = await Class.findOneAndUpdate(
        {_id: classId}, 
        {$push: {
            enrolled: userId
        }},
        {returnDocument: "after"}
    )

    res.status(200).json({
        _id: updated._id,
        enrolled: updated.enrolled.length,
        isUserEnrolled: true
    });
}

const claimClass = async (req, res) => {
    const { userId, classId } = req.body;
    if(!userId || !classId) return res.status(400).json({error: 'Missing parameters'});

    const exists = await User.findById(userId);
    if(!exists) return res.status(404).json({error: 'User not found'});

    const classClaimed = await Class.findOne({_id: classId}).select('claimedBy');
    if(!classClaimed) return res.status(404).json({error: 'Class not found'});
    if(classClaimed.claimedBy.toString() === userId) {
        const resigned = await Class.findOneAndUpdate(
            {_id: classId},
            {claimedBy: '000000000000000000000000'},
            {returnDocument: "after"}
        )
        return res.status(200).json({
            _id: resigned._id,
            isCoachClaimed: false,
            claimedBy: "-"
        });
    }

    const updated = await Class.findOneAndUpdate(
        {_id: classId}, 
        {claimedBy: userId},
        {returnDocument: "after"}
    )
    const coach = await User.findById(userId);
    const coachName = mergeName({
        fn: coach.name.first, 
        ln: coach.name.last
    });
    res.status(200).json({
        _id: updated._id,
        isCoachClaimed: true,
        claimedBy: coachName
    });
}

module.exports = {
    getClasses,
    createNewClass,
    enrollIntoClass,
    claimClass
}