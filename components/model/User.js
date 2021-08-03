import mongoose from "mongoose";

const User = mongoose.Schema({

    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: false
    },
    state: {
        type: String,
        required: false
    },
    zip: {
        type: Number,
        required: false
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'Customer',
        require: true
    },
    emailVerified: {
        type: Boolean,
        required: true
    },
    registrationDate: {
        type: Date,
        default: Date.now()
    },
    verificationCode: {
        type: String,
        required: false
    },
    ip: {
        type: String,
        required: false
    },
    phone: {
        type: Number,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    address: {
        type: String,
        required: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},{
    timestamp: true,
    collection: 'users'
});

export default mongoose.model("User", User);