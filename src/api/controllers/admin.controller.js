const User = require('../models/user.model');
const Member = require('../models/member.model');
const Refresh = require('../models/refresh.model');
const Pass = require('../models/pass.model');
const Invoice = require('../models/invoice.model');
const Class = require('../models/class.model');
const { ROLES, EMPTY_COLLECTION, CLASSES } = require('../constants/constant');
const { USER, PASS, MEMBER, INVOICE, CLASS, REFRESH } = require('../constants/admin.constant');

const { signJWT, tokenAndDataToJSON } = require('../utils/jwt.util');
const { mergeName } = require('../utils/class.util');
const { getAllHeaders } = require('../utils/admin.util');

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        if(!user.roles.includes(ROLES.Admin)) return res.status(401).json({error: 'Insufficient perms'});

        const refreshToken = signJWT({email}, "ja", "1h");
        const { _id } = await Refresh.create({token: refreshToken});
        const accessToken = signJWT({_id: _id, email: email}, "ja", "1m");
        console.log(`admin: ${JSON.stringify({token: accessToken, roles: user.roles})}`);

        const localStorageData = tokenAndDataToJSON(accessToken, user);
        res.status(200).send({ ...localStorageData[0] });
    } catch (err) {
        res.status(401).json({error: err.message});
    }
}

const getUsers = async (req, res) => {
    const { page } = req.query;
    const docCount = [];
    if(Number(page) === 0) docCount.push(await User.countDocuments());

    const users = await User
        .find({}, '-__v -password')
        .skip(
            docCount.length > 0 
                ? 0 
                : (Number(page) - 1) * 20)
        .limit(20);
    if(!users.length) return res.status(200).json(EMPTY_COLLECTION);
    const headers = Object.entries(USER);

    const keysConst = Object.keys(USER);
    const keysDb = Object.keys(users[0].toJSON());
    const unique = keysDb.filter(key => !keysConst.includes(key));
    if(unique.length > 0) {
        unique.map(key => {headers.push([key, key])});
    }

    const data = users.map(user => {
        return {
            ...user.toJSON(),
            name: mergeName({
                fn: user.name.first, 
                ln: user.name.last
            })
        }
    });
    if(docCount.length) data.push({documentCount: docCount[0]});

    res.status(200).json({
        headers,
        data
    });
}

const getMembers = async (req, res) => {
    const { page } = req.query;
    const docCount = [];
    if(Number(page) === 0) docCount.push(await Member.countDocuments());

    const members = await Member
        .find({}, '-__v -_id')
        .skip(
            docCount.length > 0 
                ? 0 
                : (Number(page) - 1) * 20)
        .limit(20);
    if(!members.length) return res.status(200).json(EMPTY_COLLECTION);
    const headers = Object.entries(MEMBER);

    const keysConst = Object.keys(MEMBER);
    const keysDb = Object.keys(members[0].toJSON());
    const unique = keysDb.filter(key => !keysConst.includes(key));
    if(unique.length > 0) {
        unique.map(key => {headers.push([key, key])});
    }

    const data = members.map(member => {
        return {
            ...member.toJSON(),
            exp: new Date(member.exp).toLocaleString('pl-PL')
        }
    });
    if(docCount.length) data.push({documentCount: docCount[0]});

    res.status(200).json({
        headers,
        data
    });
}

const getPasses = async (req, res) => {
    const { page } = req.query;
    const docCount = [];
    if(Number(page) === 0) docCount.push(await Pass.countDocuments());

    const passes = await Pass
        .find({}, '-__v')
        .skip(
            docCount.length > 0 
                ? 0 
                : (Number(page) - 1) * 20)
        .limit(20);
    if(!passes.length) return res.status(200).json(EMPTY_COLLECTION);
    const headers = Object.entries(PASS);

    const keysConst = Object.keys(PASS);
    const keysDb = Object.keys(passes[0].toJSON());
    const unique = keysDb.filter(key => !keysConst.includes(key) && key !== '_id');
    if(unique.length > 0) {
        unique.map(key => {headers.push([key, key])});
    }

    const data = passes.map(pass => {
        return {
            ...pass.toJSON(),
            name: pass.name,
            description: pass.description,
            price: pass.price / 100
        }
    });
    if(docCount.length) data.push({documentCount: docCount[0]});

    // res.status(200).json({
    //     headers: [['pass', 'Pass']],
    //     data: [{pass: 'pass-Success'}]
    // });
    res.status(200).json({
        headers,
        data
    });
}

const newPass = async (req, res) => {
    const { data } = req.body;
    if(!data || !data.name) return res.status(400).json({error: 'No pass name provided'});

    try {
        const newPass = {
            name: data.name,
            activeHours: parseInt(data.activeHours),
            price: Math.round(parseFloat(data.price) * 100),
            description: data.description || undefined,
            featured: data.featured
        }

        await Pass.create(newPass);
        res.status(200).json({success: true, message: ''});
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false, message: 'Failed to add the pass'});
    }
}

const deletePass = async (req, res) => {
    const { id } = req.query;
    if(!id) return res.status(404).json({error: 'Pass not found'});

    const pass = await Pass.findOneAndDelete({_id: id});
    if(pass) return res.status(200).json({success: true});
    res.status(400).json({success: false});
}

const getInvoices = async (req, res) => {
    const { page } = req.query;
    const docCount = [];
    if(Number(page) === 0) docCount.push(await Invoice.countDocuments());
    console.log('docCount:' + docCount);
    const invoices = await Invoice
        .find({}, '-__v -_id')
        .skip(
            docCount.length > 0 
                ? 0 
                : (Number(page) - 1) * 20)
        .limit(20);
    if(!invoices.length) return res.status(200).json(EMPTY_COLLECTION);

    const headers = getAllHeaders(INVOICE, invoices[0].toJSON());

    const data = invoices.map(invoice => {
        return {
            ...invoice.toJSON(),
            date: invoice.date.toLocaleString('pl-PL'),
            totalAmount: (invoice.totalAmount / 100)
        }
    })
    if(docCount.length) data.push({documentCount: docCount[0]});

    // res.status(200).json({
    //     headers: [['invoice', 'Invoice']],
    //     data: [{invoice: 'invoice_Success'}]
    // });
    res.status(200).json({
        headers,
        data
    });
}

const getClasses = async (req, res) => {
    const { page } = req.query;
    const docCount = [];
    if(Number(page) === 0) docCount.push(await Class.countDocuments());
    console.log('docCount:' + docCount);
    const classes = await Class
        .find({}, '-__v -_id')
        .skip(
            docCount.length > 0 
                ? 0 
                : (Number(page) - 1) * 20)
        .limit(20);
    if(!classes.length) return res.status(200).json(EMPTY_COLLECTION);

    const headers = getAllHeaders(CLASS, classes[0].toJSON());

    const data = classes.map(_class => {
        return {
            ..._class.toJSON(),
            date: _class.date.toLocaleString('pl-PL'),
            enrolled: _class.enrolled.length,
            claimedBy: _class.claimedBy.toString() === '000000000000000000000000' ? 'Nobody' : _class.claimedBy
        }
    })
    if(docCount.length) data.push({documentCount: docCount[0]});

    res.status(200).json({
        headers,
        data
    });
}

const getClassNames = (req, res) => {
    res.status(200).json(CLASSES);
}

const newClass = async (req, res) => {
    const { data } = req.body;
    if(!data || !data.name) return res.status(400).json({error: 'No class name provided'});

    try {
        const newClass = {
            name: data.name,
            date: data.date
        }

        await Class.create(newClass);
        res.status(200).json({success: true, message: ''});
    } catch (err) {
        console.log(err);
        res.status(400).json({success: false, message: 'Server: Failed to create new class'});
    }
}

module.exports = {
    loginUser,
    getUsers,
    getMembers,
    getPasses, newPass, deletePass,
    getInvoices,
    getClasses, getClassNames, newClass
}