const mongoose = require('mongoose')

const shortUrlSchema = new mongoose.Schema({
  full: {
    type: String,
    required: true
  },
  short: {
    type: String,
    unique: true,
    required: true
  },
  clicks: {
    type: Number,
    required: true,
    default: 0
  },
  last_click:{
    type: Date
  },
  created_at:{
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)