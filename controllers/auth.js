const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.getLogin = (req, res, next) => {
  console.log(req.session.isLoggedIn);

  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    errorMessage: "",
    isAuthenticated: req.session.isLoggedIn || false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    docTitle: "Signup",
    isAuthenticated: false,
    errorMessage: ""
  });
};

exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).render("auth/login", {
      path: "/login",
      docTitle: "Login",
      errorMessage: "Email and password are required.",
      isAuthenticated: false,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).render("auth/login", {
          path: "/login",
          docTitle: "Login",
          errorMessage: "Invalid email or password.",
          isAuthenticated: false,
        });
      }

      return bcrypt.compare(password, user.password).then((doMatch) => {
        if (!doMatch) {
          return res.status(401).render("auth/login", {
            path: "/login",
            docTitle: "Login",
            errorMessage: "Invalid email or password.",
            isAuthenticated: false,
          });
        }

        req.session.userId = user._id;
        req.session.isLoggedIn = true;
        req.session.save((err) => {
          if (err) {
            console.log(err);
          }
          res.redirect("/");
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/login");
    });
};

exports.postSignup = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).render("auth/signup", {
      path: "/signup",
      docTitle: "Signup",
      errorMessage: "Passwords do not match.",
      isAuthenticated: false,
    });
  }

  if (password.trim() === "") {
    return res.status(400).render("auth/signup", {
      path: "/signup",
      docTitle: "Signup",
      errorMessage: "Password field is empty!",
      isAuthenticated: false,
    });
  }

  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.status(400).render("auth/signup", {
          path: "/signup",
          docTitle: "Signup",
          errorMessage: "Email already in use.",
          isAuthenticated: false,
        });
      }

      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });
      return user.save();
    })
    .then((result) => {
      console.log("User signed up successfully:", result);
      res.redirect("/login");
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/signup");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/login");
  });
};
