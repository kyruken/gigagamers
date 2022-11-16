const express = require('express');
const session = require('express-session');
const expressLayouts = require('express-ejs-layouts')

const app = express();

const directoryRouter = require('./routes/directory');

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');
app.use(expressLayouts);
app.use(express.static('public'));

app.get('/', directoryRouter);

app.listen(process.env.PORT || 3000);

