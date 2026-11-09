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
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

