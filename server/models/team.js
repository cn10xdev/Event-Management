const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  memberRollNos: [String],
  teamName: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});

teamSchema.virtual('members', {
  ref: 'User',
  localField: 'memberRollNos',
  foreignField: 'rollNo',
});

teamSchema.set('toObject', { virtuals: true });
teamSchema.set('toJSON', { virtuals: true });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
