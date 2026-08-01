import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';

export const dynamic = 'force-dynamic';

// GET all customers
export async function GET() {
  try {
    await connectDB();
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error('GET Customers Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create or update customer
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { name, email, phone, address, city, state, pincode } = data;

    if (!name || !email) {
      return NextResponse.json({ success: false, error: 'Missing name or email' }, { status: 400 });
    }

    const customer = await Customer.findOneAndUpdate(
      { email: email.toLowerCase() },
      { name, phone, address, city, state, pincode },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error('POST Customer Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
