const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  ratedBy: { type: Schema.Types.ObjectId, ref: 'User'},
  targetType: { type: String , enum: ['contractor', 'labour_worker', 'equipment'] },
  targetId: { type: Schema.Types.ObjectId, refPath: 'targetType' },
  rating: { type: Number },
  ratingDate: { type: Date},
  review: { type: String }
});

const Ratings = mongoose.model('Ratings', ratingSchema);

module.exports = Ratings;
