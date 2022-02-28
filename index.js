const express = require('express');
const app = express();
const oauthServer = require('./oauth/server.js');
const bodyParser = require('body-parser');
const site = require('./routes/site');
const ringListener = require('./listener/ring');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));

app.get('/', site.index);
app.use('/oauth', require('./routes/authentication'));
app.use('/google-actions', oauthServer.authenticate(), require('./routes/google-actions'));
app.use('/stream', oauthServer.authenticate(), require('./routes/stream'));

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.error = err;
  const status = err.status || 500;
  console.log(err);
  res.status(status);
  res.send(`ERROR ${status}`);
});

app.listen(8000, function () {
  console.log('Listening to Port 8000');
});

ringListener.initialize();
