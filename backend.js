// @ts-nocheck
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const { connectToMongoDB } = require("./utils/mongodb");
const User = require("./models/user");

const errorController = require("./controllers/error");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

// Middleware and routes
const adminRoute = require("./routes/admin");
const shopRoute = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// MongoDB Connection and Middleware
connectToMongoDB()
  .then((db) => {
    // @ts-ignore
    app.use((req, res, next) => {
      // @ts-ignore
      req.db = db;
      next();
    });

    // @ts-ignore
    app.use(async (req, res, next) => {
      try {
        const user = await User.findById("676e9e0075593858b2dc6fb9");
        req.user = user;
        next();
      } catch (err) {
        console.error("Error setting user in request:", err);
        next(err);
      }
    });
    

    app.use(adminRoute);
    app.use(shopRoute);

    // Define routes or start the server
    app.use(errorController.get404);

    // Start the server
    app.listen(4000, () => {
      console.log("Server is running on port 4000");
    });
  })
  .catch((err) => {
    console.error("Failed to initialize application", err);
  });
