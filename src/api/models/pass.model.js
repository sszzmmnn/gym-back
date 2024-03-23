const mongoose = require('mongoose');
const validator = require('validator');

const Schema = mongoose.Schema;

const passSchema = new Schema({ 
    name: {
        type: String,
        required: true,
        default: "-"
    },
    activeHours: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: "No description given"
    },
    featured: {
        type: Boolean,
        default: false
    }
})

passSchema.pre('save', function(next) {
    //name, desc
    //validator.escape()
    if(this.name !== undefined) {
        this.name = validator.escape(this.name);
    }

    if(this.description !== undefined) {
        this.description = validator.escape(this.description);
    }

    next();
});

passSchema.post('find', function(docs) {
    //validator.unescape()
    docs.forEach(doc => {
        doc.name = validator.unescape(doc.name);
        doc.description = validator.unescape(doc.description);
    });
});

passSchema.post('findOne', function(doc) {
    //validator.unescape()
    if (doc) {
        doc.name = validator.unescape(doc.name);
        doc.description = validator.unescape(doc.description);
    }
});

module.exports = mongoose.model('Pass', passSchema)