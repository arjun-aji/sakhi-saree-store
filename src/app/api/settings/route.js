import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await Settings.create({
        key: 'global_settings',
        shippingRates: {
          keralaLocal: 49,
          panIndiaStandard: 49,
          international: 1500,
          freeShippingThreshold: 0,
          enableFreeShipping: false
        }
      });
    }
    return NextResponse.json(
      { success: true, settings },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error) {
    console.error('GET Settings Error:', error);
    return NextResponse.json(
      {
        success: true,
        settings: {
          shippingRates: {
            keralaLocal: 49,
            panIndiaStandard: 49,
            international: 1500,
            freeShippingThreshold: 0,
            enableFreeShipping: false
          }
        }
      },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { shippingRates } = body;

    const updated = await Settings.findOneAndUpdate(
      { key: 'global_settings' },
      {
        $set: {
          shippingRates: {
            keralaLocal: Number(shippingRates?.keralaLocal ?? 49),
            panIndiaStandard: Number(shippingRates?.panIndiaStandard ?? 49),
            international: Number(shippingRates?.international ?? 1500),
            freeShippingThreshold: Number(shippingRates?.freeShippingThreshold ?? 0),
            enableFreeShipping: Boolean(shippingRates?.enableFreeShipping)
          },
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(
      { success: true, settings: updated },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error) {
    console.error('POST Settings Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export const PUT = POST;
