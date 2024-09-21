const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventCode: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    unique: true,
  },
  day: {
    type: Number,
    required: true,
    enum: [1, 2, 3],
    index: true,
  },
  start: {
    type: String,
    trim: true,
    required: true,
    validate: /^\d-\d{1,2}:\d{2}$/,
  },
  end: {
    type: String,
    trim: true,
    required: true,
    validate: /^\d-\d{1,2}:\d{2}$/,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  seats: {
    type: Number,
    required: true,
    default: 0,
  },
  maxSeats: {
    type: Number,
    required: true,
    min: 1,
  },
  category: {
    type: String,
    required: true,
    trim: true,
    uppercase: true,
    enum: ['C', 'T', 'F'],
  },
  isSeminar: {
    type: Boolean,
    required: true,
  },
  teamSize: {
    type: Number,
    required: true,
    min: 1,
  },
  isTeamSizeStrict: {
    type: Boolean,
    required: true,
  },
  entryFee: {
    type: Number,
    required: true,
  },
  prizeMoney: {
    type: [Number],
    required: true,
  },
  registered: {
    type: [String],
    required: true,
  },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
