const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PlaceSchema = new Schema({
    title: {
        type: 'String',
    },
    price: {
        type: 'Number',
    },
    description: {
        type: 'String',
    },
    location: {
        type: "String",
    }
})

module.exports = mongoose.model('Place', PlaceSchema);

