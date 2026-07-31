import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

export const dynamic = 'force-dynamic';

// GET all contact submissions
export async function GET() {
  try {
    await connectDB();
    const messages = await Contact.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error('GET Contact Messages Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE a contact submission
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing message ID' }, { status: 400 });
    }

    const deleted = await Contact.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Message deleted successfully' });
  } catch (error) {
    console.error('DELETE Contact Message Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
