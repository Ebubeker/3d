'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AudienceSegments() {
  const segments = [
    {
      id: 1,
      headline: "Fashion Brands and Product Teams",
      description: "End-to-end support from tech pack to sampling to e-commerce visuals.",
      features: [
        "Tech pack services and apparel technical design",
        "Faster approvals with 3D garment prototyping and virtual sampling",
        "Visual assets for product pages and e-commerce listings"
      ],
      cta: "Get Started",
      ctaLink: "/contact"
    },
    {
      id: 2,
      headline: "Designers and Studios",
      description: "Extra capacity when you need it, without changing your workflow.",
      features: [
        "On-demand support for tech packs, specs, and construction details",
        "3D garment visualization for fit checks, materials, and colorways",
        "Consistent outputs ready for vendors and brand teams"
      ],
      cta: "View Solutions",
      ctaLink: "/solutions"
    },
    {
      id: 3,
      headline: "Manufacturers and Vendors",
      description: "Clear, vendor-ready deliverables that minimize revisions and expedite sampling.",
      features: [
        "Production-ready tech packs and spec sheets that vendors can execute",
        "Clear construction details and measurement consistency",
        "3D garment prototyping to reduce sampling iterations"
      ],
      cta: "Contact Sales",
      ctaLink: "/contact"
    }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.2,
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
    <section className="bg-gray-50 py-20 sm:py-32 md:py-40 lg:py-52">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-10 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 font-copperplate">
            For Teams of All Sizes
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Built for fashion execution across brands, studios, and vendors.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {segments.map((segment) => (
            <motion.div
              key={segment.id}
              variants={itemVariants}
              className="bg-white border-2 border-gray-200 rounded-2xl p-6 sm:p-8 hover:border-black hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2 font-copperplate">
                  {segment.headline}
                </h3>
              </div>

              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                {segment.description}
              </p>

              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 grow">
                {segment.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-2 sm:mr-3 mt-1.5 shrink-0"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={segment.ctaLink} className="mt-auto">
                <button className="w-full px-4 sm:px-6 py-3 sm:py-4 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 text-sm sm:text-base">
                  {segment.cta}
                </button>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
