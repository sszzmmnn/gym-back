const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const checkoutSchema = new Schema({
    userId: {
        type: Number,
        required: true
    },
    items: [{
        itemId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        count: {
            type: String,
            required: true,
            min: 0
        }
    }]
})

module.exports = mongoose.model('Checkout', checkoutSchema);