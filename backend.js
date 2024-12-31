// @ts-nocheck
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");

const { connectToMongoDB } = require("./utils/mongodb");
const User = require("./models/user");

const errorController = require("./controllers/error");

const app = express();
const store = new MongoDBStore({
  uri: "mongodb+srv://Moscolian:ilovedherin2019@cluster0.cz0tz.mongodb.net/shop",
  collection: "sessions",
});
const csrfProtection = csrf();

app.set("view engine", "ejs");
app.set("views", "views");

// Middleware and routes
const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");
const authRoute = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUnintialized: false,
    store: store,
  })
);
app.use(csrfProtection);

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn || false;
  res.locals._csrf = req.csrfToken();
  next();
});

// MongoDB Connection and Middleware
connectToMongoDB()
  .then((db) => {
    // @ts-ignore
    app.use((req, res, next) => {
      // @ts-ignore
      req.db = db;
      next();
    });

    app.use(async (req, res, next) => {
      try {
        if (!req.session.userId) {
          return next();
        }

        const user = await User.findById(req.session.userId);
        if (user) {
          req.user = user;
          req.session.user = { id: user._id, email: user.email };
        }
        next();
      } catch (err) {
        console.error("Error fetching user for session:", err);
        next(err);
      }
    });

    app.use(adminRoute);
    app.use(shopRoute);
    app.use(authRoute);

    app.use(errorController.get404);

    // Start the server
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.error("Failed to initialize application", err);
  });
