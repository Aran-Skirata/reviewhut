const mongoose = require('mongoose');
const Schema = mongoose.Schema;

reviewSchema = Schema({
    body: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("Review", reviewSchema);