import React from 'react';
import { Truck, ShieldCheck, Tag } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-[#2A0E11] text-[#F7EFE8] text-[10px] sm:text-xs tracking-wider uppercase py-2 px-3 sm:px-4 border-b border-[#3D1418]/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1 sm:gap-4 text-center">
        
        {/* Item 1 */}
        <div className="flex items-center justify-center gap-1.5 font-medium flex-1">
          <Truck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate">Free Shipping Above ₹1499</span>
        </div>
        
        <span className="hidden sm:inline text-[#5B1D23]">|</span>

        {/* Item 2 */}
        <div className="flex items-center justify-center gap-1.5 font-medium flex-1">
          <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate">COD Available</span>
        </div>

        <span className="hidden sm:inline text-[#5B1D23]">|</span>

        {/* Item 3 */}
        <div className="flex items-center justify-center gap-1.5 font-medium flex-1">
          <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#D4AF37] flex-shrink-0" />
          <span className="truncate">10% Off On First Order</span>
        </div>

      </div>
    </div>
  );
}
