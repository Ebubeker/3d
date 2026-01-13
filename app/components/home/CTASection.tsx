'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CTASection() {
  return (
    <section className="bg-black text-white py-16 sm:py-24 md:py-32 lg:py-40 relative overflow-hidden">
      {/* Pattern background */}
      <img
          src="/images/6224739.jpg"
          alt="Background pattern"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
      <div className="absolute inset-0 bg-black/40" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 md:mb-8 font-copperplate"
        >
          Get Started
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4"
        >
          Ready to transform your fashion design workflow? Let's talk.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4"
        >
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
        </motion.div>
      </div>
    </section>
  );
}
