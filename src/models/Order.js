import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  shippingAddress: {
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
  },
  items: [{
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  shippingFee: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    default: 'Processing', 
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] 
  },
  paymentStatus: {
    type: String,
    default: 'Paid',
    enum: ['Pending', 'Paid', 'Failed']
  },
  paymentId: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  courierPartner: { type: String, default: '' },
  trackingId: { type: String, default: '' },
  trackingUrl: { type: String, default: '' },
  shippedAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
