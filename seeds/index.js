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

    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const place = new Place({
            title: `${sample(places)} ${sample(descriptors)}`,
            price: (Math.random() * 500).toPrecision(2),
            location: `${cities[random1000].city} ${cities[random1000].state}`,
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam pretium eu purus varius ultricies. Vivamus rhoncus, metus cursus pellentesque ultrices, eros mi posuere orci, nec aliquet enim metus vestibulum velit. Nunc semper sapien sit amet mattis tristique. Fusce augue nibh, posuere nec enim sit amet, congue condimentum nulla. Donec vitae urna tortor. Donec id nulla nibh. Aliquam ut quam at elit tristique suscipit.",
            img: "https://picsum.photos/400/300",
            owner: "6242c27878442940116e77e9",
        });
        await place.save();
        console.log("succes")
    }

}


SeedDB();