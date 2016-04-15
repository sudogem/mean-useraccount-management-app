"use strict";
var crypto = require('crypto');
var express = require('express');
var sessmsg = "";
module.exports = function(app) {
  var users = require('./controllers/users_controller');
  var site = require('./controllers/site_controller');
  var middleware = require('./middleware');

  app.use('/static', express.static( './static'))
     .use('/lib', express.static( '../lib')
  );

  // app.get('/', function(req, res) {
      // if (req.session.user) {
      //   res.render('index', {username: req.session.username, msg:req.session.msg});
      // } else {
      //   req.session.msg = 'Access denied!';
      //   res.redirect('/login');
      // }
  //     res.render('index', {msg: 'xxxx', username: '' });
  // });
  app.get('/', site.index);

  app.get('/user', users.edit_user);

  // app.get('/user/profile', users.getUserProfile);
  app.post('/user/update', users.update_user);

  app.get('/signup', users.init_signup);
  app.post('/signup', users.signup);

  app.get('/login', users.init_login);
  app.post('/login', users.login);

  app.get('/logout', function(req, res) {
    req.session.destroy(function(){
      res.redirect('/login');
    });
  });

  // app.post('/user/delete', users.deleteUser);
  // app.post('/login', users.login);

}
