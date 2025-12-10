'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-white min-h-screen flex items-center pt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left: Content */}
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-4 leading-tight">
              3D Fashion Design for Modern Brands
            </h1>

            <p className="text-xl text-gray-700 mb-6">
              Professional virtual clothing design. Faster production, lower costs.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <Link href="/team">
                <button className="w-full sm:w-auto px-8 py-4 bg-black text-white rounded font-medium hover:bg-gray-900 transition-colors">
                  Hire the Team
                </button>
              </Link>
              <Link href="/join">
                <button className="w-full sm:w-auto px-8 py-4 border-2 border-black text-black rounded font-medium hover:bg-black hover:text-white transition-colors">
                  Join the Team
                </button>
              </Link>
            </div>

            <p className="text-base italic text-gray-600 mb-4">
              Digitizing fashion, the good ole' fashion way
            </p>

            <p className="text-sm text-gray-500">
              Trusted by <span className="font-semibold text-gray-700">Adidas, Under Armour, Armani</span>
            </p>
          </div>

          {/* Right: Visual - Full height */}
          <div className="relative h-[70vh] min-h-[500px]">
            <Image
              src="/images/hero/f1.jpg"
              alt="3D Fashion Design"
              fill
              className="object-cover rounded-2xl"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
