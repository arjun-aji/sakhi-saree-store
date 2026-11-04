/**
 * Shipping fee calculation based on pincode and admin settings.
 * - Kerala Pincodes: 67xxxx, 68xxxx, 69xxxx
 * - Pan-India Pincodes: All other 6-digit Indian postal codes
 */

export const DEFAULT_SHIPPING_RATES = {
  keralaLocal: 49,
  panIndiaStandard: 49,
  international: 1500,
  freeShippingThreshold: 0,
  enableFreeShipping: false
};

export function calculateShippingFee(pincode, subtotal = 0, rates = DEFAULT_SHIPPING_RATES) {
  const activeRates = { ...DEFAULT_SHIPPING_RATES, ...(rates || {}) };

  // Check if free shipping threshold is active and met
  if (activeRates.enableFreeShipping && activeRates.freeShippingThreshold > 0 && subtotal >= activeRates.freeShippingThreshold) {
    return {
      fee: 0,
      isFree: true,
      region: 'Free Delivery (Threshold Met)',
      pincode: pincode || ''
    };
  }

  const cleanPin = (pincode || '').toString().trim().replace(/\s+/g, '');

  // Kerala state pincodes begin with 67, 68, or 69
  if (/^(67|68|69)\d{4}$/.test(cleanPin)) {
    return {
      fee: Number(activeRates.keralaLocal ?? 49),
      isFree: false,
      region: 'Kerala Local Delivery',
      pincode: cleanPin
    };
  }

  // Any other valid 6-digit Indian pincode
  if (/^\d{6}$/.test(cleanPin)) {
    return {
      fee: Number(activeRates.panIndiaStandard ?? 49),
      isFree: false,
      region: 'Pan-India Standard Delivery',
      pincode: cleanPin
    };
  }

  // Default: Apply standard delivery charge
  return {
    fee: Number(activeRates.panIndiaStandard ?? 49),
    isFree: false,
    region: 'Standard Delivery',
    pincode: cleanPin
  };
}

