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
      icon: Ruler,
      color: "from-blue-500 to-cyan-500"
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
      icon: Palette,
      color: "from-purple-500 to-pink-500"
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
      icon: Gem,
      color: "from-emerald-500 to-teal-500"
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
      icon: Image,
      color: "from-orange-500 to-red-500"
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
      icon: Users,
      color: "from-indigo-500 to-purple-500"
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
      icon: Cloud,
      color: "from-cyan-500 to-blue-500"
    }
  ];

  return (
    <section ref={sectionRef} className="bg-white py-32 md:py-40">
      <div className="max-w-7xl mx-auto px-8 md:px-12">
        <div className={`text-center mb-24 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-8">
            Our Services
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            End-to-end digital fashion solutions to transform your design workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className={`group bg-white rounded-3xl p-10 md:p-12 border-2 border-gray-100 hover:border-gray-300 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  transitionProperty: 'all'
                }}
              >
                <div className={`w-18 h-18 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                  <Icon className="w-9 h-9 md:w-10 md:h-10 text-white" strokeWidth={2} />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-black mb-5">
                  {service.title}
                </h3>

                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-4">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-base text-gray-700">
                      <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.color} mr-4 mt-2 flex-shrink-0`}></span>
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
