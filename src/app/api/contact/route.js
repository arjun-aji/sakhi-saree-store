import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Contact from '@/models/Contact';

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

    // Connect to database
    await connectDB();

    // Create a new contact submission record
    const newContact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    console.log('Saved contact submission to MongoDB with ID:', newContact._id);

    return NextResponse.json({
      success: true,
      message: 'Contact message received and saved successfully',
      recipient: 'jajithks01@gmail.com',
      id: newContact._id
    });
  } catch (error) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process contact submission' },
      { status: 500 }
    );
  }
}

