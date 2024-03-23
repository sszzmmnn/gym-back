const mapUsers = (users) => {
    return new Map(
        users.map(
            user => [
                user._id.toString(), 
                user.name ? {
                    fn: user.name.first, 
                    ln: user.name.last
                } : {
                    fn: null,
                    ln: null
                }
            ]
        )
    )
}

const mergeName = (user) => {
    return user 
        ? user.fn && user.ln 
            ? `${user.fn} ${user.ln}`
            : 'Someone...'
        : '-';
}

module.exports = {
    mapUsers,
    mergeName
}