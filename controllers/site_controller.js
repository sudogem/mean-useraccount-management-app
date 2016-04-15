exports.index = function(req, res) {
  if (req.session.user) {
    res.render('index', { username: req.session.username, login: req.session.isLogin, msg: req.session.msg });
  } else {
    req.flash('msg', 'Access denied!');
    res.redirect('/login');
  }

};
