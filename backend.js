import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

// 1. Initialize Express
const app = express();
app.use(cors());
app.use(express.json());

// 2. Load Environment Variables from .env.local
try {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }
} catch (err) {
  console.error('Failed to parse .env.local:', err);
}

const MONGO_URI = process.env.MONGODB_URI;

// 3. Connect to MongoDB
if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected Successfully (Express Standalone Backend)'))
    .catch(err => console.error('MongoDB Connection Error:', err));
} else {
  console.error('MONGODB_URI is missing in .env.local');
}

// 4. Mongoose Schemas & Models
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: Number,
  badge: String,
  isNew: Boolean,
  isBestSeller: Boolean,
  category: { type: String, required: true },
  fabric: String,
  color: String,
  slug: String,
  stock: Number,
  description: String,
  images: [String],
  gridImage: String,
}, { timestamps: true });

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: String,
    }
  ],
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

const FilterConfigSchema = new mongoose.Schema({
  categories: [{ label: String, value: String }],
  fabrics: [{ label: String, value: String }],
  colors: [{ name: String, hex: String, border: Boolean }],
});

const ReviewSchema = new mongoose.Schema({
  productName: { type: String, required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, required: true },
  status: { type: String, default: 'Pending' },
}, { timestamps: true });

const BlogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  content: { type: String, required: true },
  image: String,
  author: String,
}, { timestamps: true });

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: String,
});

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
}, { timestamps: true });

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
const FilterConfig = mongoose.models.FilterConfig || mongoose.model('FilterConfig', FilterConfigSchema);
const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
const Blog = mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
const FAQ = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);
const ContactMessage = mongoose.models.ContactMessage || mongoose.model('ContactMessage', ContactMessageSchema);
const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);

// Customers Endpoints
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/customers', async (req, res) => {
  try {
    const { name, email, phone, address, city, state, pincode } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, error: 'Missing name or email' });
    }
    const customer = await Customer.findOneAndUpdate(
      { email: email.toLowerCase() },
      { name, phone, address, city, state, pincode },
      { new: true, upsert: true }
    );
    res.json({ success: true, customer });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. REST API Endpoints

// Products Endpoints
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const newProduct = await Product.create(req.body);
    res.status(201).json({ success: true, product: newProduct });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Filter Config Endpoint
app.get('/api/filter-config', async (req, res) => {
  try {
    const config = await FilterConfig.findOne({});
    res.json({
      success: true,
      categories: config?.categories || [],
      fabrics: config?.fabrics || [],
      colors: config?.colors || [],
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Orders Endpoints
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, customerEmail, items, totalAmount } = req.body;
    if (!customerName || !customerEmail || !items || !totalAmount) {
      return res.status(400).json({ success: false, error: 'Missing required order details' });
    }
    const orderNumber = `SK-${Date.now().toString().slice(-6)}`;
    const newOrder = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      items,
      totalAmount,
      status: 'Pending',
    });
    res.status(201).json({ success: true, order: newOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put('/api/orders', async (req, res) => {
  try {
    const { id, status } = req.body;
    if (!id || !status) {
      return res.status(400).json({ success: false, error: 'Missing ID or status' });
    }
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedOrder) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    res.json({ success: true, order: updatedOrder });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Contact Messages Endpoints
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Missing contact message fields' });
    }
    const newMessage = await ContactMessage.create({ name, email, message });
    res.status(201).json({ success: true, message: 'Message submitted successfully', data: newMessage });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/contact-messages', async (req, res) => {
  try {
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Blogs Endpoints
app.get('/api/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// FAQs Endpoints
app.get('/api/faqs', async (req, res) => {
  try {
    const faqs = await FAQ.find({});
    res.json({ success: true, faqs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Reviews Endpoints
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reviews', async (req, res) => {
  try {
    const newReview = await Review.create(req.body);
    res.status(201).json({ success: true, review: newReview });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Express Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend Server listening at port ${PORT}`);
});
