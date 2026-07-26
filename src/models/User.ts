import mongoose, { Schema, model, models } from 'mongoose';

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }]
  },
  { timestamps: true }
);

const User = (models.User || model('User', userSchema)) as mongoose.Model<any>;
export default User;
