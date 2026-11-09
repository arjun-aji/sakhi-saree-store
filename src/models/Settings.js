import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'global_settings', unique: true },
  shippingRates: {
    keralaLocal: { type: Number, default: 49 },
    panIndiaStandard: { type: Number, default: 49 },
    international: { type: Number, default: 1500 },
    freeShippingThreshold: { type: Number, default: 0 },
    enableFreeShipping: { type: Boolean, default: false }
  },
  announcements: {
    enabled: { type: Boolean, default: true },
    items: [
      {
        text: { type: String, default: '' },
        icon: { type: String, default: 'truck' },
        link: { type: String, default: '' },
        active: { type: Boolean, default: true }
      }
    ]
  },
  featureTiles: [
    {
      icon: { type: String, default: 'truck' },
      title: { type: String, default: 'Free Shipping' },
      shortTitle: { type: String, default: 'Free Shipping' },
      description: { type: String, default: 'Pan-India Delivery' },
      active: { type: Boolean, default: true }
    }
  ],
  contactInfo: {
    phone: { type: String, default: '+91 97465 98789' },
    email: { type: String, default: 'sakhibymayas@gmail.com' },
    address: { type: String, default: "Sakhi By Maya's\nKochi, Kerala, India - 682001" },
    headline: { type: String, default: "We'd Love to Hear from You!" },
    subtitle: { type: String, default: "Have a question, need styling advice, or just want to say hello? We're here for you." },
    stylingNote: { type: String, default: "Looking for custom saree consultations or bridal styling? Drop us a message or call us directly." },
    whatsappNumber: { type: String, default: '919746598789' },
    instagramUrl: { type: String, default: 'https://instagram.com' },
    facebookUrl: { type: String, default: 'https://facebook.com' },
    pinterestUrl: { type: String, default: 'https://pinterest.com' }
  },
  updatedAt: { type: Date, default: Date.now }
}, {
  strict: false
});

// Always purge cached model in development to ensure new schema fields (like contactInfo) are recognized
if (mongoose.models && mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export default mongoose.model('Settings', SettingsSchema);

