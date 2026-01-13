'use client';

import { motion } from 'framer-motion';
import { ClipboardCheck, Zap, Leaf, Check, ExternalLink } from 'lucide-react';

export default function WhyUsSection() {
  const reasons = [
    {
      id: 1,
      title: "Simple Onboarding",
      description: "A clear start with defined scope, timelines, and deliverables.",
      icon: ClipboardCheck,
      features: [
        "Define outputs and file requirements upfront.",
        "Choose your specialist from the marketplace.",
        "Work through clear review checkpoints."
      ]
    },
    {
      id: 2,
      title: "Faster Time-to-Market",
      description: "Shorter development cycles through faster approvals and fewer iterations.",
      icon: Zap,
      features: [
        { text: "Case studies report 25 percent shorter development time after adopting 3D workflows.", source: 1 },
        { text: "Case studies report 30 to 40 percent fewer physical samples in specific categories and teams.", source: [1, 2] },
        "Reduced delays caused by shipping and sample rework."
      ]
    },
    {
      id: 3,
      title: "Sustainable Process",
      description: "Fewer physical samples and shipments reduce waste during development.",
      icon: Leaf,
      features: [
        "Less physical sampling waste through earlier digital validation.",
        { text: "Research reports large reductions in sampling volumes and cycle time when 3D workflows replace parts of physical sampling.", source: [3, 4] },
        "Fewer revisions and less rework across the sampling cycle."
      ]
    }
  ];

  const sources = [
    {
      id: 1,
      title: "Top Form case study",
      description: "Reduced samples by 30 percent and cut development time by 25 percent.",
      url: "https://browzwear.com/success-stories/topform-case-study"
    },
    {
      id: 2,
      title: "PEPCO case study",
      description: "Reduced physical samples by 40 percent in a product category.",
      url: "https://browzwear.com/success-stories/interview-with-karolina-hennig-pepco"
    },
    {
      id: 3,
      title: "Papachristou et al, 2023",
      description: "Methods framework citing reported reductions in sampling and time with 3D digital garment workflows.",
      url: "https://journals.sagepub.com/doi/10.1177/15589250231194621"
    },
    {
      id: 4,
      title: "SAGE paper, 2025",
      description: "Reports manufacturers using virtual sampling to reduce sample development time by over 50 percent.",
      url: "https://journals.sagepub.com/doi/10.1177/00405175251360399"
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

  const formatSource = (source: number | number[]) => {
    if (Array.isArray(source)) {
      return source.map(s => `[${s}]`).join(', ');
    }
    return `[${source}]`;
  };

  return (
    <section className="bg-white py-20 sm:py-32 md:py-40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 font-copperplate">
            Why Choose Us
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Industry expertise, supported by proven digital workflows.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20"
        >
          {reasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={reason.id}
                variants={itemVariants}
                className="bg-gray-50 rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-black hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-black flex items-center justify-center mb-4 sm:mb-6">
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={1.5} />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-black mb-2 sm:mb-3 font-copperplate">
                  {reason.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 leading-relaxed">
                  {reason.description}
                </p>
                <ul className="space-y-3 sm:space-y-4">
                  {reason.features.map((feature, idx) => {
                    const isObjectFeature = typeof feature === 'object';
                    const text = isObjectFeature ? feature.text : feature;
                    const source = isObjectFeature ? feature.source : null;

                    return (
                      <li key={idx} className="flex items-start text-xs sm:text-sm text-gray-700">
                        <span className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-black flex items-center justify-center mr-2 sm:mr-3 mt-0.5 shrink-0">
                          <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" strokeWidth={2.5} />
                        </span>
                        <span>
                          {text}
                          {source && (
                            <span className="text-gray-500 ml-1">
                              {formatSource(source)}
                            </span>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
