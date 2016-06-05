var crypto = require('crypto');
var mongoose = require('mongoose');
var User = mongoose.model('User');

function hashPW(pwd){
  return crypto.createHash('sha256').update(pwd)
               .digest('base64').toString();
};

exports.init_signup = function(req, res) {
  res.render('signup', { msg: req.flash('msg') });
};

exports.signup = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (!username) {
    req.flash('msg', 'Missing username');
    res.redirect('/signup');
    return;
  }
  if (!password) {
    req.flash('msg', 'Missing password');
    res.redirect('/signup');
    return;
  }
  var user = new User({username: username});
  user.set('hashed_password', hashPW(password));
  user.set('email', req.body.email);
  user.set('job_title', req.body.job_title);
  user.save(function(err) {
    if (err) {
      console.log(err);
      req.flash('msg', err);
      res.redirect('/signup');
    } else {
      req.flash('msg', 'Successfully signup!');
      res.redirect('/signup');
    }
  });
};

exports.init_login = function(req, res) {
  if (req.session.user) {
    res.redirect('/');
  }
  res.render('login', { msg: req.flash('msg') });
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
          err = 'Invalid username and password.';
        } else if (user.hashed_password === hashPW(password.toString())) {
           req.session.regenerate(function(){
             req.session.user = user.id;
             req.session.username = user.username;
             req.session.isLogin = true;
             res.redirect('/');
           });
        } else {
          err = 'Authentication failed.';
        }
        if (err) {
          req.session.regenerate(function() {
            req.flash('msg', err);
            res.redirect('/login');
          });
        }
      });
}

exports.getUserProfile = function(req, res) {
  User.findOne({ _id: req.session.user })
      .exec(function(err, user) {
        if (!user) {
          res.json(404, {err: 'User Not Found.'});
        } else {
          res.json(user);
        }
      });
};

exports.edit_user = function(req, res) {
  if (req.session.user) {
    var result = {};
    User.findOne({ _id: req.session.user })
        .exec(function(err, user) {
          if (!user) {
            result = false;
          } else {
            result = user;
            res.render('user', { msg: req.flash('msg'), data:result });
          }
        });
  } else {
    req.flash('msg', 'Access denied!');
    res.redirect('/login');
  }
};

exports.update_user = function(req, res) {
  var email = req.body.email;
  var job_title = req.body.job_title;
  User.findOne({ _id: req.session.user })
      .exec(function(err, user) {
        user.set('email', email);
        user.set('job_title', job_title);
        user.save(function(err) {
          if (err) {
            res.sessor.error = err;
          } else {
            req.flash('msg', 'Successfully updated.');
          }
          res.redirect('/user');
        });
      });
}

exports.delete_confirm = function(req, res) {
  res.render('delete_confirm');
};

exports.delete_user = function(req, res) {
  User.findOne({ _id: req.session.user })
      .exec(function(err, user) {
        if (!user) {
          req.flash('msg', 'User not found.');
          res.redirect('/login');
        }

        if (user) {
          user.remove(function(err) {
            if (err) {
              res.sessor.error = err;
            }
            req.flash('msg', 'Successfully deleted.');
            req.session.destroy(function() {
              res.redirect('/login');
            });
          });
        }
      });
}
