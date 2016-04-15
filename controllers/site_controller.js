exports.index = function(req, res) {
  res.render('index', { msg: 'xxxx', username: req.session.username, login: false });
};
