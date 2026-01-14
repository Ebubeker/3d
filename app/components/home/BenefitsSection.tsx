'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function BenefitsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const benefits: { id: number; title: string; description: string; type: string; image: string; video?: string }[] = [
    {
      id: 1,
      title: "Faster Production",
      description: "Accelerate your apparel product development with virtual sampling and faster approvals. Shorten lead times from concept to production ready, with fewer physical samples.",
      type: "image",
      image: "/images/portfolio/f2.jpg"
    },
    {
      id: 2,
      title: "Cost Savings",
      description: "Reduce sampling iterations and lower development cost per style by cutting rework and physical sample shipments. Digital prototypes support clearer decisions earlier in the process.",
      type: "image",
      image: "/images/portfolio/f3.jpg"
    },
    {
      id: 3,
      title: "Expert Team",
      description: "Access a vetted network of fashion specialists for tech pack services, apparel technical design, and 3D garment visualization. The team follows industry best practices and proven delivery workflows.",
      type: "image",
      image: "/images/portfolio/f4.png"
    },
    {
      id: 4,
      title: "Top Technology",
      description: "Advanced 3D virtualization and patternmaking workflows support 3D garment prototyping, fit simulation, and production-ready outputs. AI-based tools are used to create e-commerce visuals, presenting collections on virtual models for consistent product pages and listings. Our specialists work with Optitex, CLO3D, Browzwear, Style3D, Shima Seiki, and other leading 3D virtualization and patternmaking solutions.",
      type: "image",
      image: "/images/portfolio/f5.png"
    }
  ];

  const handleScroll = useCallback(() => {
    if (!sectionRef.current || !containerRef.current) return;

    const section = sectionRef.current;
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const viewportHeight = window.innerHeight;

    // Calculate how far we've scrolled through the section
    const scrolled = -rect.top;
    const scrollableDistance = sectionHeight - viewportHeight;

    if (scrolled < 0) {
      setActiveIndex(0);
      setProgress(0);
      return;
    }

    if (scrolled > scrollableDistance) {
      setActiveIndex(benefits.length - 1);
      setProgress(100);
      return;
    }

    // Calculate progress through entire section (0-100)
    const totalProgress = (scrolled / scrollableDistance) * 100;
    setProgress(totalProgress);

    // Calculate which benefit is active
    const benefitProgress = scrolled / scrollableDistance;
    const newIndex = Math.min(
      Math.floor(benefitProgress * benefits.length),
      benefits.length - 1
    );
    setActiveIndex(newIndex);
  }, [benefits.length]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <section
      ref={sectionRef}
      className="relative bg-gray-50 border-t border-gray-200"
      style={{ height: `${benefits.length * 100}vh` }}
    >
      {/* Sticky Container */}
      <div
        ref={containerRef}
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col pt-20"
      >
        {/* Header with Title and Progress */}
        <div className="bg-gray-50 pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 md:pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black font-copperplate">
                Benefits
              </h2>

              {/* Progress Indicator */}
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="text-xs sm:text-sm font-medium text-gray-500">
                  {activeIndex + 1} / {benefits.length}
                </span>
                <div className="w-32 sm:w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-2 sm:gap-3 mt-4 sm:mt-6">
              {benefits.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (sectionRef.current) {
                      const targetScroll = sectionRef.current.offsetTop +
                        (index / benefits.length) * (sectionRef.current.offsetHeight - window.innerHeight);
                      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                    }
                  }}
                  className={`w-8 sm:w-12 h-1 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to benefit ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 sm:pb-12 md:pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 h-full items-center">
              {/* Text Content */}
              <div className="flex flex-col justify-center relative min-h-[180px] sm:min-h-[200px] md:min-h-0">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit.id}
                    className={`absolute transition-all duration-700 ease-out max-w-xl ${
                      index === activeIndex
                        ? 'opacity-100 translate-y-0'
                        : index < activeIndex
                          ? 'opacity-0 -translate-y-8'
                          : 'opacity-0 translate-y-8'
                    }`}
                    style={{
                      pointerEvents: index === activeIndex ? 'auto' : 'none',
                    }}
                  >
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
                      <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black text-white flex items-center justify-center text-lg sm:text-xl font-bold">
                        {benefit.id}
                      </span>
                      <div className="h-px flex-1 bg-gray-300" />
                    </div>
                    <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-3 sm:mb-6 leading-tight font-copperplate">
                      {benefit.title}
                    </h3>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Visual Content */}
              <div className="relative h-[35vh] sm:h-[40vh] md:h-[60vh] min-h-[250px] sm:min-h-[300px] md:min-h-[400px]">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit.id}
                    className={`absolute inset-0 transition-all duration-700 ease-out rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl ${
                      index === activeIndex
                        ? 'opacity-100 scale-100'
                        : 'opacity-0 scale-95'
                    }`}
                  >
                    {benefit.type === 'video' ? (
                      <div className="relative w-full h-full bg-gray-900">
                        <video
                          src={benefit.video}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20" />
                        {/* Video Label */}
                        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
                          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-white text-xs sm:text-sm font-medium">Video</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={benefit.image || '/placeholder.jpg'}
                          alt={benefit.title}
                          fill
                          className="object-cover object-top"
                        />
                        <div className="absolute inset-0 bg-black/10" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Hint - only show at start, hide on small mobile */}
        {activeIndex === 0 && progress < 5 && (
          <div className="hidden sm:flex absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 animate-bounce">
            <span className="text-xs sm:text-sm text-gray-500">Scroll to explore</span>
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
