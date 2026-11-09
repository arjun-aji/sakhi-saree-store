import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Category from '@/models/Category';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_CATEGORIES = [
  {
    name: 'Sarees',
    slug: 'sarees',
    subtitle: 'Heritage Handloom Weaves',
    description: 'Authentic Banarasi, Kanjivaram, Kasavu, and fine handloom sarees.',
    image: '/assets/desktop/herodesk.jpeg',
    order: 1,
    active: true
  },
  {
    name: 'Churidars',
    slug: 'churidars',
    subtitle: 'Salwars, Anarkalis & Sets',
    description: 'Designer churidar materials, readymade suits, and festive salwar sets.',
    image: '/assets/desktop/herodesk.png',
    order: 2,
    active: true
  },
  {
    name: 'Women Dresses',
    slug: 'women-dresses',
    subtitle: 'Kurtis, Gowns & Maxis',
    description: 'Contemporary western and ethnic fusion dresses, kurtis, and gowns.',
    image: '/assets/about/story_tradition.jpg',
    order: 3,
    active: true
  }
];

// GET categories
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const showAll = searchParams.get('all') === 'true';

    let count = await Category.countDocuments();
    if (count === 0) {
      try {
        await Category.insertMany(DEFAULT_CATEGORIES);
      } catch (seedErr) {
        console.warn('Auto-seed categories notice:', seedErr.message);
      }
    }

    const filter = showAll ? {} : { active: true };
    const rawCategories = await Category.find(filter).sort({ order: 1, createdAt: 1 });

    // Deduplicate categories by normalized name/slug to prevent duplicate cards
    const uniqueCategories = [];
    const seenNames = new Set();
    const duplicateIds = [];

    for (const cat of rawCategories) {
      const normalized = (cat.name || '').trim().toLowerCase();
      if (!normalized) continue;
      if (!seenNames.has(normalized)) {
        seenNames.add(normalized);
        uniqueCategories.push(cat);
      } else if (cat._id) {
        duplicateIds.push(cat._id);
      }
    }

    // Auto-clean any duplicate records from MongoDB in the background
    if (duplicateIds.length > 0) {
      Category.deleteMany({ _id: { $in: duplicateIds } }).catch(err => {
        console.warn('Auto-cleanup duplicate categories warning:', err.message);
      });
    }

    return NextResponse.json(
      { success: true, categories: uniqueCategories },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error) {
    console.error('GET Categories Error:', error);
    return NextResponse.json(
      { success: true, categories: DEFAULT_CATEGORIES },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  }
}

// POST create or update category
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { _id, name, slug, subtitle, description, image, order, active } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const generatedSlug = slug
      ? slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (_id) {
      const updated = await Category.findByIdAndUpdate(
        _id,
        {
          name: name.trim(),
          slug: generatedSlug,
          subtitle: subtitle || '',
          description: description || '',
          image: image || '',
          order: Number(order) || 1,
          active: active !== undefined ? Boolean(active) : true
        },
        { new: true, runValidators: true }
      );
      return NextResponse.json({ success: true, category: updated });
    } else {
      const created = await Category.create({
        name: name.trim(),
        slug: generatedSlug,
        subtitle: subtitle || '',
        description: description || '',
        image: image || '',
        order: Number(order) || 1,
        active: active !== undefined ? Boolean(active) : true
      });
      return NextResponse.json({ success: true, category: created });
    }
  } catch (error) {
    console.error('POST Category Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE category
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Category ID required' }, { status: 400 });
    }

    await Category.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    console.error('DELETE Category Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

