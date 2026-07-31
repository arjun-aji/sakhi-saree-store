import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Review from '@/models/Review';

export const dynamic = 'force-dynamic';

// GET all reviews
export async function GET() {
  try {
    await connectDB();
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error('GET Reviews Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update review status (Approve/Reject)
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { id, status } = data; // status is 'Approved' or 'Rejected'

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'Missing ID or status' }, { status: 400 });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedReview) {
      return NextResponse.json({ success: false, error: 'Review not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    console.error('PUT Review Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
