var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var session = require('express-session');
var cookieParser = require('cookie-parser');
// var mongoStore = require('connect-mongo')(express);
var mongoStore = require('connect-mongo/es5')(session); // For versions 0.10, 0.12 and io.js, you must use the ES5 fallback:

require('./models/users_model.js');
mongoose.connect('mongodb://localhost/myapp');
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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
//app.use(express.cookieParser('SECRET'));
app.use(session({
  secret: 'SECRET',
  resave: false,
  saveUninitialized: false,
  store: new mongoStore({
    mongooseConnection: mongoose.connection,
    collection: 'sessions', // url: 'mongodb://localhost/myapp',
    ttl: 14 * 24 * 60 * 60 // = 14 days. Default
  })
  // Error: Connection strategy not found
  // store: new mongoStore({
  //   db: db.connection.db.databaseName,
  //   collection: 'sessions',
  //   maxAge: 300000
  // })
}));

var debug = require('debug')('mean-useraccount-management-app:server');
require('./routes')(app);
app.listen(8081);
debug('Listening on 8081');
