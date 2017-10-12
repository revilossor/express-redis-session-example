const express = require('express');
const redis = require('redis');
const session = require('express-session');
const redisStore = require('connect-redis')(session);
const redisClient = redis.createClient();
const settings = {
  port: 3000
};

const app = express();

app.use(session({
  secret: 'i am a secret',
  store: new redisStore({
    host: 'localhost',
    port: 6379,
    client: redisClient,
    ttl: 300
  }),
  saveUninitialized: true,
  resave: true
}));

app.use('/', (req, res, next) => {
  if(!req.session.views) { req.session.views = 0; }
  next();
});

app.use('/', (req, res) => {
  req.session.views++;
  res.send(`you have viewed this page ${req.session.views} times`);
});

app.listen(settings.port, () => {
  console.log(`app listening on port ${settings.port}`);
});
