import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Customer from '@/models/Customer';

export const dynamic = 'force-dynamic';

function generateCustomerId() {
  const randomDigits = Math.floor(100000 + Math.random() * 900000);
  return `SK-USR-${randomDigits}`;
}

// GET customer(s)
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (email) {
      let customer = await Customer.findOne({ email: email.toLowerCase() });
      if (customer) {
        let changed = false;
        // Ensure customerId exists
        if (!customer.customerId) {
          customer.customerId = generateCustomerId();
          changed = true;
        }
        // Ensure at least one savedAddress exists if they have a shipping address recorded
        if ((!customer.savedAddresses || customer.savedAddresses.length === 0) && customer.address) {
          customer.savedAddresses = [{
            id: `addr_${Date.now()}`,
            name: customer.name,
            phone: customer.phone || '',
            address: customer.address,
            city: customer.city || '',
            state: customer.state || '',
            pincode: customer.pincode || '',
            addressType: 'Home',
            isDefault: true
          }];
          changed = true;
        }
        if (changed) {
          await customer.save();
        }
        return NextResponse.json({ success: true, customer });
      }
      return NextResponse.json({ success: true, customer: null });
    }

    const customers = await Customer.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, customers });
  } catch (error) {
    console.error('GET Customers Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST create, update customer profile or address book
export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const {
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      savedAddresses,
      newAddress,
      deleteAddressId,
      setDefaultAddressId
    } = data;

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    let customer = await Customer.findOne({ email: email.toLowerCase() });

    if (!customer) {
      // 1. New Customer Registration
      if (!name) {
        return NextResponse.json({ success: false, error: 'Name is required for new registration' }, { status: 400 });
      }

      const initialAddresses = [];
      if (Array.isArray(savedAddresses) && savedAddresses.length > 0) {
        initialAddresses.push(...savedAddresses);
      } else if (address) {
        initialAddresses.push({
          id: `addr_${Date.now()}`,
          name: name,
          phone: phone || '',
          address,
          city: city || '',
          state: state || '',
          pincode: pincode || '',
          addressType: 'Home',
          isDefault: true
        });
      }

      customer = await Customer.create({
        customerId: generateCustomerId(),
        name,
        email: email.toLowerCase(),
        phone: phone || '',
        address: address || (initialAddresses[0]?.address || ''),
        city: city || (initialAddresses[0]?.city || ''),
        state: state || (initialAddresses[0]?.state || ''),
        pincode: pincode || (initialAddresses[0]?.pincode || ''),
        savedAddresses: initialAddresses
      });

      return NextResponse.json({ success: true, customer });
    }

    // 2. Existing Customer Update
    if (!customer.customerId) {
      customer.customerId = generateCustomerId();
    }

    if (name) customer.name = name;
    if (phone !== undefined) customer.phone = phone;

    // Handle full savedAddresses overwrite if passed
    if (Array.isArray(savedAddresses)) {
      customer.savedAddresses = savedAddresses;
    }

    // Handle adding/updating single address
    if (newAddress && newAddress.address) {
      const addresses = [...(customer.savedAddresses || [])];
      const targetId = newAddress.id || `addr_${Date.now()}`;
      const addressToSave = {
        id: targetId,
        name: newAddress.name || customer.name,
        phone: newAddress.phone || customer.phone || '',
        address: newAddress.address,
        city: newAddress.city || '',
        state: newAddress.state || '',
        pincode: newAddress.pincode || '',
        addressType: newAddress.addressType || 'Home',
        isDefault: newAddress.isDefault ?? (addresses.length === 0)
      };

      if (addressToSave.isDefault) {
        addresses.forEach(a => { a.isDefault = false; });
      }

      const existingIndex = addresses.findIndex(a => a.id === targetId);
      if (existingIndex >= 0) {
        addresses[existingIndex] = { ...addresses[existingIndex], ...addressToSave };
      } else {
        addresses.push(addressToSave);
      }

      customer.savedAddresses = addresses;
    }

    // Handle setting default address
    if (setDefaultAddressId) {
      const addresses = [...(customer.savedAddresses || [])];
      addresses.forEach(a => {
        a.isDefault = (a.id === setDefaultAddressId);
      });
      customer.savedAddresses = addresses;
    }

    // Handle deleting an address
    if (deleteAddressId) {
      let addresses = (customer.savedAddresses || []).filter(a => a.id !== deleteAddressId);
      if (addresses.length > 0 && !addresses.some(a => a.isDefault)) {
        addresses[0].isDefault = true;
      }
      customer.savedAddresses = addresses;
    }

    // Synchronize primary address fields with default address
    const defaultAddr = customer.savedAddresses?.find(a => a.isDefault) || customer.savedAddresses?.[0];
    if (defaultAddr) {
      customer.address = defaultAddr.address;
      customer.city = defaultAddr.city;
      customer.state = defaultAddr.state;
      customer.pincode = defaultAddr.pincode;
      if (!customer.phone && defaultAddr.phone) {
        customer.phone = defaultAddr.phone;
      }
    } else if (address) {
      customer.address = address;
      if (city) customer.city = city;
      if (state) customer.state = state;
      if (pincode) customer.pincode = pincode;
    }

    await customer.save();
    return NextResponse.json({ success: true, customer });
  } catch (error) {
    console.error('POST Customer Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
