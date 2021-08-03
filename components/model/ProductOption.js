import mongoose from "mongoose";

const ProductOption = mongoose.Schema({
    productOptionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name: {
        type: String,
        required: true
    }
},{
    timestamp: true,
    collection: "productoptions"
});


export default mongoose.model("ProductOption", ProductOption);