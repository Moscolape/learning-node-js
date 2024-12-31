exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);

  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isAuthenticated: req.session.isLoggedIn || false,
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  res.redirect("/");
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};
