import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const data = await request.json();
    const { name, email, phone, subject, message } = data;

    // Log the contact message destined for jajithks01@gmail.com
    console.log('--- NEW CONTACT FORM SUBMISSION FOR jajithks01@gmail.com ---');
    console.log('Recipient:', 'jajithks01@gmail.com');
    console.log('From Name:', name);
    console.log('From Email:', email);
    console.log('Phone:', phone);
    console.log('Subject:', subject);
    console.log('Message:', message);
    console.log('------------------------------------------------------------');

    return NextResponse.json({
      success: true,
      message: 'Contact message received successfully for jajithks01@gmail.com',
      recipient: 'jajithks01@gmail.com'
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process contact submission' },
      { status: 500 }
    );
  }
}
