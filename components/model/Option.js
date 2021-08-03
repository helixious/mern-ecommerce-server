import mongoose from "mongoose";

const Option = mongoose.Schema({
    optionId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false
    },
    optionGroupId: {
        type: String,
        required: true
    },
    optionPriceIncrement: {
        type: Number,
        required: true
    }
},{
    timestamp: true,
    collection: 'options'
});

export default mongoose.model("option", Option);