import mongoose from 'mongoose';

const FilterConfigSchema = new mongoose.Schema({
  categories: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }],
  fabrics: [{
    label: { type: String, required: true },
    value: { type: String, required: true }
  }],
  colors: [{
    name: { type: String, required: true },
    hex: { type: String, required: true },
    border: { type: Boolean, default: false }
  }]
});

export default mongoose.models.FilterConfig || mongoose.model('FilterConfig', FilterConfigSchema);
