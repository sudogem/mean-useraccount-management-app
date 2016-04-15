var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');

function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd)
               .digest('base64').toString();
};

exports.init_signup = function(req, res) {
  if (req.session.msg) {
    var sessmsg = req.session.msg;
    req.session.msg = "";
  }
  res.render('signup', { msg: sessmsg });
};

exports.signup = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (!username) {
    req.session.msg = "Missing username";
    res.redirect('/signup');
    return;
  }
  if (!password) {
    req.session.msg = "Missing password";
    res.redirect('/signup');
    return;
  }
  var user = new User({username: username});
  user.set('hashed_password', hashPW(password));
  user.set('email', req.body.email);
  user.save(function(err) {
    if (err) {
      res.session.msg = err;
      res.redirect('/signup');
    } else {
      // req.session.user = user.id;
      // req.session.username = user.username;
      // req.session.msg = 'Authenticated as ' + user.username;
      req.session.msg = "Successfully signup!";
      res.redirect('/signup');
    }
  });
};

exports.init_login = function(req, res) {
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('login', {msg:req.session.msg});
}

exports.login = function(req, res) {
  if (req.session.user) {
    res.redirect('/');
  }
  var username = req.body.username;
  var password = req.body.password;
  var err = '';
  User.findOne({ username: username })
      .exec(function(err, user) {
        if (!user){
          err = 'User Not Found.';
        } else if (user.hashed_password === hashPW(password.toString())) {
           req.session.regenerate(function(){
             req.session.user = user.id;
             req.session.username = user.username;
             req.session.msg = 'Authenticated as ' + user.username;
             res.redirect('/');
           });
        } else {
          err = 'Authentication failed.';
        }
        if (err) {
          req.session.regenerate(function(){
            req.session.msg = err;
            res.redirect('/login');
          });
        }
      });
}
