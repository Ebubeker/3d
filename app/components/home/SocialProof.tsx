'use client';

import { motion } from 'framer-motion';

export default function SocialProof() {
  const clients = [
    { name: "Under Armour" },
    { name: "Armani" },
    { name: "Nike" },
    { name: "Zara" },
    { name: "H&M" }
  ];

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: {
      opacity: 0.5,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1] as const
      }
    }
  };

  return (
    <section className="bg-white border-y border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-center text-sm uppercase tracking-wide text-gray-500 mb-8"
        >
          Trusted by leading fashion brands
        </motion.p>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center"
        >
          {clients.map((client) => (
            <motion.div
              key={client.name}
              variants={itemVariants}
              whileHover={{ opacity: 1 }}
              className="flex items-center justify-center hover:opacity-100 transition-opacity"
            >
              <div className="bg-gray-200 h-16 w-32 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500 font-semibold">{client.name}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
