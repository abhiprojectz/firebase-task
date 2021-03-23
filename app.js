// imports
// const functions = require('firebase-functions')
const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const morgan = require('morgan');
// const ejs = require('ejs');
const app = express();

// Static files
app.use(express.static(path.join(__dirname, 'static')));

// Settings
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


// middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));

// Routes
app.use(require('./routes/index'));



module.exports = app;
// exports.app = functions.https.onRequest(app);