import mongoose, { Schema, model, models } from 'mongoose';

const employeePostSchema = new Schema(
  {
    titleEn: { type: String, required: true, trim: true },
    titleUr: { type: String, trim: true },
    tab: {
      type: String,
      enum: ['notifications', 'fo1', 'fo2', 'fo3', 'forms', 'subsidies'],
      default: 'notifications',
    },
    bodyEn: { type: String },
    bodyUr: { type: String },
    fileUrl: { type: String },
    coverImage: { type: String },
    pinned: { type: Boolean, default: false },
    publishedAt: { type: Date, default: Date.now },
    author: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const EmployeePost = (models.EmployeePost || model('EmployeePost', employeePostSchema)) as mongoose.Model<any>;
export default EmployeePost;
