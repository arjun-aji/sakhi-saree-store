import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Blog from '@/models/Blog';

export const dynamic = 'force-dynamic';

// GET all blogs
export async function GET() {
  try {
    await connectDB();
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, blogs });
  } catch (error) {
    console.error('GET Blogs Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create or update blog
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, title, summary, content, image, author } = data;

    if (!title || !summary || !content) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    if (_id) {
      const updated = await Blog.findByIdAndUpdate(
        _id,
        { title, summary, content, image, author },
        { new: true }
      );
      return NextResponse.json({ success: true, blog: updated });
    } else {
      const created = await Blog.create({
        title, summary, content, image, author
      });
      return NextResponse.json({ success: true, blog: created });
    }
  } catch (error) {
    console.error('POST Blog Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE blog
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing blog ID' }, { status: 400 });
    }

    await Blog.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('DELETE Blog Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
