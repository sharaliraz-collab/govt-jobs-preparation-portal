import mongoose, { Schema, model, models } from 'mongoose';

const quizSchema = new Schema(
  {
    titleEn: { type: String, required: true, trim: true },
    titleUr: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    timeLimitMinutes: { type: Number, default: 15 },
    passPercentage: { type: Number, default: 50 }
  },
  { timestamps: true }
);

const Quiz = (models.Quiz || model('Quiz', quizSchema)) as mongoose.Model<any>;
export default Quiz;
