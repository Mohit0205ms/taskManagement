const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: true
  },
  title: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  }
})

module.exports = mongoose.model('task',taskSchema);