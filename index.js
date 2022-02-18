const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Place = require('./models/place')
const methodOverride = require('method-override')
const morgan = require('morgan');

const uri = "mongodb+srv://SYSDBA:masterkey@cluster0.u96j0.mongodb.net/reviewhut?retryWrites=true&w=majority";
mongoose.connect(uri)
.then(() => {
    console.log("Mongo connected succesfully");
})
.catch(err => {
    console.log("Mongodb Error: ", err);
}) 

const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));


app.get('/', (req, res) => {
    res.render('home');
});

app.get('/places', async (req, res) => {
    const places = await Place.find({});
    res.render('places/index', {places});

});

app.post('/places', async (req, res) => {
    
    const place = new Place(req.body.place);
    await place.save();
    res.redirect(`places/${place._id}`);
});

app.get('/places/new', (req,res) => {
    res.render('places/new');
});

app.get('/places/:id', async (req, res) => {
    const {id} = req.params;
    const place = await Place.findById(id);
    res.render('places/details', {place});
});

app.patch('/places/:id', async(req,res) => {
    const {id} = req.params;

    const place = await Place.findByIdAndUpdate(id,req.body.place);
    res.redirect(`/places/${place._id}`);

});

app.delete('/places/:id', async(req,res) => {
    const {id} = req.params;
    const place = await Place.findByIdAndDelete(id);

    res.redirect('/places')
})


app.get('/places/:id/edit', async (req, res) => {
    const {id} = req.params;
    const place = await Place.findById(id);
    res.render(`places/edit`, {place});
});


app.use((err, req, res, next) => {
    console.log("*****ERROR*****");
})
app.use((req,res,next) => {
    res.status(404).send("Not found");
    next();
})



app.listen(3000, () =>{
    console.log("listening on port 3000");
});

