const mongoose = require('mongoose');
const Review = require('./review');
const {cloudinary} = require('../cloudinary')
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
    images: [{
        url: {
            type: String,
        },
        filename: {
            type: String,
        },
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
})

placeSchema.post('findOneAndDelete', async function (doc) {
    for(let image of doc.images)
    {
        cloudinary.uploader.destroy(image.filename);
    }
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            }
        });
    }
})

module.exports = mongoose.model('Place', placeSchema);

