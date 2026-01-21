'use client';

import { useState } from 'react';
import { Users, Briefcase, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import JoinTeamModal from '../JoinTeamModal';

export default function JoinTeamSection() {
  const [showModal, setShowModal] = useState(false);

  const benefits = [
    {
      icon: Globe,
      title: 'Work Remotely',
      description: 'Join projects from anywhere in the world with flexible hours'
    },
    {
      icon: Briefcase,
      title: 'Quality Projects',
      description: 'Work with leading fashion brands on exciting design challenges'
    },
    {
      icon: Users,
      title: 'Growing Network',
      description: 'Connect with talented professionals in the digital fashion space'
    }
  ];

  const roles = [
    '3D Fashion Designers',
    'Technical Designers',
    'Patternmakers',
    '3D Visualization Specialists',
    'Collection Developers',
    'Knitwear Specialists'
  ];

  return (
    <>
      <section className="bg-black text-white py-16 sm:py-20 md:py-24 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16">
            <span className="inline-block px-4 py-2 bg-white/10 rounded-full text-sm font-medium mb-4">
              We&apos;re Hiring
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Join Our Global Team
            </h2>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Are you a talented fashion professional? Join our curated network of designers
              and work with leading brands worldwide.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-white/10 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm sm:text-base">{benefit.description}</p>
                </div>
              );
            })}
          </div>

          {/* Roles We're Looking For */}
          <div className="bg-white/5 rounded-2xl p-6 sm:p-8 md:p-10 border border-white/10 mb-10 sm:mb-12">
            <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-center">
              We&apos;re Looking For
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {roles.map((role, index) => (
                <div key={index} className="flex items-center gap-2 text-sm sm:text-base">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 shrink-0" />
                  <span className="text-gray-300">{role}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl font-semibold hover:bg-gray-100 transition-colors text-base sm:text-lg"
            >
              Apply to Join
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-4 text-gray-400 text-sm">
              Simple application process. We&apos;ll get back to you within 48 hours.
            </p>
          </div>
        </div>
      </section>

      <JoinTeamModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
