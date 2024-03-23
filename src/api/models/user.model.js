const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');
const { phone } = require('phone');
const { ROLES } = require('../constants/constant');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    roles: {
        type: [Number],
        required: true,
        enum: [ROLES.User, ROLES.Coach, ROLES.Admin]
    },
    phone: {
        type: String
    },
    name: { // Pole to jest potrzebne zeby mozna bylo wyswietlac kto prowadzi zajecia
        first: {
            type: String,
            default: ""
        },
        last: {
            type: String,
            default: ""
        }
    }
});

userSchema.statics.login = async function(email, password) {
   
    // validation
    if(!email || !password) {
        throw Error('All fields must be filled');
    }

    const user = await this.findOne({ email });
    if(!user) {
        throw Error('Incorrect email or password');
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match) {
        throw Error('Incorrect email or password');
    }

    return user;
}

userSchema.statics.signup = async function(email, password, firstName, lastName, _phone) {

    // validation
    if(!email || !password || !_phone) {
        throw Error('All fields must be filled');
    }
    // if(!validator.isEmail(email)){
    //     throw Error('Given email is invalid');
    // }
    // if(!validator.isStrongPassword(password)){
    //     throw Error('Password not strong enough');
    // }
    if(!phone(_phone).isValid){
        throw Error('Given phone number is invalid');
    }

    const emailExists = await this.findOne({ email });
    if(emailExists) {
        throw Error('User with this email already exists');
    }

    const phoneExists = await this.findOne({_phone});
    if(phoneExists) {
        throw Error('This phone number is already in use');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await this.create({
        email, 
        password: hash, 
        roles: [ROLES.User], 
        phone: _phone,
        name: {
            first: validator.escape(firstName),
            last: validator.escape(lastName)
        }
    });
    return user;
}

userSchema.statics.changePassword = async function(_id, oldPw, newPw) {

    const user = await this.findOne({ _id });
    if(!user) {
        throw Error('User with this ID does not exist');
    }

    const match = await bcrypt.compare(oldPw, user.password);
    if(!match) {
        throw Error('Old password not matching');
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPw, salt);

    const updatedUser = await this.findOneAndUpdate({ _id }, { password: hash });
    return updatedUser;
}

userSchema.pre('save', function(next) {
    if(this.name.first !== undefined) {
        this.name.first = validator.escape(this.name.first);
    }

    if(this.name.last !== undefined) {
        this.name.last = validator.escape(this.name.last);
    }

    next();
});

userSchema.post('find', function(docs) {
    docs.forEach(doc => {
        doc.name.first = validator.unescape(doc.name.first);
        doc.name.last = validator.unescape(doc.name.last);
    });
});

userSchema.post('findOne', function(doc) {
    if (doc) {
        doc.name.first = validator.unescape(doc.name.first);
        doc.name.last = validator.unescape(doc.name.last);
    }
});

module.exports = mongoose.model('User', userSchema)