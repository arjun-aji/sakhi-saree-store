import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, default: 'Percentage', enum: ['Percentage', 'Fixed', 'Flat'] },
  discountValue: { type: Number, required: true },
  minOrderAmount: { type: Number, default: 0 }, // e.g. orders above 1499
  maxDiscount: { type: Number, default: 0 },    // optional cap for percentage
  expiryDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
  targetType: { 
    type: String, 
    default: 'all', 
    enum: ['all', 'specific', 'min_spent'] 
  },
  minCustomerSpent: { type: Number, default: 0 }, // for high-purchase patrons
  assignedTo: [{ type: String, lowercase: true, trim: true }], // specific customer emails
  usedBy: [{ type: String, lowercase: true, trim: true }],     // customer emails who already used it (single-use)
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models && mongoose.models.Coupon) {
  delete mongoose.models.Coupon;
}

export default mongoose.model('Coupon', CouponSchema);
