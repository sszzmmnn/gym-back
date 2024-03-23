const Pass = require('../models/pass.model');
const validator = require('validator');

const getAllPasses = async (req, res) => {
    const passes = await Pass.find({});
    res.send(passes);
}

const getOnePass = async (req, res) => {
    const _id = req.params.id;
    if(!validator.isMongoId(_id)) return res.status(400).json({error: 'Invalid pass ID'});
    if(!_id) return res.status(400).json({error: 'No query params'});
    try{
        const pass = await Pass.findById({ _id });
        res.send({
            ...pass.toJSON(),
            name: pass.name,
            description: pass.description
        });
    }catch (err) {
        res.status(404).json({error: 'No such pass found'})
    }
}

const addNewPass = async (req, res) => {
    const body = req.body;
    try{
        const newPass = await Pass.create({ ...body });
        res.send(newPass);
    } catch(e) {
        res.status(500).json({error: "Failed to add the new pass"});
    }

}

module.exports = {
    getAllPasses,
    getOnePass
}