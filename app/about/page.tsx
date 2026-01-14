'use client';

import { motion } from 'framer-motion';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Link from 'next/link';
import { Target, Users, Award, Leaf } from 'lucide-react';

export default function AboutPage() {
  const milestones = [
    {
      year: '2015',
      title: 'Founded',
      description: 'virtuality.fashion was founded by fashion tech veterans with one clear goal: make digital fashion practical, scalable, and usable in real product development.'
    },
    {
      year: '2016',
      title: '3D as a Service Pioneer',
      description: 'Among the first teams to offer 3DaaS (3D as a Service), enabling brands to adopt 3D sampling without building in-house operations.'
    },
    {
      year: '2018',
      title: 'Global Scale',
      description: 'Led complex global projects across multiple time zones, producing virtual collections at scale with hundreds of SKUs.'
    },
    {
      year: '2021',
      title: 'Industrial Grade',
      description: 'Completed industrial grade work with thousands of digitized garments, helping teams validate design and fit decisions earlier.'
    },
    {
      year: '2023',
      title: 'AI Integration',
      description: 'Expanded capabilities beyond 3D virtual garments into the convergence of 3D and AI, including AI-generated models.'
    },
    {
      year: 'Today',
      title: 'Curated Marketplace',
      description: 'Evolving into a curated marketplace for proven professionals in digital fashion, 3D visualization, and technical development.'
    }
  ];

  const values = [
    {
      title: 'Execution',
      description: 'We focus on outcomes: faster time to market, fewer physical samples, smarter inventory planning.',
      icon: Target
    },
    {
      title: 'Collaboration',
      description: 'We integrate into the way designers already work, not force a full workflow reset.',
      icon: Users
    },
    {
      title: 'Quality',
      description: 'We keep the bar high by working with experienced, vetted talent who deliver to strict industry standards.',
      icon: Award
    },
    {
      title: 'Sustainability',
      description: 'Every digital sample means less fabric waste and a lower environmental footprint.',
      icon: Leaf
    }
  ];

  const stats = [
    { number: '2015', label: 'Founded' },
    { number: '1000+', label: 'Digitized Garments' },
    { number: '100+', label: 'Global Projects' },
    { number: '50+', label: 'Brand Partners' }
  ];

  const deliverables = [
    'Faster time to market',
    'Fewer physical samples',
    'Smarter inventory planning',
    'Lower environmental footprint'
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.1
      }
    },
    viewport: { once: true }
  };

  const staggerItem = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const }
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 relative overflow-hidden">
        <div className="absolute w-full h-full inset-0 z-0 pointer-events-none">
          <img
            src="/images/6224739.jpg"
            alt="Background pattern"
            className="w-full h-full object-cover"
            style={{ opacity: 0.05 }}
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28 lg:py-36 relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-4 sm:mb-6 md:mb-8 font-copperplate"
          >
            About Us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl leading-relaxed"
          >
            Making digital fashion practical, scalable, and usable in real product development since 2015.
          </motion.p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-20">
          <motion.div
            {...staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-12"
          >
            {stats.map((stat, idx) => (
              <motion.div
                key={idx}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-1 sm:mb-2 md:mb-3">{stat.number}</div>
                <div className="text-gray-400 text-xs sm:text-sm md:text-base uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Story Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28 lg:py-36">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 sm:mb-8 md:mb-10">Our Story</h2>
            <div className="space-y-4 sm:space-y-6 md:space-y-8 text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
              <motion.p {...fadeInUp}>
                virtuality.fashion was founded in 2015 by fashion tech veterans, with one clear goal: make digital fashion practical, scalable, and usable in real product development. We were among the early teams to offer 3D as a Service (3DaaS), so brands could adopt 3D sampling without building an in-house operation or forcing a full workflow reset.
              </motion.p>
              <motion.p {...fadeInUp} transition={{ delay: 0.1 }}>
                Since day one we have built a home for fashion technical designers and 3D specialists who deliver to strict industry standards. Over the years we have led complex global projects and productions across multiple time zones, producing virtual collections at scale with hundreds of SKUs, hard deadlines, and production-level expectations.
              </motion.p>
              <motion.p {...fadeInUp} transition={{ delay: 0.2 }}>
                We have completed industrial grade work with thousands of digitized garments, helping teams validate design and fit decisions earlier, without cutting a single meter of fabric.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Approach Section */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28 lg:py-36">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 lg:gap-24 items-center">
            <motion.div {...fadeInUp}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 sm:mb-8 md:mb-10">Our Approach</h2>
              <div className="space-y-4 sm:space-y-6 md:space-y-8 text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                <p>
                  Our approach is rooted in collaboration and execution. We integrate into the way designers already work, supported by a proprietary workflow and back-office platform, and a cloud-based environment that helps teams align faster across design, development, and production.
                </p>
                <p>
                  When needed, we bring fit expertise into the process, so digital approval translates into reliable production outcomes.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-10 border border-gray-200 shadow-sm"
            >
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-4 sm:mb-6 md:mb-8">What We Deliver</h3>
              <ul className="space-y-3 sm:space-y-4 md:space-y-5">
                {deliverables.map((item, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-center"
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                  >
                    <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-black mr-3 sm:mr-4 md:mr-5 shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base md:text-lg">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28 lg:py-36">
          <motion.h2
            {...fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-8 sm:mb-12 md:mb-16"
          >
            Our Journey
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {milestones.map((milestone, idx) => (
              <motion.div
                key={idx}
                className="border-l-2 border-black pl-4 sm:pl-6 md:pl-8 hover:border-gray-400 transition-colors"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <div className="text-xs sm:text-sm font-bold text-gray-400 mb-2 sm:mb-3 uppercase tracking-wider">{milestone.year}</div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 sm:mb-3 md:mb-4">{milestone.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{milestone.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Evolution Section */}
      <div className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28 lg:py-36">
          <motion.div {...fadeInUp} className="max-w-3xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 sm:mb-8 md:mb-10">Where We&apos;re Going</h2>
            <div className="space-y-4 sm:space-y-6 md:space-y-8 text-sm sm:text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
              <motion.p {...fadeInUp}>
                In recent years we expanded our capabilities beyond 3D virtual garments and virtual showrooms, and into the convergence of 3D and AI, including AI-generated models introduced as part of our platform direction.
              </motion.p>
              <motion.p {...fadeInUp} transition={{ delay: 0.1 }}>
                Today virtuality.fashion is evolving into a curated marketplace for proven professionals in digital fashion, 3D visualization, and technical development. We keep the bar high by working with experienced, vetted talent, and we stay focused on outcomes.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28 lg:py-36">
          <motion.h2
            {...fadeInUp}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-8 sm:mb-12 md:mb-16"
          >
            Our Values
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={idx}
                  className="bg-gray-50 rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 border border-gray-200 hover:border-black hover:shadow-lg transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black rounded-lg sm:rounded-xl flex items-center justify-center mb-4 sm:mb-6">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 sm:mb-3 md:mb-4">{value.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28 lg:py-36 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6 md:mb-8"
          >
            Ready to Work Together?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-10 md:mb-12 max-w-2xl mx-auto px-4"
          >
            Whether you need a single project or an ongoing partnership, our team is ready to help.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center px-4"
          >
            <Link
              href="/team"
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 bg-white text-black rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:bg-gray-100 transition-all hover:scale-105"
            >
              Meet the Team
            </Link>
            <Link
              href="/contact"
              className="w-full sm:w-auto px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 border-2 border-white text-white rounded-lg sm:rounded-xl font-semibold text-sm sm:text-base md:text-lg hover:bg-white hover:text-black transition-all hover:scale-105"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </div>

      <Footer />
    </>
  );
}
