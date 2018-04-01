const mongoose = require('mongoose');

const DataSchema = new mongoose.Schema({
    date: {type: Date},
    weight: {type: Number},
    calories: {type: Number},
    measurements: {type: Object, ref: 'Measurement'}
})

DataSchema.set('toObject', {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  });

module.exports = mongoose.model('Data', DataSchema);