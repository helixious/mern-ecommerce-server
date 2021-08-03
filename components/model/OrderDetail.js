import mongoose from "mongoose";

const OrderDetail = mongoose.Schema({
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    sku: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    }
}, {
    timestamp: true,
    collection: 'orderdetail'
});

export default mongoose.model("OrderDetail", OrderDetail);