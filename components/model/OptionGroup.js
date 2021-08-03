import mongoose from "mongoose";

const OptionGroup = mongoose.Schema({
    optionGroupId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    optionName: {
        type: String,
        required: true
    }
},{
    timestamp: true,
    collection: 'optiongroups'
});

export default mongoose.model("OptionGroup", OptionGroup);