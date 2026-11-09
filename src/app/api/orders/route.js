import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Customer from '@/models/Customer';
import Coupon from '@/models/Coupon';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

// GET all orders
export async function GET() {
  try {
    await connectDB();
    const orders = await Order.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('GET Orders Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT update order status and tracking details
export async function PUT(request) {
  try {
    await connectDB();
    const data = await request.json();
    const { id, status, trackingId, trackingUrl, courierPartner } = data;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing order ID' }, { status: 400 });
    }

    const updateFields = {};
    if (status) {
      updateFields.status = status;
      if (status === 'Shipped') {
        updateFields.shippedAt = new Date();
      }
    }
    if (trackingId !== undefined) updateFields.trackingId = trackingId.trim();
    if (trackingUrl !== undefined) updateFields.trackingUrl = trackingUrl.trim();
    if (courierPartner !== undefined) updateFields.courierPartner = courierPartner.trim();

    // If order status is being updated to Cancelled, automatically restore inventory stock
    if (status === 'Cancelled') {
      try {
        const orderToCancel = await Order.findById(id);
        if (orderToCancel && orderToCancel.status !== 'Cancelled' && Array.isArray(orderToCancel.items)) {
          for (const item of orderToCancel.items) {
            const qty = Math.max(1, Number(item.quantity) || 1);
            if (item.productId && /^[0-9a-fA-F]{24}$/.test(String(item.productId))) {
              await Product.findByIdAndUpdate(item.productId, { $inc: { stock: qty } });
            } else if (item.name) {
              await Product.findOneAndUpdate({ name: item.name.trim() }, { $inc: { stock: qty } });
            }
          }
        }
      } catch (cancelStockErr) {
        console.error('Error restoring stock on order cancellation:', cancelStockErr);
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error('PUT Order Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create new order only after successful payment verification
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      items,
      shippingFee,
      totalAmount,
      couponCode,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = data;

    if (!customerName || !customerEmail || !items || !items.length || !totalAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing required order details' }, 
        { status: 400 }
      );
    }

    // Strict Razorpay Payment Verification
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment verification failed: Missing Razorpay transaction details. Order can only be placed after successful payment.' 
        }, 
        { status: 400 }
      );
    }

    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;

    if (!keySecret) {
      console.error('RAZORPAY_KEY_SECRET is missing from environment variables');
      return NextResponse.json(
        { success: false, error: 'Server payment configuration missing' }, 
        { status: 500 }
      );
    }

    // 1. Verify HMAC SHA256 Signature
    const generatedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      console.error('Razorpay Signature Mismatch!', {
        generated: generatedSignature,
        received: razorpay_signature,
      });
      return NextResponse.json(
        { 
          success: false, 
          error: 'Payment verification failed: Invalid transaction signature.' 
        }, 
        { status: 400 }
      );
    }

    // 2. Verify with Razorpay API (Confirm payment status is captured or authorized)
    if (keyId && keySecret) {
      try {
        const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
        const paymentRes = await fetch(`https://api.razorpay.com/v1/payments/${razorpay_payment_id}`, {
          headers: {
            'Authorization': `Basic ${auth}`,
          },
        });
        
        if (paymentRes.ok) {
          const paymentDetails = await paymentRes.json();
          if (paymentDetails.status !== 'captured' && paymentDetails.status !== 'authorized') {
            return NextResponse.json(
              { 
                success: false, 
                error: `Payment status is ${paymentDetails.status}. Order can only be placed after payment confirmation.` 
              }, 
              { status: 400 }
            );
          }
        }
      } catch (err) {
        console.warn('Could not double-check payment with Razorpay API, proceeding with valid HMAC signature:', err.message);
      }
    }

    // Generate unique order number
    const orderNumber = `SK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone: customerPhone || '',
      shippingAddress: shippingAddress || {},
      items,
      shippingFee: Number(shippingFee || 0),
      totalAmount,
      status: 'Processing',
      paymentStatus: 'Paid',
      paymentId: razorpay_payment_id,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
    });

    // ── AUTO-DECREMENT PRODUCT INVENTORY STOCK ──
    if (Array.isArray(items) && items.length > 0) {
      for (const item of items) {
        try {
          const qtyPurchased = Math.max(1, Number(item.quantity) || 1);
          let targetProduct = null;

          // Try decrement by explicit productId if valid ObjectId string
          if (item.productId && /^[0-9a-fA-F]{24}$/.test(String(item.productId))) {
            targetProduct = await Product.findByIdAndUpdate(
              item.productId,
              { $inc: { stock: -qtyPurchased } },
              { new: true }
            );
          } else if (item.id && /^[0-9a-fA-F]{24}$/.test(String(item.id))) {
            targetProduct = await Product.findByIdAndUpdate(
              item.id,
              { $inc: { stock: -qtyPurchased } },
              { new: true }
            );
          }

          // Fallback: match by product title / name if ID didn't match
          if (!targetProduct && item.name) {
            targetProduct = await Product.findOneAndUpdate(
              { name: item.name.trim() },
              { $inc: { stock: -qtyPurchased } },
              { new: true }
            );
          }

          // Safeguard: clamp stock to minimum 0 (prevent negative inventory)
          if (targetProduct && targetProduct.stock < 0) {
            await Product.findByIdAndUpdate(targetProduct._id, { $set: { stock: 0 } });
          }

          console.log(`Auto-decremented stock for "${item.name}": -${qtyPurchased}. Remaining: ${targetProduct ? Math.max(0, targetProduct.stock) : 'N/A'}`);
        } catch (stockErr) {
          console.error(`Failed to auto-decrement stock for item "${item.name}":`, stockErr.message);
        }
      }
    }

    // Update or create Customer in DB for CRM records and address persistence
    try {
      let customer = await Customer.findOne({ email: customerEmail.toLowerCase() });
      const addressItem = {
        id: `addr_${Date.now()}`,
        name: customerName,
        phone: customerPhone || '',
        address: shippingAddress?.address || '',
        city: shippingAddress?.city || '',
        state: shippingAddress?.state || '',
        pincode: shippingAddress?.pincode || '',
        addressType: 'Home',
        isDefault: true,
      };

      if (!customer) {
        await Customer.create({
          customerId: `SK-USR-${Math.floor(100000 + Math.random() * 900000)}`,
          name: customerName,
          email: customerEmail.toLowerCase(),
          phone: customerPhone || '',
          address: shippingAddress?.address || '',
          city: shippingAddress?.city || '',
          state: shippingAddress?.state || '',
          pincode: shippingAddress?.pincode || '',
          savedAddresses: shippingAddress?.address ? [addressItem] : [],
        });
      } else {
        if (!customer.customerId) {
          customer.customerId = `SK-USR-${Math.floor(100000 + Math.random() * 900000)}`;
        }
        customer.name = customerName;
        if (customerPhone) customer.phone = customerPhone;

        if (shippingAddress?.address) {
          customer.address = shippingAddress.address;
          customer.city = shippingAddress.city || '';
          customer.state = shippingAddress.state || '';
          customer.pincode = shippingAddress.pincode || '';

          const addresses = customer.savedAddresses || [];
          const existingIdx = addresses.findIndex(
            (a) =>
              a.address?.trim().toLowerCase() === shippingAddress.address?.trim().toLowerCase() &&
              a.pincode?.trim() === shippingAddress.pincode?.trim()
          );

          if (existingIdx >= 0) {
            addresses[existingIdx].name = customerName;
            if (customerPhone) addresses[existingIdx].phone = customerPhone;
            addresses[existingIdx].isDefault = true;
          } else {
            addresses.forEach(a => { a.isDefault = false; });
            addresses.push(addressItem);
          }
          customer.savedAddresses = addresses;
        }

        await customer.save();
      }
    } catch (cErr) {
      console.warn('Customer record update warning:', cErr.message);
    }

    // Record coupon usage (enforces single-use per customer rule)
    if (couponCode) {
      try {
        await Coupon.findOneAndUpdate(
          { code: couponCode.trim().toUpperCase() },
          { $addToSet: { usedBy: customerEmail.toLowerCase().trim() } }
        );
      } catch (coupErr) {
        console.warn('Coupon usage tracking error:', coupErr.message);
      }
    }

    return NextResponse.json({ success: true, order: newOrder });
  } catch (error) {
    console.error('POST Order Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
