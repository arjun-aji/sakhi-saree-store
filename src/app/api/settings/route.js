import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Settings from '@/models/Settings';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_SHIPPING = {
  keralaLocal: 49,
  panIndiaStandard: 49,
  international: 1500,
  freeShippingThreshold: 0,
  enableFreeShipping: false
};

const DEFAULT_ANNOUNCEMENTS = {
  enabled: true,
  items: [
    { text: 'Pan-India Shipping at ₹49 | Free Shipping Above ₹999', icon: 'truck', link: '', active: true },
    { text: 'Cash on Delivery (COD) Available', icon: 'shield', link: '', active: true },
    { text: '10% Off On First Order | Use Code: SAKHI10', icon: 'tag', link: '/shop', active: true }
  ]
};

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne({ key: 'global_settings' });
    if (!settings) {
      settings = await Settings.create({
        key: 'global_settings',
        shippingRates: DEFAULT_SHIPPING,
        announcements: DEFAULT_ANNOUNCEMENTS
      });
    } else if (!settings.announcements || !Array.isArray(settings.announcements.items) || settings.announcements.items.length === 0) {
      // Auto-populate default announcements if not configured yet
      settings.announcements = DEFAULT_ANNOUNCEMENTS;
      await settings.save();
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
          shippingRates: DEFAULT_SHIPPING,
          announcements: DEFAULT_ANNOUNCEMENTS
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
    const updateFields = { updatedAt: new Date() };

    if (body.shippingRates) {
      updateFields.shippingRates = {
        keralaLocal: Number(body.shippingRates?.keralaLocal ?? 49),
        panIndiaStandard: Number(body.shippingRates?.panIndiaStandard ?? 49),
        international: Number(body.shippingRates?.international ?? 1500),
        freeShippingThreshold: Number(body.shippingRates?.freeShippingThreshold ?? 0),
        enableFreeShipping: Boolean(body.shippingRates?.enableFreeShipping)
      };
    }

    if (body.announcements) {
      updateFields.announcements = {
        enabled: body.announcements.enabled !== undefined ? Boolean(body.announcements.enabled) : true,
        items: Array.isArray(body.announcements.items)
          ? body.announcements.items.map(item => ({
              text: String(item.text || '').trim(),
              icon: String(item.icon || 'truck'),
              link: String(item.link || '').trim(),
              active: item.active !== undefined ? Boolean(item.active) : true
            }))
          : DEFAULT_ANNOUNCEMENTS.items
      };
    }

    const updated = await Settings.findOneAndUpdate(
      { key: 'global_settings' },
      { $set: updateFields },
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
