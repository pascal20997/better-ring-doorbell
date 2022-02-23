const express = require("express");
const app = express();

const site = require("./routes/site");
const googleActions = require("./routes/google-actions");
const authentication = require("./routes/authentication");

app.use(express.static(__dirname + '/public'));

app.get("/", site.index);

app.listen(8000, function () {
  console.log('Listening to Port 8000');
});