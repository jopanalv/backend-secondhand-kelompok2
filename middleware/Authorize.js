const jwt = require('jsonwebtoken')

accessControl = {
    SELLER: "seller",
    BUYER: "buyer",
}

const authorize = (rolename) => {
    return (req, res, next) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            const payload = decodeToken(token)

            if (!!rolename && rolename != payload.role)
                return res.sendStatus(403)

            req.user = payload;
            req.id = payload.userId
            next();
        }
        catch (err) {
            res.json({
                message: err.message
            })
        }
    }
}

const decodeToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

module.exports = {authorize}