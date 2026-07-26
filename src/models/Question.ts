import mongoose, { Schema, model, models } from 'mongoose';

const questionSchema = new Schema(
  {
    textEn: { type: String, required: true },
    textUr: { type: String, required: true },
    optionsEn: [{ type: String, required: true }],
    optionsUr: [{ type: String, required: true }],
    correctIndex: { type: Number, required: true },
    subject: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    explanationEn: { type: String },
    explanationUr: { type: String }
  },
  { timestamps: true }
);

const Question = (models.Question || model('Question', questionSchema)) as mongoose.Model<any>;
export default Question;
