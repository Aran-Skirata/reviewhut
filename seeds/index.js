const mongoose = require('mongoose');
const Place = require('../models/place')
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers');
const uri = "mongodb+srv://SYSDBA:masterkey@cluster0.u96j0.mongodb.net/reviewhut?retryWrites=true&w=majority";
mongoose.connect(uri)
.then(() => {
    console.log("Mongo connected succesfully");
})
.catch(err => {
    console.log("Mongodb Error: ", err);
}) 

const sample = array => array[Math.floor(Math.random() * array.length)];



const SeedDB = async () => {
    await Place.deleteMany({});

    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const place = new Place({title: `${sample(places)} ${sample(descriptors)}`, location: `${cities[random1000].city} ${cities[random1000].state}`});
        await place.save();
    }

}


SeedDB();