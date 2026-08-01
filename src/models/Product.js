import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  badge: { type: String },
  isNew: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  category: { type: String, required: true },
  fabric: { type: String },
  color: { type: String },
  slug: { type: String, required: true, unique: true },
  stock: { type: Number, default: 10 },
  description: { type: String },
  images: [{ type: String }],
  gridImage: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
