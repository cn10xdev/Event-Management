const { default: validator } = require('validator');
const Event = require('../models/event');

module.exports = async function (fields) {
  const {
      eventCode,
      day,
      start,
      end,
      title,
      description,
      image,
      maxSeats,
      category,
      isSeminar,
      teamSize,
      isTeamSizeStrict,
      entryFee,
      prizeMoney,
    } = fields,
    processed = {},
    errors = {};

  // eventCode
  if (!validator.isAlphanumeric(eventCode)) {
    errors.eventCode = 'only letters';
  } else {
    const doc = await Event.findOne({ eventCode: eventCode.toUpperCase() });
    if (doc) {
      errors.eventCode = 'already exists';
    } else {
      processed.eventCode = eventCode.toUpperCase();
    }
  }

  // day
  if (1 <= day && day <= 3) {
    processed.day = day;
  } else {
    errors.day = 'either 1, 2 or 3';
  }

  // start
  if (/^[123]-\d{1,2}:\d{1,2}$/.test(start)) {
    processed.start = start;
  } else {
    errors.start = 'like d-HH:MM';
  }

  // end
  if (/^[123]-\d{1,2}:\d{1,2}$/.test(end)) {
    processed.end = end;
  } else {
    errors.end = 'like d-HH:MM';
  }

  // title
  if (title.trim().length < 100) {
    processed.title = title.trim();
  } else {
    errors.title = 'title too long';
  }

  // description
  processed.description = description.trim();

  // image
  if (validator.isURL(image)) {
    processed.image = image;
  } else {
    errors.image = 'image should be a url';
  }

  // maxSeats
  if (Number.isInteger(maxSeats) || validator.isInt(maxSeats)) {
    processed.maxSeats = parseInt(maxSeats);
  } else {
    errors.maxSeats = 'should be an integer';
  }

  // category
  if (validator.isIn(category, ['C', 'T', 'F'])) {
    processed.category = category;
  } else {
    errors.category = 'invalid category';
  }

  // isSeminar, isTeamSizeStrict
  processed.isSeminar = isSeminar;
  processed.isTeamSizeStrict = isTeamSizeStrict;

  // teamSize
  if (Number.isInteger(teamSize) || validator.isInt(teamSize)) {
    processed.teamSize = parseInt(teamSize);
  } else {
    errors.teamSize = 'invalid team size';
  }

  // entryFee
  if (Number.isInteger(entryFee) || validator.isInt(entryFee)) {
    processed.entryFee = parseInt(entryFee);
  } else {
    errors.entryFee = 'invalid entry fee';
  }

  // prizeMoney
  if (/^(\s*\d+\s*,*)*$/.test(prizeMoney.toString())) {
    processed.prizeMoney = prizeMoney
      .toString()
      .trim()
      .split(',')
      .map(n => parseInt(n.trim()));
  } else {
    errors.prizeMoney = 'should be of the form X, Y, Z and so on';
  }
  return { processed, errors };
};
