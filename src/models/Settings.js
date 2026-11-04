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
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

