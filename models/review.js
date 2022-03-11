const mongoose = require('mongoose');
Schema = mongoose.Schema;

reviewSchema = Schema({
    body: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model("Review",reviewSchema);