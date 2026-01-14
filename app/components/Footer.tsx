import Link from 'next/link';
import { Instagram, Linkedin, Facebook } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Solutions', href: '/solutions' },
    { name: 'Team', href: '/team' },
    { name: 'Contact', href: '/contact' },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' },
  ];

  const socialLinks = [
    { name: 'Instagram', href: 'https://www.instagram.com/virtuality.fashion/', icon: Instagram },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/virtuality-fashion/?viewAsMember=true', icon: Linkedin },
    { name: 'Facebook', href: 'https://www.facebook.com/virtuality.fashion', icon: Facebook },
  ];

  return (
    <footer className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-8 md:gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-2 md:col-span-2">
            <Link href="/">
              <img
                src="/images/logo.png"
                alt="Virtuality.Fashion"
                className="h-10 sm:h-12 md:h-14 w-auto"
              />
            </Link>
            <p className="mt-3 sm:mt-4 text-gray-500 text-xs sm:text-sm max-w-xs">
              Transforming fashion design with cutting-edge 3D technology and digital solutions.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-black hover:text-white transition-all duration-300"
                    aria-label={social.name}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Navigation</h3>
            <nav className="flex flex-col gap-2 sm:gap-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-black transition-colors text-xs sm:text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
            <nav className="flex flex-col gap-2 sm:gap-3">
              {legalLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-gray-600 hover:text-black transition-colors text-xs sm:text-sm"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 sm:col-span-1">
            <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Contact</h3>
            <div className="flex flex-col gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
              <p>amnon@virtuality.fashion</p>
              <p>+972 73-374-4885</p>
              <p>Israel</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 sm:mt-10 md:mt-12 pt-6 sm:pt-8">
          <p className="text-gray-500 text-xs sm:text-sm text-center">
            © {currentYear} Virtuality.Fashion. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}