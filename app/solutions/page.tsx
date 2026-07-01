'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import HowItWorksSection from '../components/home/HowItWorksSection';
import WhyUsSection from '../components/WhyUsSection';

export default function SolutionsPage() {
  const [isHeroVisible, setIsHeroVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHeroVisible(true);
  }, []);

  return (
    <>
      <Header />

      {/* Hero Section with Background Pattern */}
      <div ref={heroRef} className="relative bg-white min-h-[50vh] sm:min-h-[60vh] flex items-center pt-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute w-full h-full inset-0 z-0 pointer-events-none">
          <img
            src="/images/6224739.jpg"
            alt="Background pattern"
            className="w-full h-full object-cover"
            style={{ opacity: 0.05 }}
          />
        </div>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gray-100 rounded-full blur-3xl opacity-60 animate-pulse" />
          <div className="absolute bottom-20 right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gray-200 rounded-full blur-3xl opacity-40" style={{ animation: 'pulse 4s ease-in-out infinite' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[450px] md:w-[600px] h-[300px] sm:h-[450px] md:h-[600px] border border-gray-200 rounded-full opacity-30" />
        </div>



        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 flex flex-col justify-center h-full">
          <div className={`transition-all duration-1000 ${isHeroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-4 sm:mb-6 md:mb-8 leading-tight font-copperplate">
              How It Works
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 md:mb-10 max-w-2xl leading-relaxed">
              Traditional fashion workflow, supported by advanced digital tools.
            </p>
          </div>
        </div>
      </div>

      <HowItWorksSection />
      
      <WhyUsSection />

      {/* Tools Section - Enhanced */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 lg:py-40">
          <div className="text-center mb-10 sm:mb-14 md:mb-20">
            <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3 sm:mb-4 font-copperplate">
              Technology Stack
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-black mb-4 sm:mb-6 font-copperplate">
              Industry-Leading Tools
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              We work with the best software in digital fashion
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { name: 'CLO3D', desc: '3D Garment Design', detail: 'Industry-standard software for realistic garment simulation and pattern development' },
              { name: 'Browzwear', desc: 'Digital Fashion', detail: 'End-to-end 3D design platform trusted by leading fashion brands worldwide' },
              { name: 'Marvelous Designer', desc: '3D Clothing', detail: 'Advanced cloth simulation for photorealistic digital garments' },
              { name: 'Adobe Illustrator', desc: 'Technical Design', detail: 'Professional vector graphics for detailed technical flats and specs' }
            ].map((tool, idx) => (
              <div
                key={idx}
                className="group bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border-2 border-gray-200 hover:border-black hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
              >
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-black mb-1.5 sm:mb-2 font-copperplate">{tool.name}</h3>
                <p className="text-xs sm:text-sm font-medium text-gray-500 mb-2 sm:mb-4">{tool.desc}</p>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{tool.detail}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 sm:mt-14 md:mt-20 text-center">
            <Link href="/contact">
              <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 hover:scale-105 transform transition-all duration-300 text-base sm:text-lg shadow-lg">
                Request a Quote
              </button>
            </Link>
          </div>
        </div>
      </div>


      {/* Get Started - Black CTA */}
      <div className="bg-black text-white py-16 sm:py-24 md:py-32 lg:py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 font-copperplate">
            Get Started
          </h2>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4">
            Ready to transform your fashion design workflow? Let&apos;s talk.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center px-4 sm:px-0">
            <Link href="/contact">
              <button className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 text-base sm:text-lg md:text-xl shadow-lg hover:shadow-xl">
                Contact Us
              </button>
            </Link>
            <Link href="/team">
              <button className="w-full sm:w-auto px-8 sm:px-10 md:px-12 py-4 sm:py-5 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black hover:scale-105 transform transition-all duration-300 text-base sm:text-lg md:text-xl">
                View Team
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}