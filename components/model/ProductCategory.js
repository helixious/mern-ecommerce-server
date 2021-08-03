import mongoose from "mongoose";

const ProductCategory = mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    name: {
        type: String,
        required: true
    }
},{
    timestamp: true,
    collection: 'productcategories'
});


export default mongoose.model("ProductCategory", ProductCategory);