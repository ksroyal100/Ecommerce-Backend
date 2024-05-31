const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        // required: true,
        default: "CUSTOMER"
    },
    mobile: {
        type: String,
        // required: true,
    },
    address: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "addresses"
    }],
    payment: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment_Info"
    }],
    ratings: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ratings"
    }],
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "reviews"
    }],
},
    {
        timestamps: true
    }
)

const User = mongoose.model('users', UserSchema);

module.exports = User