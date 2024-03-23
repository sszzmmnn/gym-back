const { signJWT } = require('../utils/jwt.util');

const Invoice = require('../models/invoice.model');
const Member = require('../models/member.model');
const User = require('../models/user.model');
const Pass = require('../models/pass.model');

const handleOrder = async (req, res) => {
    const { userId, passId, passCount: quantity } = req.body;
    if(!userId || !passId || !quantity) return res.status(400).json({error: 'We weren\'t provided enough data to continue the transaction.'});
    console.log(req.body);

    const user = await User.findById(userId);
    const pass = await Pass.findById(passId);
    if(!user || !pass) return res.status(400).json({error: 'Failed to find user/pass with data provided.'});

    const currentTime = Date.now();
    const exp = Math.floor(currentTime / 1000) + pass.activeHours * quantity * 3600;
    const totalAmount = pass.price * quantity;

    try{
        await Invoice.create({
            date: currentTime, 
            userId, 
            passId, 
            passName: pass.name, 
            quantity, 
            totalAmount
        });
    } catch (err) {
        return res.status(500).json({error: 'Failed to create an invoice for this order.'});
    }

    // if member already exists, just update it
    const exists = await Member.findOne({ userId });
    if(exists) {
        const updatedExp = exists.exp + pass.activeHours * quantity * 3600;
        console.log(`exp: ${exists.exp}\tupdatedExp: ${updatedExp}`)
        accessCode = signJWT({memberId: exists._id, userId}, "ja", `${pass.activeHours * quantity}h`);
        try{
            await Member.findByIdAndUpdate(exists._id, { exp: updatedExp, accessCode });
        } catch (err) {
            return res.status(500).json({error: 'Failed to update the member pass.'});
        }
    } else {
        const member = await Member.create({userId, exp});
        const accessCode = signJWT({memberId: member._id, userId}, "ja", `${pass.activeHours * quantity}h`);
        try {
            await Member.findByIdAndUpdate(member._id, {accessCode});
        } catch (err) {
            return res.status(500).json({error: 'Failed to update the member pass.'});
        }
    }

    res.status(200).send(true);
}

module.exports = {
    handleOrder
}