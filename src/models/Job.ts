import mongoose, { Schema, model, models } from 'mongoose';

const jobSchema = new Schema(
  {
    titleEn: { type: String, required: true, trim: true },
    titleUr: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    descriptionEn: { type: String, required: true },
    descriptionUr: { type: String, required: true },
    location: { type: String, required: true, default: 'Islamabad' },
    category: { type: String, required: true, default: 'General' },
    qualification: { type: String, required: true },
    vacancies: { type: Number, required: true, default: 1 },
    deadline: { type: Date, required: true },
    source: { type: String },
    adFile: { type: String },
    status: {
      type: String,
      enum: ['open', 'closing_soon', 'closed'],
      default: 'open'
    },
    featured: { type: Boolean, default: false },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

const Job = (models.Job || model('Job', jobSchema)) as mongoose.Model<any>;
export default Job;
