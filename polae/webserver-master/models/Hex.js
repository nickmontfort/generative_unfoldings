const mongoose = require('mongoose');

const HexSchema = mongoose.Schema({
  index: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  date:  {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Hex', HexSchema);


