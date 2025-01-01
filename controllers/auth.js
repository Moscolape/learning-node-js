const transporter = require("../utils/email");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


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
    errorMessage: "",
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

exports.getReset = (req, res, next) => {
  res.render("auth/forgotpassword", {
    path: "/forgotten-password",
    docTitle: "Forgotten Password",
    isAuthenticated: false,
    errorMessage: "",
  });
};


exports.getChangePassword = (req, res, next) => {
  const { token } = req.params;
  res.render("auth/resetpassword", {
    path: "/reset-password",
    docTitle: "Reset Password",
    isAuthenticated: false,
    errorMessage: "",
    token,
  });
};


exports.postChangePassword = (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).render("auth/resetpassword", {
          path: "/reset-password",
          docTitle: "Reset Password",
          isAuthenticated: false,
          errorMessage: "Token is invalid or has expired. Please try resetting again.",
        });
      }

      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          user.password = hashedPassword;
          user.resetToken = undefined;
          user.resetTokenExpiration = undefined;
          
          return user.save();
        })
        .then(() => {
          res.redirect("/login");
        });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
};


exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/");
    }
    const token = buffer.toString("hex");

    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(404).render("auth/forgotpassword", {
            path: "/forgotten-password",
            docTitle: "Forgotten Password",
            isAuthenticated: false,
            errorMessage: "No account with this email exists!",
          });
        }

        user.resetToken = token;
        // @ts-ignore
        user.resetTokenExpiration = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        if (!result) return;
        
        return transporter.sendMail({
          to: req.body.email,
          from: "chunkums088@gmail.com",
          subject: "Password Reset",
          html: `
            <p>You requested a password reset.</p>
            <p>Click this <a href="http://localhost:4000/reset-password/${token}">link</a> to reset your password.</p>
          `,
        });
      })
      .then(() => {
        return res.status(400).render("auth/login", {
          path: "/login",
          docTitle: "Login",
          errorMessage: "Password reset link has been successfully sent to your email address.",
          isAuthenticated: false,
        });
      })
      .catch((err) => {
        console.log(err);
        next(err);
      });
  });
};