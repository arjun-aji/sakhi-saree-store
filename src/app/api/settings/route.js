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

const DEFAULT_FEATURE_TILES = [
  {
    icon: 'truck',
    title: 'Free Shipping',
    shortTitle: 'Free Shipping',
    description: 'On orders above ₹999 / Pan-India',
    active: true
  },
  {
    icon: 'package',
    title: 'Easy Returns',
    shortTitle: 'Easy Returns',
    description: 'Hassle free return policy',
    active: true
  },
  {
    icon: 'shield',
    title: 'Secure Payment',
    shortTitle: '100% Secure',
    description: '100% secure transactions',
    active: true
  },
  {
    icon: 'headphones',
    title: 'Customer Support',
    shortTitle: '24/7 Support',
    description: "We're here to help you",
    active: true
  }
];

const DEFAULT_CONTACT_INFO = {
  phone: '+91 97465 98789',
  email: 'sakhibymayas@gmail.com',
  address: "Sakhi By Maya's\nKochi, Kerala, India - 682001",
  headline: "We'd Love to Hear from You!",
  subtitle: "Have a question, need styling advice, or just want to say hello? We're here for you.",
  stylingNote: "Looking for custom saree consultations or bridal styling? Drop us a message or call us directly.",
  whatsappNumber: '919746598789',
  instagramUrl: 'https://instagram.com',
  facebookUrl: 'https://facebook.com',
  pinterestUrl: 'https://pinterest.com'
};

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne({ key: 'global_settings' }).lean();

    if (!settings) {
      const created = await Settings.create({
        key: 'global_settings',
        shippingRates: DEFAULT_SHIPPING,
        announcements: DEFAULT_ANNOUNCEMENTS,
        featureTiles: DEFAULT_FEATURE_TILES,
        contactInfo: DEFAULT_CONTACT_INFO
      });
      settings = created.toObject ? created.toObject() : created;
    } else {
      let needsUpdate = false;
      const updates = {};
      if (!settings.announcements || !Array.isArray(settings.announcements.items) || settings.announcements.items.length === 0) {
        updates.announcements = DEFAULT_ANNOUNCEMENTS;
        settings.announcements = DEFAULT_ANNOUNCEMENTS;
        needsUpdate = true;
      }
      if (!settings.featureTiles || !Array.isArray(settings.featureTiles) || settings.featureTiles.length === 0) {
        updates.featureTiles = DEFAULT_FEATURE_TILES;
        settings.featureTiles = DEFAULT_FEATURE_TILES;
        needsUpdate = true;
      }
      if (!settings.contactInfo || !settings.contactInfo.email) {
        settings.contactInfo = { ...DEFAULT_CONTACT_INFO, ...(settings.contactInfo || {}) };
        updates.contactInfo = settings.contactInfo;
        needsUpdate = true;
      }
      if (needsUpdate) {
        await Settings.updateOne({ key: 'global_settings' }, { $set: updates }, { strict: false });
      }
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
          announcements: DEFAULT_ANNOUNCEMENTS,
          featureTiles: DEFAULT_FEATURE_TILES,
          contactInfo: DEFAULT_CONTACT_INFO
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

    if (body.featureTiles) {
      updateFields.featureTiles = Array.isArray(body.featureTiles)
        ? body.featureTiles.map(tile => ({
            icon: String(tile.icon || 'truck'),
            title: String(tile.title || '').trim(),
            shortTitle: String(tile.shortTitle || tile.title || '').trim(),
            description: String(tile.description || '').trim(),
            active: tile.active !== undefined ? Boolean(tile.active) : true
          }))
        : DEFAULT_FEATURE_TILES;
    }

    if (body.contactInfo) {
      updateFields.contactInfo = {
        phone: String(body.contactInfo.phone || DEFAULT_CONTACT_INFO.phone).trim(),
        email: String(body.contactInfo.email || DEFAULT_CONTACT_INFO.email).trim(),
        address: String(body.contactInfo.address || DEFAULT_CONTACT_INFO.address).trim(),
        headline: String(body.contactInfo.headline || DEFAULT_CONTACT_INFO.headline).trim(),
        subtitle: String(body.contactInfo.subtitle || DEFAULT_CONTACT_INFO.subtitle).trim(),
        stylingNote: String(body.contactInfo.stylingNote || DEFAULT_CONTACT_INFO.stylingNote).trim(),
        whatsappNumber: String(body.contactInfo.whatsappNumber || DEFAULT_CONTACT_INFO.whatsappNumber).trim(),
        instagramUrl: String(body.contactInfo.instagramUrl || DEFAULT_CONTACT_INFO.instagramUrl).trim(),
        facebookUrl: String(body.contactInfo.facebookUrl || DEFAULT_CONTACT_INFO.facebookUrl).trim(),
        pinterestUrl: String(body.contactInfo.pinterestUrl || DEFAULT_CONTACT_INFO.pinterestUrl).trim()
      };
    }

    const updated = await Settings.findOneAndUpdate(
      { key: 'global_settings' },
      { $set: updateFields },
      { upsert: true, new: true, strict: false }
    ).lean();

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
