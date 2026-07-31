import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

// GET all orders
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('GET Orders Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update order status
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { id, status } = data;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing ID or status' }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('PUT Order Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
