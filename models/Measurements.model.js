const mongoose = require('mongoose');

const MeasurementSchema = new mongoose.Schema({
    shoulders: {type: Number},
    chest: {type: Number},
    waistAbove: {type: Number},
    waist: {type: Number},
    waistBelow: {type: Number},
    hips: {type: Number},
    quads: {type: Number}
})

MeasurementSchema.set('toObject', {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  });
  

module.exports = mongoose.model('Measurement', MeasurementSchema);