const mongoose = require('mongoose'),
      { Schema } = mongoose;

const user = new Schema({
  username: {
    type: String,
    required: true
  },
  mail: {
    type: String,
    required: true
  },
});



module.exports = mongoose.model('User', user);