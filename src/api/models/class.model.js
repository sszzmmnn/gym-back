const mongoose = require('mongoose');
const { CLASSES } = require('../constants/constant');

const Schema = mongoose.Schema;

/*
 - nazwa cwiczenia
 - data cwiczenia
 - zapisani ludzie, lista id
 - przypisany trener
 -
*/
const classSchema = new Schema({
    name: {
        type: String,
        required: true,
        enum: CLASSES
    },
    date: {
        type: Date,
        required: true,
    },
    enrolled: {
        type: [Schema.Types.ObjectId],
        default: []
    },
    claimedBy: {
        type: Schema.Types.ObjectId,
        default: "000000000000000000000000"
    }
});

module.exports = mongoose.model('Class', classSchema);