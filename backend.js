const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const { connectToMongoDB } = require("./utils/mongodb"); // Import the function
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
    // Attach the database reference to the request object
    // @ts-ignore
    app.use((req, res, next) => {
      // @ts-ignore
      req.db = db;
      next();
    });

    // Example user-fetching middleware (replace with your logic)
    // @ts-ignore
    app.use(async (req, res, next) => {
      try {
        // @ts-ignore
        const user = await req.db
          .collection("users")
          .findOne({ _id: "user-id" }); // Replace "user-id" with actual logic
        // @ts-ignore
        req.user = user;
        next();
      } catch (err) {
        console.error(err);
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
