import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';

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
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    console.error('GET Settings Error:', error);
    return NextResponse.json({
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
    });
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
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error('POST Settings Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

