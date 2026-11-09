import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subtitle: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  order: { type: Number, default: 1 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);

