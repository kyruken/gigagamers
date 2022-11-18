const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const app = express();

const userController = require('./controllers/userController');

const mongoDb = "mongodb+srv://kairuken:swagman@cluster0.2cnpqko.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(mongoDb, {useUnifiedTopology: true, useNewUrlParser: true})
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

const directoryRouter = require('./routes/directory');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));


app.use('/', directoryRouter);


app.listen(process.env.PORT || 3000);

