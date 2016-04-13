var express = require('express');
var mongoose = require('mongoose');
var mongoStore = require('connect-mongo')(express);
require('./models/users_model.js');
var db = mongoose.connect('mongodb://localhost/myapp');
var app = express();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(express.bodyParser());
app.use(express.cookieParser('SECRET'));
app.use(express.session({
  secret: 'SECRET',
  store: new mongoStore({
    db: db.connection.db,
    collection: 'sessions',
    maxAge: 300000
  })
}));
require('./routes')(app);
app.listen(8081);
