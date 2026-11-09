import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import HeroSlide from '@/models/HeroSlide';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_SLIDES = [
  {
    desktop: '/assets/desktop/herodesk.jpeg',
    mobile: '/assets/mobile/heromob.jpeg',
    alt: 'Classic Heritage Collection',
    title: 'Classic Heritage Collection',
    subtitle: 'Handpicked sarees that celebrate grace and timeless beauty',
    link: '/shop',
    order: 1,
    active: true
  },
  {
    desktop: '/assets/desktop/herodesk.png',
    mobile: '/assets/mobile/heromob.png',
    alt: 'New Luxury Handloom Collection',
    title: 'New Luxury Handloom Collection',
    subtitle: 'Exclusive festival and wedding weaves',
    link: '/shop',
    order: 2,
    active: true
  }
];

// GET: fetch slides (active-only for store, all for admin)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const getAll = searchParams.get('all') === 'true';

    let slides = await HeroSlide.find(getAll ? {} : { active: true }).sort({ order: 1, createdAt: 1 });

    // Seed defaults if database has zero slides
    if (!slides || slides.length === 0) {
      const count = await HeroSlide.countDocuments();
      if (count === 0) {
        await HeroSlide.insertMany(DEFAULT_SLIDES);
        slides = await HeroSlide.find(getAll ? {} : { active: true }).sort({ order: 1, createdAt: 1 });
      }
    }

    return NextResponse.json(
      { success: true, slides },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error) {
    console.error('GET HeroSlides Error:', error);
    return NextResponse.json(
      { success: false, error: error.message, slides: DEFAULT_SLIDES },
      { status: 500, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  }
}

// POST: create or update slide
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, desktop, mobile, alt, title, subtitle, link, order, active } = data;

    if (!desktop || !mobile) {
      return NextResponse.json(
        { success: false, error: 'Both Desktop and Mobile image URLs are required' },
        { status: 400 }
      );
    }

    if (_id) {
      const updated = await HeroSlide.findByIdAndUpdate(
        _id,
        {
          desktop,
          mobile,
          alt: alt || 'Sakhi Collection',
          title: title || '',
          subtitle: subtitle || '',
          link: link || '/shop',
          order: Number(order) || 0,
          active: active !== undefined ? Boolean(active) : true
        },
        { new: true }
      );
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Slide not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, slide: updated });
    } else {
      const created = await HeroSlide.create({
        desktop,
        mobile,
        alt: alt || 'Sakhi Collection',
        title: title || '',
        subtitle: subtitle || '',
        link: link || '/shop',
        order: Number(order) || 0,
        active: active !== undefined ? Boolean(active) : true
      });
      return NextResponse.json({ success: true, slide: created });
    }
  } catch (error) {
    console.error('POST HeroSlide Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE: remove a slide
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing slide ID' }, { status: 400 });
    }

    const deleted = await HeroSlide.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Slide deleted successfully' });
  } catch (error) {
    console.error('DELETE HeroSlide Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

