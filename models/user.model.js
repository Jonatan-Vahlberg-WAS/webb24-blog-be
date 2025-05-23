const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 8,
    },
    name: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
})

userSchema.pre('save',async function(next) {
    const user = this
    if(user.isModified('password')) {
        try {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(user.password, salt)
            user.password = hashedPassword
            next()
        } catch (error) {
            console.warn("Error: in hashing password")
            next(error)
        }
    }
})

const User = mongoose.model("User", userSchema)

module.exports = User