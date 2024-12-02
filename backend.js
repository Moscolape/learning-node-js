const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminData = require("./routes/admin");
const shopRoute = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")))


app.use(adminData.routes);
app.use(shopRoute);

app.use((req, res, next) => {
  res
    .status(404)
    .render('not-found', {docTitle: 'Error 404'})
});

app.listen(4000);