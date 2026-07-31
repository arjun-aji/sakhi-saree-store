import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String },
  author: { type: String, default: 'Admin' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
