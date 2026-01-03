'use client';

import { Ruler, Palette, Gem, Image, Users, Cloud } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export default function ServicesGrid() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const services = [
    {
      id: 1,
      title: "2D Technical Drawings",
      description: "Professional flat sketches and technical specifications for production-ready garments.",
      features: [
        "Detailed tech packs with measurements",
        "Construction details and specifications",
        "Multiple views and variations"
      ],
      icon: Ruler
    },
    {
      id: 2,
      title: "3D Fashion Design",
      description: "Create realistic digital garments using industry-leading CLO3D and Browzwear software.",
      features: [
        "Realistic fabric simulation",
        "Pattern making and grading",
        "Animation and fit testing"
      ],
      icon: Palette
    },
    {
      id: 3,
      title: "Virtual Prototyping",
      description: "Eliminate physical sampling costs with photorealistic digital prototypes.",
      features: [
        "60% reduction in sampling costs",
        "Faster iteration and approvals",
        "Sustainable design process"
      ],
      icon: Gem
    },
    {
      id: 4,
      title: "Product Rendering",
      description: "Studio-quality product images and marketing visuals without photoshoots.",
      features: [
        "Photorealistic product shots",
        "Multiple angles and lighting",
        "Lifestyle and e-commerce ready"
      ],
      icon: Image
    },
    {
      id: 5,
      title: "Virtual Try-On",
      description: "Interactive digital fitting solutions for e-commerce and retail experiences.",
      features: [
        "AR try-on integration",
        "Size recommendation engine",
        "Reduced return rates"
      ],
      icon: Users
    },
    {
      id: 6,
      title: "Collaborative Platform",
      description: "Cloud-based workspace connecting you with expert fashion designers worldwide.",
      features: [
        "On-demand expert designers",
        "Real-time collaboration tools",
        "Project management dashboard"
      ],
      icon: Cloud
    }
  ];

  return (
    <section ref={sectionRef} className="bg-white py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-6">
        <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-8">
            Our Services
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            End-to-end digital fashion solutions to transform your design workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`group bg-white rounded-2xl p-8 border-2 border-gray-200 hover:border-black transition-all duration-500 hover:shadow-xl aspect-square flex flex-col ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  transitionProperty: 'all'
                }}
              >
                <div className="w-14 h-14 rounded-xl bg-white border-2 border-black flex items-center justify-center mb-6 group-hover:bg-black transition-all duration-300">
                  <Icon className="w-7 h-7 text-black group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>

                <h3 className="text-xl font-bold text-black mb-3">
                  {service.title}
                </h3>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed flex-grow">
                  {service.description}
                </p>

                <ul className="space-y-2 mt-auto">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-sm text-gray-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-black mr-3 mt-1.5 flex-shrink-0"></span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
