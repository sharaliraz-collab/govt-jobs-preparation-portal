import mongoose, { Schema, model, models } from 'mongoose';

const newsSchema = new Schema(
  {
    titleEn: { type: String, required: true, trim: true },
    titleUr: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Result', 'Notification', 'Deadline Extension', 'General'],
      default: 'General'
    },
    bodyEn: { type: String, required: true },
    bodyUr: { type: String, required: true },
    pinned: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    coverImage: { type: String }
  },
  { timestamps: true }
);

const News = (models.News || model('News', newsSchema)) as mongoose.Model<any>;
export default News;
