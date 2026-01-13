'use client';

import { Ruler, Box, Image, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function ServicesGrid() {
  const services = [
    {
      id: 1,
      title: "2D Technical Design and Tech Packs",
      description: "Apparel technical design that reduces delays and rework.",
      features: [
        "Production-ready tech packs, measurements, and spec sheets vendors can execute.",
        "Clear construction details that reduce iterations with vendors.",
        "Vendor-ready deliverables that lower development cost per style."
      ],
      icon: Ruler,
      link: "/solutions"
    },
    {
      id: 2,
      title: "Virtual Sampling and 3D Prototyping",
      description: "Shorten lead times, reduce physical samples, and speed up approvals.",
      features: [
        "3D fit simulation and validation using advanced 3D visualization tools.",
        "Faster approvals with fewer physical samples and less rework.",
        "Colorways and materials visualization for clearer decisions."
      ],
      icon: Box,
      link: "/solutions"
    },
    {
      id: 3,
      title: "E-commerce Ready Visuals",
      description: "Visual assets for product pages and listings, created from digital prototypes and virtual models.",
      features: [
        "On-model imagery with virtual models across styles and colorways.",
        "Multi-angle product visuals without photoshoots.",
        "Assets optimized for e-commerce listings and product pages."
      ],
      icon: Image,
      link: "/solutions"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  return (
    <section className="bg-gray-100 py-20 sm:py-32 md:py-40 lg:py-52">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 sm:mb-16 md:mb-24"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-4 sm:mb-6 md:mb-8 font-copperplate">
            Our Services
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Traditional fashion execution, supported by digital tools and vetted talent.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className="group bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-black shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                {/* Icon with rounded background */}
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gray-100 group-hover:bg-black flex items-center justify-center mb-4 sm:mb-6 transition-all duration-500">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-gray-600 group-hover:text-white transition-colors duration-500" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-lg sm:text-xl font-bold text-black mb-2 sm:mb-3 font-copperplate">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-500 mb-4 sm:mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features with checkmarks */}
                <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-600">
                      <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shrink-0">
                        <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" strokeWidth={2.5} />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Learn more link */}
                <Link
                  href={service.link}
                  className="inline-flex items-center gap-2 text-black font-semibold mt-auto text-sm sm:text-base"
                >
                  <span>Learn more</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
