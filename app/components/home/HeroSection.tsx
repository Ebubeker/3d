'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="bg-white relative overflow-hidden">
      <div className="flex flex-col md:flex-row min-h-screen pt-16">
        {/* Left: Content - Half width */}
        <div className="w-full md:w-1/2 flex items-center z-10">
          <div className="max-w-2xl mx-auto px-8 md:px-16 py-16 md:py-20">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-8 leading-tight animate-fade-in-up">
              The digitization fashion, the good ole fashion way
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 mb-10 animate-fade-in-up delay-200" style={{ animationFillMode: 'both' }}>
              Professional virtual clothing design. Faster production, lower costs.
            </p>

            <Link href="/contact">
              <button className="px-12 py-5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 hover:scale-105 transform transition-all duration-300 text-lg shadow-lg hover:shadow-xl animate-fade-in-up delay-400" style={{ animationFillMode: 'both' }}>
                Get a quote
              </button>
            </Link>
          </div>
        </div>

        {/* Right: Full-height image - Half width */}
        <div className="hidden md:block md:w-1/2 md:absolute md:top-16 md:right-0 md:bottom-0 md:h-[calc(100vh-4rem)]">
          <div className="relative w-full h-full animate-fade-in-right delay-300" style={{ animationFillMode: 'both' }}>
            <Image
              src="/images/hero/f1.jpg"
              alt="3D Fashion Design"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay for smooth transition */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
