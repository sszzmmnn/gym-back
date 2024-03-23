const getAllHeaders = (CONSTANT, item) => {
    const headers = Object.entries(CONSTANT);
    const keysConst = Object.keys(CONSTANT);
    const keysDb = Object.keys(item); 

    const unique = keysDb.filter(key => !keysConst.includes(key));
    if(unique.length > 0) {
        unique.map(key => {headers.push([key, key])});
    }

    return headers;
}

module.exports = {
    getAllHeaders
}