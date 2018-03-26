const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    data: [{type: mongoose.Schema.Types.ObjectId, ref: 'Data'}],
    created: {type: Date, default: Date.now()}
})

UserSchema.set('toObject', {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  });
  
module.exports = mongoose.model('User', UserSchema);