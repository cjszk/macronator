const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/macro-coach';

const User = require('../../models/User.model');
const Data = require('../../models/Data.model');
const Measurement = require('../../models/Measurements.model');

const seedUsers = require('./testUser');
const seedData = require('./testData');
const seedMeasurements = require('./testMeasurement')

mongoose.connect(MONGODB_URI)
  .then(() => mongoose.connection.db.dropDatabase())
  .then(() => {
    return Promise.all([
      User.insertMany(seedUsers),
      Data.insertMany(seedData),
      Measurement.insertMany(seedMeasurements),
      User.createIndexes(),
      Data.createIndexes(),
      Measurement.createIndexes()
    ])
    console.log('Rewrote Database')
  })
  .then(() => mongoose.disconnect())
  .catch(err => {
    console.error(`ERROR: ${err.message}`);
    console.error(err);
  })