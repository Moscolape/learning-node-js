exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[2].trim().split('=')[1];
  console.log(req.session);
  res.render('auth/login', {
    path: '/login',
    docTitle: 'Login',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
    req.session.isLoggedIn = true;
    res.redirect('/');
  };