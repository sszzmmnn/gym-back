const USER = {
    _id: 'ID',
    email: 'E-mail',
    roles: 'Roles',
    phone: 'Phone Number',
    name: 'Name'
}

const PASS = {
    name: 'Name',
    activeHours: 'Active Hours',
    price: 'Price (PLN)',
    description: 'Description',
    featured: 'Featured'
}

const MEMBER = {
    userId: 'User ID',
    exp: 'Expires',
    accessCode: 'Access Code'
}

const INVOICE = {
    date: 'Date',
    userId: 'User ID',
    passId: 'Pass ID',
    passName: 'Pass Name',
    quantity: 'Quantity',
    totalAmount: 'Total Amount'
}

const CLASS = {
    name: 'Class Name',
    date: 'Class Date',
    enrolled: 'People Enrolled',
    claimedBy: 'Claimed By'
}

const REFRESH = {
    token: 'Token'
}

module.exports = {
    USER,
    PASS,
    MEMBER,
    INVOICE,
    CLASS,
    REFRESH
}