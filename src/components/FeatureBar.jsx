import React from 'react';
import { Truck, PackageCheck, ShieldCheck, Headphones } from 'lucide-react';

export default function FeatureBar() {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      shortTitle: 'Free Shipping',
      description: 'On orders above ₹1499',
    },
    {
      icon: PackageCheck,
      title: 'Easy Returns',
      shortTitle: 'Easy Returns',
      description: 'Hassle free return policy',
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payment',
      shortTitle: '100% Secure',
      description: '100% secure transactions',
    },
    {
      icon: Headphones,
      title: 'Customer Support',
      shortTitle: '24/7 Support',
      description: "We're here to help you",
    },
  ];

  return (
    <div className="w-full">
      {/* ========================================================= */}
      {/* MOBILE VIEW: 1x4 Grid (4 Small Compact Boxes Side-by-Side) */}
      {/* ========================================================= */}
      <div className="grid sm:hidden grid-cols-4 gap-1.5 w-full">
        {features.map((item, index) => {
          const Icon = item.icon;
          return (
            <div 
              key={index} 
              className="bg-[#3D1418] text-[#F7EFE8] rounded-lg p-1.5 flex flex-col items-center justify-center text-center border border-[#5B1D23]/80 shadow-md min-h-[72px]"
            >
              <div className="w-6 h-6 rounded-full border border-[#D4AF37]/50 flex items-center justify-center bg-[#2A0E11]/60 mb-1">
                <Icon className="w-3 h-3 text-[#D4AF37] stroke-[1.75]" />
              </div>
              <span className="text-[9px] font-bold tracking-tight uppercase leading-tight text-white">
                {item.shortTitle}
              </span>
            </div>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* DESKTOP & TABLET VIEW: 4 Column Banner Container           */}
      {/* ========================================================= */}
      <div className="hidden sm:block w-full bg-[#3D1418] text-[#F7EFE8] rounded-2xl p-4 lg:p-5 shadow-xl border border-[#5B1D23]/60">
        <div className="grid grid-cols-4 gap-4 divide-x divide-[#5B1D23]/60">
          {features.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index} 
                className={`flex items-center gap-3 ${index !== 0 ? 'pl-4 lg:pl-6' : ''}`}
              >
                <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full border border-[#D4AF37]/40 flex items-center justify-center flex-shrink-0 bg-[#2A0E11]/40">
                  <Icon className="w-5 h-5 text-[#D4AF37] stroke-[1.5]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-xs lg:text-sm font-bold tracking-wider uppercase text-white">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-[#EFE6DD]/80 font-normal mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
