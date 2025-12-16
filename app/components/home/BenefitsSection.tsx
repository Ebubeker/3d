'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function BenefitsSection() {
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute('data-index'));
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set([...prev, index]));
          }
        });
      },
      { threshold: 0.2 }
    );

    itemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const benefits = [
    {
      id: 1,
      title: "Faster Production",
      description: "Digital samples, no delays.",
      visual: "speed",
      image: "/images/portfolio/f2.jpg"
    },
    {
      id: 2,
      title: "60% Cost Savings",
      description: "Lower sampling costs.",
      visual: "cost",
      image: null
    },
    {
      id: 3,
      title: "Expert Team",
      description: "Vetted professionals.",
      visual: "talent",
      image: "/images/portfolio/f3.jpg"
    },
    {
      id: 4,
      title: "Top Technology",
      description: "CLO3D, Browzwear.",
      visual: "tech",
      image: null
    }
  ];

  return (
    <section className="bg-gray-50 border-t border-gray-200 py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-24 md:mb-32 text-center">
          Benefits
        </h2>

        <div className="space-y-32 md:space-y-40">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              ref={(el) => { itemRefs.current[index] = el; }}
              data-index={index}
              className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center transition-all duration-1000 ${visibleItems.has(index) ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
            >
              {/* Text content */}
              <div className={`${index % 2 === 1 ? 'md:order-2' : ''} flex flex-col justify-center`}>
                <h3 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-8 leading-tight">
                  {benefit.title}
                </h3>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  {benefit.description}
                </p>
              </div>

              {/* Visual - Full height */}
              <div className={`${index % 2 === 1 ? 'md:order-1' : ''} transition-all duration-700 delay-200 ${visibleItems.has(index) ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                {benefit.image ? (
                  <div className="relative h-[60vh] min-h-[500px] rounded-3xl overflow-hidden shadow-2xl group">
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                  </div>
                ) : (
                  <div className="h-[60vh] min-h-[500px] bg-linear-to-br from-gray-900 via-gray-800 to-black rounded-3xl border border-gray-300 flex items-center justify-center shadow-2xl overflow-hidden relative group">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,246,0.15),transparent_50%),radial-gradient(circle_at_70%_50%,rgba(59,130,246,0.15),transparent_50%)] group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative z-10 text-center px-8">
                      <div className="w-28 h-28 mx-auto mb-8 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-500">
                        <span className="text-white text-5xl font-bold">{benefit.id}</span>
                      </div>
                      <p className="text-white text-2xl md:text-3xl font-semibold mb-4">{benefit.title}</p>
                      <p className="text-gray-300 text-lg md:text-xl">{benefit.description}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
