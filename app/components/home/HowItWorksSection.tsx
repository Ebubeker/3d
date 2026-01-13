'use client';

import { motion } from 'framer-motion';
import { ClipboardList, Users, CheckCircle, Package, Ruler, Box, Image, Check } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      id: 1,
      title: "Define deliverables and timelines",
      description: "Start with a short brief and decide what you need. Tech pack services, apparel technical design, 3D garment prototyping, and visuals for product pages and e-commerce listings. Scope, timelines, and required reference files are agreed upfront.",
      icon: ClipboardList
    },
    {
      id: 2,
      title: "Choose your specialist",
      description: "Browse the marketplace and select the right expert for your workflow, category, and vendor requirements. You can filter by skill set and deliverables, review portfolios, and confirm availability before starting.",
      icon: Users
    },
    {
      id: 3,
      title: "Review and approve iterations",
      description: "Work in clear checkpoints to reduce back-and-forth. Typical reviews include fit and measurements, construction details, and materials and colorways. Each iteration brings you closer to approval with fewer surprises.",
      icon: CheckCircle
    },
    {
      id: 4,
      title: "Receive production-ready outputs",
      description: "Get vendor-ready files for sampling and production, plus visual assets for product pages and e-commerce listings. All outputs are delivered in an organized package that supports consistent sampling, faster approvals, and easier handoff to vendors.",
      icon: Package
    }
  ];

  const outputs = [
    {
      id: 1,
      title: "2D Technical Design and Tech Packs",
      icon: Ruler,
      items: [
        "Tech packs, measurements, and spec sheets",
        "Construction details and callouts",
        "Vendor-ready files that support consistent sampling"
      ]
    },
    {
      id: 2,
      title: "Virtual Sampling and 3D Prototyping",
      icon: Box,
      items: [
        "3D garment prototyping and fit simulation",
        "Materials and colorways visualization",
        "Validation that reduces physical samples and rework"
      ]
    },
    {
      id: 3,
      title: "Visual assets for e-commerce",
      icon: Image,
      items: [
        "Virtual model imagery across styles and colorways",
        "Multi-angle product visuals without photoshoots",
        "Assets optimized for product pages and e-commerce listings"
      ]
    }
  ];

  const clientPrep = [
    "Reference images and sketches",
    "Measurements, size range, and target fit",
    "Fabric and trims information, if available",
    "Any vendor requirements or existing tech pack templates"
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  return (
    <section className="bg-white py-20 sm:py-32 md:py-40 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-20 sm:mb-28 md:mb-32"
        >
          {/* <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6">
            How It Works
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Traditional fashion workflow, supported by advanced digital tools.
          </p> */}
          <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-3xl mx-auto px-4 leading-relaxed">
            A clear process from brief to production-ready files. You choose a specialist from our vetted marketplace, work through structured iterations, and receive vendor-ready deliverables and product visuals.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-20 sm:mb-28"
        >
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                variants={itemVariants}
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-black hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black flex items-center justify-center">
                      <span className="text-white font-bold text-lg sm:text-xl">{step.id}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-black mb-2 sm:mb-3 font-copperplate">
                      {step.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Typical Outputs Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="mb-20 sm:mb-28"
        >
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black text-center mb-10 sm:mb-14 font-copperplate">
            Typical Outputs
          </h3>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {outputs.map((output) => {
              const Icon = output.icon;
              return (
                <motion.div
                  key={output.id}
                  variants={itemVariants}
                  className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-gray-200 hover:border-black transition-all duration-300"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4 sm:mb-6">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" strokeWidth={1.5} />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4 font-copperplate">
                    {output.title}
                  </h4>
                  <ul className="space-y-2 sm:space-y-3">
                    {output.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-600">
                        <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shrink-0">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" strokeWidth={2.5} />
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>

        {/* What Clients Typically Prepare */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-6 sm:mb-8 text-center">
            What clients typically prepare
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {clientPrep.map((item, idx) => (
              <div key={idx} className="flex items-start text-sm sm:text-base text-gray-700">
                <span className="w-1.5 h-1.5 rounded-full bg-black mr-3 mt-2 shrink-0"></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div> */}
      </div>
    </section>
  );
}
