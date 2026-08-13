import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Review from '@/models/Review';
import Coupon from '@/models/Coupon';
import Blog from '@/models/Blog';
import FAQ from '@/models/FAQ';
import FilterConfig from '@/models/FilterConfig';
import Customer from '@/models/Customer';
import Contact from '@/models/Contact';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await connectDB();

    // Delete all records from all collections
    const productRes = await Product.deleteMany({});
    const orderRes = await Order.deleteMany({});
    const reviewRes = await Review.deleteMany({});
    const couponRes = await Coupon.deleteMany({});
    const blogRes = await Blog.deleteMany({});
    const faqRes = await FAQ.deleteMany({});
    const filterConfigRes = await FilterConfig.deleteMany({});
    const customerRes = await Customer.deleteMany({});
    const contactRes = await Contact.deleteMany({});

    console.log('Database cleared successfully:', {
      products: productRes.deletedCount,
      orders: orderRes.deletedCount,
      reviews: reviewRes.deletedCount,
      coupons: couponRes.deletedCount,
      blogs: blogRes.deletedCount,
      faqs: faqRes.deletedCount,
      filterConfigs: filterConfigRes.deletedCount,
      customers: customerRes.deletedCount,
      contacts: contactRes.deletedCount,
    });

    return NextResponse.json({
      success: true,
      message: 'All dummy and store data cleared successfully from the database'
    });
  } catch (error) {
    console.error('Clear DB Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Clearing failed' },
      { status: 500 }
    );
  }
}
