import mongoose, { Schema, model, models } from 'mongoose';

const quizAttemptSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    percentage: { type: Number, required: true },
    passed: { type: Boolean, required: true },
    answers: [
      {
        question: { type: Schema.Types.ObjectId, ref: 'Question' },
        selectedIndex: { type: Number, required: true },
        isCorrect: { type: Boolean, required: true }
      }
    ],
    attemptedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const QuizAttempt = (models.QuizAttempt || model('QuizAttempt', quizAttemptSchema)) as mongoose.Model<any>;
export default QuizAttempt;
