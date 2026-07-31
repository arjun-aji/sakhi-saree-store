import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Since Next.js has hot reloading, we need to check if the model has already been compiled
export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
