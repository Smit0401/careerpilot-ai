const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: [true, "Username already taken"],
        required: [true, "Username is required"],
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    email: {
        type: String,
        unique: [true, "Email already registered"],
        required: [true, "Email is required"],
        trim: true,
        lowercase: true
    },
    password : {
        type: String,
        required: [true, "Password is required"],
        select: false
    }
}, {
    timestamps: true
})

const userModel = mongoose.model('User', userSchema)
module.exports = userModel
