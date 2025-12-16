'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-black text-white py-32 md:py-40 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.1),transparent_70%)]" />

      <div className="max-w-7xl mx-auto px-8 md:px-12 text-center relative z-10">
        <h2 className={`text-5xl md:text-6xl lg:text-7xl font-bold mb-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Get Started
        </h2>

        <p className={`text-xl md:text-2xl text-gray-400 mb-12 max-w-2xl mx-auto transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          Ready to transform your fashion design workflow? Let's talk.
        </p>

        <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link href="/contact">
            <button className="w-full sm:w-auto px-12 py-5 bg-white text-black rounded-lg font-semibold hover:bg-gray-100 hover:scale-105 transform transition-all duration-300 text-xl shadow-lg hover:shadow-xl">
              Contact Us
            </button>
          </Link>
          <Link href="/team">
            <button className="w-full sm:w-auto px-12 py-5 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-black hover:scale-105 transform transition-all duration-300 text-xl">
              View Team
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
