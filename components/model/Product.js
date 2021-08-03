import mongoose from "mongoose";

const Product = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        require: true
    },
    location: {
        type: Object,
        require: true
    },
    ingredients: {
        type: Object,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    visible: {
        type: Boolean,
        default: false,
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
},{
    timestamp: true,
    collection: "products"
})

export default mongoose.model("Product", Product);