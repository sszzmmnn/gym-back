const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    date: {
        type: Date,
        required: true,
        default: Date.now()
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    passId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    passName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model('Invoice', invoiceSchema);