import mongoose from 'mongoose';
const Schema = mongoose.Schema;
// rating is not using anywhere  in my application , but needed to be implemented
const ratingSchema = new Schema({
  ratedBy: { type: Schema.Types.ObjectId, ref: 'User'},
  targetType: { type: String , enum: ['contractor', 'labour_worker', 'equipment'] },
  targetId: { type: Schema.Types.ObjectId, refPath: 'targetType' },  // what is  refPath
  rating: { type: Number },
  ratingDate: { type: Date},
  review: { type: String }
});

const Ratings = mongoose.model('Ratings', ratingSchema);
export default   Ratings;
