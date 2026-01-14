'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Home,
  Box,
  Users,
  Mail,
  Menu,
  X,
  Info
} from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Solutions', href: '/solutions', icon: Box },
    { name: 'Team', href: '/team', icon: Users },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Mail },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'py-3 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-200/50' 
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-50">
          <img
            src="/images/logo.png"
            alt="Virtuality Fashion"
            className="h-10 sm:h-11 md:h-12 w-auto"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className={`hidden md:flex items-center gap-1 px-2 py-1.5 transition-all duration-300 ${
          scrolled
            ? ''
            : 'bg-white/50 backdrop-blur-sm rounded-full border border-gray-200/50 shadow-sm'
        }`}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-black transition-all duration-200 group relative overflow-hidden ${
                  scrolled ? 'hover:bg-gray-100 rounded-lg' : 'hover:bg-white rounded-full'
                }`}
              >
                <Icon className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden relative z-50 p-2 text-gray-600 hover:text-black transition-colors"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-white md:hidden flex flex-col items-center justify-center"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            position: 'fixed',
            width: '100vw',
            height: '100vh'
          }}
        >
          {/* Close button inside overlay */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 p-2 text-gray-600 hover:text-black transition-colors"
            style={{ zIndex: 10000 }}
          >
            <X className="w-6 h-6" />
          </button>

          <nav className="flex flex-col gap-6 w-full max-w-xs px-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 text-xl font-medium text-gray-600 hover:text-black transition-colors p-2 rounded-xl hover:bg-gray-50"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
