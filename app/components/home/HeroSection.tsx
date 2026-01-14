'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="bg-white relative overflow-hidden">
      {/* Background image with 5% opacity */}
      <div className="absolute w-full h-full inset-0 z-0 pointer-events-none">
        <img
          src="/images/6224739.jpg"
          alt="Background pattern"
          className="w-full h-full object-cover"
          style={{ opacity: 0.05 }}
        />
      </div>
      <div className="flex flex-col md:flex-row min-h-screen pt-20 md:pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left: Content - Half width */}
        <div className="w-full md:w-1/2 flex items-center z-10">
          <div className="pr-6 sm:pr-8 md:pr-16 py-12 md:py-20">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4 sm:mb-6 leading-tight font-copperplate"
            >
              Digitizing fashion, the good old-fashioned way
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-lg sm:text-xl md:text-2xl text-gray-700 mb-8 sm:mb-10"
            >
              Traditional fashion execution, supported by digital tools and on-demand talent.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <Link href="/contact">
                <button className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 hover:scale-105 transform transition-all duration-300 text-base sm:text-lg shadow-lg hover:shadow-xl">
                  Get a quote
                </button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Mobile: Hero Image section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="block md:hidden w-full h-[50vh] min-h-[350px] relative overflow-hidden"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/images/hero/hero-hero.png"
              alt="Fashion models"
              className="h-[80%] w-auto object-contain"
            />
          </div>
        </motion.div>

        {/* Desktop: Hero Image - Half width */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="hidden md:block md:w-1/2 md:absolute md:top-0 md:right-0 md:bottom-0 md:h-screen rounded-bl-[150px] overflow-hidden bg-transparent"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <img
              src="/images/hero/hero-hero.png"
              alt="Fashion models"
              className="h-[85%] w-auto object-contain"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
