'use client';

import { motion } from 'framer-motion';

export default function ToolsSection() {
  const tools = [
    { id: 1, name: "Optitex", url: "https://optitex.com/" },
    { id: 2, name: "CLO3D", url: "https://www.clo3d.com/" },
    { id: 3, name: "Browzwear", url: "https://browzwear.com/" },
    { id: 4, name: "Style3D", url: "https://www.style3d.com/" },
    { id: 5, name: "Shima Seiki", url: "https://www.shimaseiki.com/" },
    { id: 6, name: "Marvelous Designer", url: "https://www.marvelousdesigner.com/" }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  return (
    <section className="bg-gray-50 py-20 sm:py-28 md:py-36 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4 sm:mb-6 font-copperplate">
            Tools and Workflows
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            We work with widely used tools in digital fashion.
          </p>
        </motion.div>

        {/* Tools Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {tools.map((tool) => (
            <motion.a
              key={tool.id}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={itemVariants}
              className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-gray-200 hover:border-black hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center aspect-square cursor-pointer"
            >
              {/* Placeholder for logo - text only for now */}
              {/* <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gray-100 flex items-center justify-center mb-3 sm:mb-4">
                <span className="text-2xl sm:text-3xl font-bold text-gray-400 font-copperplate">
                  {tool.name.charAt(0)}
                </span>
              </div> */}
              <span className="text-sm sm:text-base font-semibold text-black text-center font-copperplate">
                {tool.name}
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center text-sm sm:text-base text-gray-500"
        >
          And other widely used 3D virtualization and patternmaking solutions.
        </motion.p>
      </div>
    </section>
  );
}
