import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountType: { type: String, default: 'Percentage', enum: ['Percentage', 'Fixed'] },
  discountValue: { type: Number, required: true },
  expiryDate: { type: Date, required: true },
  active: { type: Boolean, default: true }
});

export default mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
