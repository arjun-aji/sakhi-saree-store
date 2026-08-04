import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import FilterConfig from '@/models/FilterConfig';

export const dynamic = 'force-dynamic';

const DEFAULT_FILTERS = {
  categories: [
    { label: 'All Sarees', value: 'All' },
    { label: 'Silk Sarees', value: 'Silk Sarees' },
    { label: 'Kanjivaram', value: 'Kanjivaram' },
    { label: 'Banarasi', value: 'Banarasi' },
    { label: 'Cotton Sarees', value: 'Cotton Sarees' },
    { label: 'Tussar Sarees', value: 'Tussar Sarees' }
  ],
  fabrics: [
    { label: 'Silk', value: 'Silk' },
    { label: 'Kanjivaram Silk', value: 'Kanjivaram Silk' },
    { label: 'Banarasi Silk', value: 'Banarasi Silk' },
    { label: 'Cotton', value: 'Cotton' },
    { label: 'Tussar', value: 'Tussar' }
  ],
  colors: [
    { name: 'Red', hex: '#B84D28', border: false },
    { name: 'Purple', hex: '#4A154B', border: false },
    { name: 'Green', hex: '#1E5631', border: false },
    { name: 'Blue', hex: '#1B365D', border: false },
    { name: 'Yellow', hex: '#D4AF37', border: false },
    { name: 'Pink', hex: '#E8A598', border: false },
    { name: 'Cream', hex: '#F5ECE4', border: true },
    { name: 'Black', hex: '#6A2B15', border: false }
  ]
};

// GET current dynamic filter options
export async function GET() {
  try {
    await connectDB();
    let config = await FilterConfig.findOne({});
    if (!config) {
      // Return defaults if not seeded yet
      return NextResponse.json({ success: true, ...DEFAULT_FILTERS });
    }
    return NextResponse.json({ 
      success: true, 
      categories: config.categories,
      fabrics: config.fabrics,
      colors: config.colors
    });
  } catch (error) {
    console.error('GET Filter Config Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST update dynamic filter options
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { categories, fabrics, colors } = data;

    if (!categories || !fabrics || !colors) {
      return NextResponse.json({ success: false, error: 'Missing filter configurations' }, { status: 400 });
    }

    let config = await FilterConfig.findOne({});
    if (config) {
      config.categories = categories;
      config.fabrics = fabrics;
      config.colors = colors;
      await config.save();
    } else {
      config = await FilterConfig.create({ categories, fabrics, colors });
    }

    return NextResponse.json({ success: true, message: 'Filter settings updated successfully', config });
  } catch (error) {
    console.error('POST Filter Config Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
