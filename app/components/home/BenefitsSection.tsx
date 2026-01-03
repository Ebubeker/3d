'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, useCallback } from 'react';

export default function BenefitsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const benefits = [
    {
      id: 1,
      title: "Faster Production",
      description: "Eliminate weeks of waiting for physical samples. Our digital-first approach delivers production-ready designs in days, accelerating your entire product development cycle.",
      type: "image",
      image: "/images/portfolio/f2.jpg"
    },
    {
      id: 2,
      title: "60% Cost Savings",
      description: "Dramatically reduce sampling costs with virtual prototyping. No more expensive fabric waste, shipping fees, or multiple revision rounds eating into your margins.",
      type: "video",
      video: "https://videos.pexels.com/video-files/3129671/3129671-uhd_2560_1440_30fps.mp4"
    },
    {
      id: 3,
      title: "Expert Team",
      description: "Access a curated network of vetted fashion technical designers. Each professional is thoroughly screened for expertise in CLO3D, Browzwear, and industry best practices.",
      type: "image",
      image: "/images/portfolio/f3.jpg"
    },
    {
      id: 4,
      title: "Top Technology",
      description: "Leverage industry-leading 3D design software including CLO3D, Browzwear, and Marvelous Designer. Photorealistic renders that match physical samples.",
      type: "video",
      video: "https://videos.pexels.com/video-files/5532765/5532765-uhd_2560_1440_25fps.mp4"
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
        className="sticky top-0 h-screen w-full overflow-hidden flex flex-col"
      >
        {/* Header with Title and Progress */}
        <div className="bg-gray-50 pt-16 pb-8 px-8 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black">
                Benefits
              </h2>

              {/* Progress Indicator */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-500">
                  {activeIndex + 1} / {benefits.length}
                </span>
                <div className="w-48 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Progress Dots */}
            <div className="flex gap-3 mt-6">
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
                  className={`w-12 h-1 rounded-full transition-all duration-300 ${
                    index === activeIndex ? 'bg-black' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to benefit ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 px-8 md:px-12 pb-16 overflow-hidden">
          <div className="max-w-7xl mx-auto h-full">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 h-full items-center">
              {/* Text Content */}
              <div className="flex flex-col justify-center">
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
                    <div className="flex items-center gap-4 mb-6">
                      <span className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                        {benefit.id}
                      </span>
                      <div className="h-px flex-1 bg-gray-300" />
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 leading-tight">
                      {benefit.title}
                    </h3>
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Visual Content */}
              <div className="relative h-[50vh] md:h-[60vh] min-h-[400px]">
                {benefits.map((benefit, index) => (
                  <div
                    key={benefit.id}
                    className={`absolute inset-0 transition-all duration-700 ease-out rounded-2xl overflow-hidden shadow-2xl ${
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
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
                          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          <span className="text-white text-sm font-medium">Video</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative w-full h-full">
                        <Image
                          src={benefit.image || '/placeholder.jpg'}
                          alt={benefit.title}
                          fill
                          className="object-cover"
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

        {/* Scroll Hint - only show at start */}
        {activeIndex === 0 && progress < 5 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
            <span className="text-sm text-gray-500">Scroll to explore</span>
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
}
