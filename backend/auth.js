const jwt = require('jsonwebtoken');

const secret = "ECommerceAPI";

module.exports.createAccessToken = (user) => {
    const data = {
        id: user._id,
        isAdmin: user.isAdmin,
        email: user.email
    }

    return jwt.sign(data, secret, {})
}

module.exports.verify = (request, response, next) => {
    let token = request.headers.authorization;
    if(token !== undefined) {
        token = token.slice(7, token.length);
        jwt.verify(token, secret, (error, data) => {
            if(error) {
                return response.send(false);
            } else {
                next()
            }
        }) 
    } else {
        return response.send(false);
    }
} 

module.exports.decode = (token) => {
    token = token.slice(7, token.length);
    return jwt.decode(token, {complete: true}).payload;
}