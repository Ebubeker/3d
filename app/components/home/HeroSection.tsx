'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-white relative">
      <div className="flex flex-col md:flex-row min-h-screen pt-16">
        {/* Left: Content - Half width */}
        <div className="w-full md:w-1/2 flex items-center z-10">
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

        {/* Right: Full-height image - Half width */}
        <div className="hidden md:block md:w-1/2 md:absolute md:top-0 md:right-0 md:bottom-0 md:h-screen rounded-bl-[150px] overflow-hidden">
          <div className="relative w-full h-full">
            <Image
              src="/images/hero/f1.jpg"
              alt="3D Fashion Design"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
