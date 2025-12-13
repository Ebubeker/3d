'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-white min-h-screen flex pt-16">
      <div className="w-full flex">
        {/* Left: Content - Half width */}
        <div className="w-full md:w-1/2 flex items-center">
          <div className="max-w-2xl mx-auto px-6 md:px-12 py-12">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 leading-tight">
              The digitization fashion, the good ole fashion way
            </h1>

            <p className="text-xl text-gray-700 mb-8">
              Professional virtual clothing design. Faster production, lower costs.
            </p>

            <Link href="/contact">
              <button className="px-10 py-4 bg-black text-white rounded font-medium hover:bg-gray-900 transition-colors text-lg">
                Get a quote
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Full-height image - Half width, reaches top and right edge */}
        <div className="hidden md:block md:w-1/2 fixed top-0 right-0 h-screen">
          <Image
            src="/images/hero/f1.jpg"
            alt="3D Fashion Design"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
