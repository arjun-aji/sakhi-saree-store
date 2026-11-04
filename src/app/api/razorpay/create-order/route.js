import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const { amount, receipt, notes } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ success: false, error: 'Invalid order amount' }, { status: 400 });
    }

    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Razorpay keys are not configured. Please add NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local' 
        }, 
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    
    // Razorpay requires amount in the smallest currency unit (paise for INR)
    const amountInPaise = Math.round(Number(amount) * 100);

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: receipt || `rcpt_${Date.now()}`,
        notes: notes || {},
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Razorpay Order Creation Failed:', data);
      return NextResponse.json(
        { 
          success: false, 
          error: data.error?.description || 'Failed to create Razorpay order' 
        }, 
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: keyId,
    });
  } catch (error) {
    console.error('Razorpay Create Order Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

