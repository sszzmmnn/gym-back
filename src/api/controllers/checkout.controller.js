const Checkout = require('../models/checkout.model')

// move some of that to the model as .statics function ?

const getAllCheckouts = async (req, res) => {
    const checkouts = await Checkout.find({});
    res.send(checkouts);
}

const getOneCheckout = async (req, res) => {
    const userId = req.userId;
    const checkout = await Checkout.find({ userId });
    if(!Object.keys(checkout).length){
        res.status(404).json({error: 'No such user for this checkout found.'})
    } else
        res.send(checkout);
}

const createCheckout = async (req, res) => {
    const body = req.body;
    if(!body || !body.userId) return res.status(400).json({error: 'Missing required body params'});

    try{
        const newCheckout = Checkout.create({ userId: body.userId, items: [] });
        res.send(newCheckout);
    } catch(e) {
        res.status(500).json({error: 'Failed to create the new checkout'});
    }
}

const updateCheckout = async (req, res) => {
    const userId = req.userId;

    console.log(req.params);
    res.send(userId);
}

module.exports = {
    getAllCheckouts, 
    getOneCheckout, 
    createCheckout, 
    updateCheckout
}