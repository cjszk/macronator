'use strict';

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const registerRouter = require('./routes/register');
const authRouter = require('./routes/auth');

const userRouter = require('./routes/user.route');
const dataRouter = require('./routes/data.route');
const measurementRouter = require('./routes/measurement.route');
const passport = require('passport');

const jwtStrategy = require('./passport/jwt');
const jwt = require('jsonwebtoken');
const localStrategy = require('./passport/local');

const { PORT, CLIENT_ORIGIN } = require('./config');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://chris:macronator@ds127958.mlab.com:27958/macronator';


app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
    skip: () => process.env.NODE_ENV === 'test'
}));

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);

app.get('/api', (req, res, next) => {
    res.json('Heroku Server Started')
  })  

app.use(express.static('public'));
app.use(express.json());

app.use('/api', registerRouter);
app.use('/api', authRouter);

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api', userRouter);
app.use('/api', dataRouter);
app.use('/api', measurementRouter);

app.use(passport.authenticate('jwt', {session: false, failWithError: true}));

//
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: app.get('env') === 'development' ? err : {}
    });
});
//

mongoose.connect(MONGODB_URI)
    .then(instance => {
    const conn = instance.connections[0];
    console.info(`Connected to: mongodb://${conn.host}:${conn.port}/${conn.name}`);
    })
    .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error('\n === Did you remember to start `mongod`? === \n');
    console.error(err);
    });

app.listen(PORT, function() {
    console.log(`App initiated and listing on ${PORT}.`)
})
