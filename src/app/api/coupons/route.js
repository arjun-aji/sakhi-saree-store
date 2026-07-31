import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';

export const dynamic = 'force-dynamic';

// GET all coupons
export async function GET() {
  try {
    await connectDB();
    const coupons = await Coupon.find({}).sort({ expiryDate: 1 });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('GET Coupons Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create or update coupon
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, code, discountType, discountValue, expiryDate, active } = data;

    if (!code || !discountValue || !expiryDate) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (_id) {
      const updated = await Coupon.findByIdAndUpdate(
        _id,
        { code: code.toUpperCase(), discountType, discountValue, expiryDate, active },
        { new: true }
      );
      return NextResponse.json({ success: true, coupon: updated });
    } else {
      const created = await Coupon.create({
        code: code.toUpperCase(), discountType, discountValue, expiryDate, active
      });
      return NextResponse.json({ success: true, coupon: created });
    }
  } catch (error) {
    console.error('POST Coupon Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE coupon
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing coupon ID' }, { status: 400 });
    }

    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('DELETE Coupon Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
