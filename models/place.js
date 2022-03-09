const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
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
    }
})

module.exports = mongoose.model('Place', PlaceSchema);

