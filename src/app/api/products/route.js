import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// GET all products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, products });
  } catch (error) {
    console.error('GET Products Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create or update product
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { _id, name, image, price, originalPrice, badge, isNew, isBestSeller, category, fabric, color, stock, description, images, gridImage } = data;

    if (!name || !image || !price || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    if (_id) {
      // Update
      const updatedProduct = await Product.findByIdAndUpdate(
        _id,
        { name, image, price, originalPrice, badge, isNew, isBestSeller, category, fabric, color, slug, stock, description, images, gridImage },
        { new: true, runValidators: true }
      );
      if (!updatedProduct) {
        return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, product: updatedProduct });
    } else {
      // Create
      const newProduct = await Product.create({
        name, image, price, originalPrice, badge, isNew, isBestSeller, category, fabric, color, slug, stock, description, images, gridImage
      });
      return NextResponse.json({ success: true, product: newProduct });
    }
  } catch (error) {
    console.error('POST Product Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing product ID' }, { status: 400 });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('DELETE Product Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
