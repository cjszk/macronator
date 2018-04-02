const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

const userRouter = require('./routes/user.route');
const dataRouter = require('./routes/data.route');
const measurementRouter = require('./routes/measurement.route');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/macro-coach';

const User = require('./models/User.model')

const port = 8080;

app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'common', {
    skip: () => process.env.NODE_ENV === 'test'
  }));

app.use(express.static('public'));

app.use(express.json());

app.use('/', userRouter);
app.use('/', dataRouter);
app.use('/', measurementRouter);

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

app.listen(port, function() {
    console.log(`App initiated and listing on ${port}.`)
})