import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Coupon from '@/models/Coupon';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

// GET coupons
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const hasCustomerEmail = searchParams.has('customerEmail');
    const customerEmail = searchParams.get('customerEmail');
    const forCustomer = searchParams.get('forCustomer') === 'true' || hasCustomerEmail;

    if (forCustomer) {
      const email = (customerEmail || '').toLowerCase().trim();
      const now = new Date();
      const allCoupons = await Coupon.find({ 
        active: true,
        expiryDate: { $gte: now }
      }).sort({ expiryDate: 1 });

      // Calculate customer's historical lifetime purchases for 'min_spent' rule
      let customerTotalSpent = 0;
      if (email) {
        try {
          const pastOrders = await Order.find({ 
            customerEmail: { $regex: new RegExp(`^${email}$`, 'i') },
            status: { $ne: 'Cancelled' }
          });
          customerTotalSpent = pastOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        } catch (err) {
          console.warn('Error calculating customer spend for coupons:', err);
        }
      }

      // Filter coupons that apply to this customer
      const customerCoupons = allCoupons.filter((c) => {
        if (c.targetType === 'all') return true;
        if (c.targetType === 'specific') {
          return email && Array.isArray(c.assignedTo) && c.assignedTo.includes(email);
        }
        if (c.targetType === 'min_spent') {
          return email && customerTotalSpent >= (c.minCustomerSpent || 0);
        }
        return false;
      }).map((c) => {
        const isUsed = email ? (Array.isArray(c.usedBy) && c.usedBy.includes(email)) : false;
        const isExpired = new Date(c.expiryDate) < now;
        return {
          _id: c._id,
          code: c.code,
          discountType: c.discountType,
          discountValue: c.discountValue,
          minOrderAmount: c.minOrderAmount || 0,
          maxDiscount: c.maxDiscount || 0,
          expiryDate: c.expiryDate,
          targetType: c.targetType,
          minCustomerSpent: c.minCustomerSpent || 0,
          description: c.description,
          isUsed,
          isExpired,
          canRedeem: !isUsed && !isExpired
        };
      });

      return NextResponse.json({ success: true, coupons: customerCoupons });
    }

    // Default: GET all coupons for admin
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch (error) {
    console.error('GET Coupons Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create or update coupon with rules
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const {
      _id,
      code,
      discountType,
      discountValue,
      minOrderAmount,
      maxDiscount,
      expiryDate,
      active,
      targetType,
      minCustomerSpent,
      assignedTo,
      description
    } = data;

    if (!code || !discountValue || !expiryDate) {
      return NextResponse.json({ success: false, error: 'Code, discount value, and expiry date are required' }, { status: 400 });
    }

    const cleanCode = code.trim().toUpperCase();
    let assignedArray = [];
    if (Array.isArray(assignedTo)) {
      assignedArray = assignedTo.map(e => e.trim().toLowerCase()).filter(Boolean);
    } else if (typeof assignedTo === 'string' && assignedTo.trim()) {
      assignedArray = assignedTo.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
    }

    const payload = {
      code: cleanCode,
      discountType: discountType || 'Percentage',
      discountValue: Number(discountValue),
      minOrderAmount: Number(minOrderAmount) || 0,
      maxDiscount: Number(maxDiscount) || 0,
      expiryDate: new Date(expiryDate),
      active: active !== undefined ? active : true,
      targetType: targetType || 'all',
      minCustomerSpent: Number(minCustomerSpent) || 0,
      assignedTo: assignedArray,
      description: description || ''
    };

    if (_id) {
      const updated = await Coupon.findByIdAndUpdate(_id, { $set: payload }, { new: true });
      return NextResponse.json({ success: true, coupon: updated });
    } else {
      // Check if duplicate code exists
      const existing = await Coupon.findOne({ code: cleanCode });
      if (existing) {
        return NextResponse.json({ success: false, error: `Coupon code '${cleanCode}' already exists.` }, { status: 400 });
      }
      const created = await Coupon.create(payload);
      return NextResponse.json({ success: true, coupon: created });
    }
  } catch (error) {
    console.error('POST Coupon Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT validate / verify coupon for redemption
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { code, customerEmail, subtotal } = data;

    if (!code) {
      return NextResponse.json({ success: false, error: 'Please enter a coupon code' }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.trim().toUpperCase(), active: true });
    if (!coupon) {
      return NextResponse.json({ success: false, error: 'Invalid or inactive coupon code.' }, { status: 400 });
    }

    // 1. Check expiration
    if (new Date(coupon.expiryDate) < new Date()) {
      return NextResponse.json({ success: false, error: 'This coupon code has expired.' }, { status: 400 });
    }

    const email = (customerEmail || '').trim().toLowerCase();

    // 2. Check single-use per customer
    if (email && Array.isArray(coupon.usedBy) && coupon.usedBy.includes(email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'You have already redeemed this coupon. It can only be used once per customer.' 
      }, { status: 400 });
    }

    // 3. Check audience targeting
    if (coupon.targetType === 'specific') {
      if (!email || !coupon.assignedTo.includes(email)) {
        return NextResponse.json({
          success: false,
          error: 'This exclusive coupon code is only available to selected patrons.'
        }, { status: 400 });
      }
    }

    if (coupon.targetType === 'min_spent' && coupon.minCustomerSpent > 0) {
      let spent = 0;
      if (email) {
        const pastOrders = await Order.find({ 
          customerEmail: { $regex: new RegExp(`^${email}$`, 'i') },
          status: { $ne: 'Cancelled' }
        });
        spent = pastOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
      }
      if (spent < coupon.minCustomerSpent) {
        return NextResponse.json({
          success: false,
          error: `This VIP coupon is reserved for patrons with lifetime purchases above ₹${coupon.minCustomerSpent.toLocaleString('en-IN')}.`
        }, { status: 400 });
      }
    }

    // 4. Check minimum order threshold
    const orderSubtotal = Number(subtotal) || 0;
    if (coupon.minOrderAmount > 0 && orderSubtotal < coupon.minOrderAmount) {
      return NextResponse.json({
        success: false,
        error: `Order amount must be at least ₹${coupon.minOrderAmount.toLocaleString('en-IN')} to apply coupon ${coupon.code}. (Add ₹${(coupon.minOrderAmount - orderSubtotal).toLocaleString('en-IN')} more to qualify)`
      }, { status: 400 });
    }

    // 5. Calculate discount
    let discount = 0;
    if (coupon.discountType === 'Percentage') {
      discount = Math.round(orderSubtotal * (coupon.discountValue / 100));
      if (coupon.maxDiscount > 0 && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, orderSubtotal);

    return NextResponse.json({
      success: true,
      valid: true,
      discount,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount,
        description: coupon.description
      }
    });
  } catch (error) {
    console.error('Validate Coupon Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE coupon
export async function DELETE(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing coupon ID' }, { status: 400 });
    }

    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('DELETE Coupon Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
