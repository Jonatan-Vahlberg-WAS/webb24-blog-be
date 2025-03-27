const jwt = require('jsonwebtoken');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET

function generateAccessJWT(payload) {
    if(!ACCESS_SECRET) {
        throw new Error("NO ACCESS SECRET FOUND IN ENV")
    }
    const token = jwt.sign(
        payload,
        ACCESS_SECRET,
        {
            expiresIn: "12h"
        }
    )

    return token
}

function verifyAccessToken(token) {
    if(!ACCESS_SECRET) {
        throw new Error("NO ACCESS SECRET FOUND IN ENV")
    }

    const decyptedToken = jwt.verify(token, ACCESS_SECRET)

    return decyptedToken
}

module.exports = {
    generateAccessJWT,
    verifyAccessToken
}
