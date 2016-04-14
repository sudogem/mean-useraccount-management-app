var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
// var mongoStore = require('connect-mongo')(express);
var mongoStore = require('connect-mongo/es5')(session);
require('./models/users_model.js');
var db = mongoose.connect('mongodb://localhost/myapp');
var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
/*
 Error: Most middleware (like bodyParser) is no longer bundled with Express and must be installed separately.
 Please see https://github.com/senchalabs/connect#middleware
 // app.use(express.bodyParser());
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.cookieParser('SECRET'));
app.use(session({
  secret: 'SECRET',
  store: new mongoStore({
    db: db.connection.db,
    collection: 'sessions',
    maxAge: 300000
  })
}));
require('./routes')(app);
app.listen(8081);
