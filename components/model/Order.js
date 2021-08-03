import mongoose from "mongoose";

const Order = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    shipName: {
        type: String,
        required: true
    },
    shipAddress: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zip: {
        type: Number,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    shipped: {
        type: Boolean,
        required: true
    },
    trackingNumber: {
        type: Number,
        required: false
    }
}, {
    timestamp: true,
    collection: 'orders'
}
);

export default mongoose.model("Order", Order);