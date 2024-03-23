const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const memberSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    exp: {
        type: Number,
        required: true
    },
    accessCode: {
        type: String,
        required: true,
        default: '-'
    }
});

module.exports = mongoose.model('Member', memberSchema);