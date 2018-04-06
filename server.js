const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const userRouter = require('./routes/user.route');
const dataRouter = require('./routes/data.route');
const measurementRouter = require('./routes/measurement.route');
const authRouter = require('./routes/auth');
const passport = require('passport');
const localStrategy = require('./passport/local');

// const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/macro-coach';
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://chris:macronator@ds127958.mlab.com:27958/macronator';

const User = require('./models/User.model')

PORT = process.env.PORT || 8080;

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
    skip: () => process.env.NODE_ENV === 'test'
  }));

app.use(express.static('public'));

app.use(express.json());

passport.use(localStrategy);

app.use('/', userRouter);
app.use('/', dataRouter);
app.use('/', measurementRouter);
app.use('/', authRouter);

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

//!!Wall-break
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