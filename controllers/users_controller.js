var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');
function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd)
               .digest('base64').toString();
};
exports.init_signup = function(req, res) {
  if (req.session.user) {
    res.redirect('/');
  }
  if (req.session.msg) {
    var sessmsg = req.session.msg;
    req.session.msg = "";
  }
  res.render('signup', {msg: sessmsg});
};

exports.signup = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (!username) {
    // res.sessor.error = "Missing username";
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
      res.session.error = err;
      res.redirect('/signup');
    } else {
      req.session.user = user.id;
      req.session.username = user.username;
      req.session.msg = 'Authenticated as ' + user.username;
      res.redirect('/');
    }
  });
};
