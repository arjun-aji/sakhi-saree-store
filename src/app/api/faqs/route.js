import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FAQ from '@/models/FAQ';

export const dynamic = 'force-dynamic';

// GET all faqs
export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find({});
    return NextResponse.json({ success: true, faqs });
  } catch (error) {
    console.error('GET FAQs Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create or update faq
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, question, answer, category } = data;

    if (!question || !answer) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (_id) {
      const updated = await FAQ.findByIdAndUpdate(
        _id,
        { question, answer, category: category || 'General' },
        { new: true }
      );
      return NextResponse.json({ success: true, faq: updated });
    } else {
      const created = await FAQ.create({
        question, answer, category: category || 'General'
      });
      return NextResponse.json({ success: true, faq: created });
    }
  } catch (error) {
    console.error('POST FAQ Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE faq
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing FAQ ID' }, { status: 400 });
    }

    await FAQ.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (error) {
    console.error('DELETE FAQ Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
