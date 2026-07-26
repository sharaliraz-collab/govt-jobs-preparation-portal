import mongoose, { Schema, model, models } from 'mongoose';

const formDocSchema = new Schema(
  {
    titleEn: { type: String, required: true, trim: true },
    titleUr: { type: String, required: true, trim: true },
    descriptionEn: { type: String },
    descriptionUr: { type: String },
    category: {
      type: String,
      enum: ['General', 'Admission', 'Scholarship', 'Verification', 'Application'],
      default: 'General'
    },
    file: { type: String, default: '' },
    relatedTo: { type: String },
    downloadCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const FormDoc = (models.FormDoc || model('FormDoc', formDocSchema)) as mongoose.Model<any>;
export default FormDoc;
