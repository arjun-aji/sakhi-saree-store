import mongoose from 'mongoose';

const HeroSlideSchema = new mongoose.Schema({
  desktop: { type: String, required: true },
  mobile: { type: String, required: true },
  alt: { type: String, default: 'Sakhi Handcrafted Saree Collection' },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  link: { type: String, default: '/shop' },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.HeroSlide || mongoose.model('HeroSlide', HeroSlideSchema);

