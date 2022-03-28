const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
    title: {
        type: 'String',
        required: [true, "Title required"]
    },
    price: {
        type: 'Number',
        required: [true, "Price is required"],
        min: [0, "Price cannot be negative"],
    },
    description: {
        type: 'String',
    },
    location: {
        type: "String",
        required: [true, "Location is required"]
    },
    img: {
        type: "String",
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
})

placeSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.remove({
            _id: {
                $in: doc.reviews,
            }
        });
    }
})

module.exports = mongoose.model('Place', placeSchema);

