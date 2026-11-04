import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  pincode: { type: String, required: true },
  addressType: { type: String, default: 'Home' }, // 'Home', 'Work', 'Other'
  isDefault: { type: Boolean, default: false },
}, { _id: false });

const CustomerSchema = new mongoose.Schema({
  customerId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  state: { type: String },
  pincode: { type: String },
  savedAddresses: { type: [AddressSchema], default: [] },
  createdAt: { type: Date, default: Date.now }
});

if (mongoose.models && mongoose.models.Customer) {
  delete mongoose.models.Customer;
}

export default mongoose.model('Customer', CustomerSchema);
