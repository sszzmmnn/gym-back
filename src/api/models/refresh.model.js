const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const Schema = mongoose.Schema;

const refreshSchema = new Schema({ //refreshSchema
    token: {
        type: String,
        required: true
    }
})

// sessionSchema.pre('create', async function (next) {
//     try {
//         const session = this;
//         // wywalić uuid, mongo mi zwrada _id jak biorę return ze Schema.create
//         session._id = uuidv4();
//         next();
//     } catch (err) {
//         next(err);
//     }
// })

module.exports = mongoose.model('Refresh', refreshSchema)