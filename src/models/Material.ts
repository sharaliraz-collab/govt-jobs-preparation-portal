import mongoose, { Schema, model, models } from 'mongoose';

const materialSchema = new Schema(
  {
    titleEn: { type: String, required: true, trim: true },
    titleUr: { type: String, required: true, trim: true },
    subject: { type: String, required: true },
    descriptionEn: { type: String },
    descriptionUr: { type: String },
    file: { type: String, default: '' },
    relatedCategory: { type: String },
    downloadCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

const Material = (models.Material || model('Material', materialSchema)) as mongoose.Model<any>;
export default Material;
