const bcrypt = require("bcrypt")
const express = require("express");

const router = express.Router();

const User = require("../models/user.model");
const { generateAccessJWT, generateRefreshJWT, verifyRefreshToken } = require("../utils/jwt");

router.post("/register/", async (req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).json({
            message: "User registered correctly"
        })
    } catch (error) {
        console.warn("Error registring user", error)
        res.status(400).json({
            error: "User unable to register"
        })
    }
})

router.post("/login/", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email })
        if (!user) {
           throw new Error("User not found")
        }
        const isPasswordSame = await bcrypt.compare(req.body.password, user.password)

        if(!isPasswordSame){
           throw new Error("User not found")
        }
        const token = generateAccessJWT({
            userId: user._id,
            isAdmin: user.isAdmin || false
        })
        const refreshToken = generateRefreshJWT({
            userId: user._id,
        })

        res.json({
            token,
            refreshToken
        })
    }
    catch(error) {
        console.warn("Error logging in user", error)
        res.status(400).json({
            error: "User unable to login"
        })
    }
})


router.post("/token/refresh/", async (req, res) => {
    const token = req.body.token
    try {
        console.log("TOKEN ", token, req.body)
        if(!token) {
            throw new Error("No token")
        }
        const decodedToken = verifyRefreshToken(token)
        if(!decodedToken){
            throw new Error("Token expired")
        }

        const user = await User.findById(decodedToken.userId)
        if(!user) {
            throw new Error("no user found")
        }
        const newAccessToken = generateAccessJWT({
            userId: user._id,
            isAdmin: user.isAdmin || false
        })
        res.json({
            token: newAccessToken
        })
    } catch (error) {
        return res.status(401).json({
            message: "Unauthorized",
          });
    }

})

module.exports = router