'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../components/Header';
import Footer from '../components/Footer';
import EnterpriseForm from '../components/EnterpriseForm';
import JoinTeamModal from '../components/JoinTeamModal';
import { MapPin, Globe, ChevronDown, ChevronUp } from 'lucide-react';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  location: string;
  languages: string[];
  specialties: string[];
  tools: string[];
  bio: string;
  portrait: string;
  portfolio: {
    id: string;
    thumbnail: string;
    title: string;
  }[];
}

export default function TeamPage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [showEnterpriseForm, setShowEnterpriseForm] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [expandedBio, setExpandedBio] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    projectType: '',
    volume: '',
    timeline: '',
    message: '',
    consent: false
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Check if user already has access
  useEffect(() => {
    const access = localStorage.getItem('teamAccess');
    if (access === 'granted') {
      setHasAccess(true);
    }
  }, []);

  // Team members data with new structure
  const teamMembers: TeamMember[] = [
    {
      id: 1,
      name: 'Sarah Chen',
      role: '3D Fashion Designer',
      location: 'United States',
      languages: ['English', 'Mandarin'],
      specialties: ['Womenswear', 'Sportswear', 'Activewear'],
      tools: ['CLO3D', 'Browzwear', 'Adobe Illustrator'],
      bio: 'Senior 3D fashion designer with 5+ years of experience in virtual prototyping and digital sampling. Specialized in sportswear and activewear categories with expertise in fit simulation and materials visualization.',
      portrait: '/images/team/sarah-chen.jpg',
      portfolio: [
        { id: 'p1', title: 'Summer Collection 2024', thumbnail: '/placeholder.jpg' },
        { id: 'p2', title: 'Athleisure Line', thumbnail: '/placeholder.jpg' },
        { id: 'p3', title: 'Activewear Range', thumbnail: '/placeholder.jpg' }
      ]
    },
    {
      id: 2,
      name: 'Marco Rossi',
      role: 'Technical Designer',
      location: 'Italy',
      languages: ['English', 'Italian'],
      specialties: ['Menswear', 'Tailoring', 'Outerwear'],
      tools: ['Optitex', 'Adobe Illustrator', 'Gerber'],
      bio: 'Technical designer specialized in menswear and tailoring. Expert in creating production-ready tech packs with precise measurements and construction details for high-end fashion brands.',
      portrait: '/images/team/marco-rossi.jpg',
      portfolio: [
        { id: 'p4', title: 'Outerwear Tech Packs', thumbnail: '/placeholder.jpg' },
        { id: 'p5', title: 'Tailored Suiting Line', thumbnail: '/placeholder.jpg' },
        { id: 'p6', title: 'Formal Wear Patterns', thumbnail: '/placeholder.jpg' }
      ]
    },
    {
      id: 3,
      name: 'Aisha Kumar',
      role: '3D Visualization Specialist',
      location: 'India',
      languages: ['English', 'Hindi'],
      specialties: ['Womenswear', 'Lingerie', 'Swimwear'],
      tools: ['Browzwear', 'Style3D', 'Adobe Photoshop'],
      bio: 'Visualization specialist focused on creating photorealistic renders and e-commerce visuals. Expertise in materials simulation and virtual model imagery for product pages.',
      portrait: '/images/team/aisha-kumar.jpg',
      portfolio: [
        { id: 'p7', title: 'Luxury Brand Renders', thumbnail: '/placeholder.jpg' },
        { id: 'p8', title: 'Swimwear Visualization', thumbnail: '/placeholder.jpg' },
        { id: 'p9', title: 'Virtual Showroom', thumbnail: '/placeholder.jpg' }
      ]
    },
    {
      id: 4,
      name: 'Lucas Silva',
      role: 'Collection Developer',
      location: 'Brazil',
      languages: ['English', 'Portuguese', 'Spanish'],
      specialties: ['Streetwear', 'Denim', 'Kidswear'],
      tools: ['CLO3D', 'Marvelous Designer', 'Adobe Illustrator'],
      bio: 'Collection developer with a strong background in streetwear and denim categories. Helps brands plan and execute collections from concept to production-ready deliverables.',
      portrait: '/images/team/lucas-silva.jpg',
      portfolio: [
        { id: 'p10', title: 'Fall/Winter 2024', thumbnail: '/placeholder.jpg' },
        { id: 'p11', title: 'Streetwear Capsule', thumbnail: '/placeholder.jpg' },
        { id: 'p12', title: 'Denim Collection', thumbnail: '/placeholder.jpg' }
      ]
    },
    {
      id: 5,
      name: 'Emma Thompson',
      role: 'Patternmaker',
      location: 'United Kingdom',
      languages: ['English', 'French'],
      specialties: ['Womenswear', 'Knitwear', 'Outdoor'],
      tools: ['Optitex', 'Lectra', 'Shima Seiki'],
      bio: 'Senior patternmaker with 8+ years of experience in digital pattern development. Specialized in knitwear and outdoor categories with expertise in grading and fit optimization.',
      portrait: '/images/team/emma-thompson.jpg',
      portfolio: [
        { id: 'p13', title: 'Premium Knitwear', thumbnail: '/placeholder.jpg' },
        { id: 'p14', title: 'Outdoor Jackets', thumbnail: '/placeholder.jpg' },
        { id: 'p15', title: 'Technical Outerwear', thumbnail: '/placeholder.jpg' }
      ]
    },
    {
      id: 6,
      name: 'Hiroshi Tanaka',
      role: '3D Fashion Designer',
      location: 'Japan',
      languages: ['English', 'Japanese'],
      specialties: ['Menswear', 'Sportswear', 'Footwear'],
      tools: ['CLO3D', 'Marvelous Designer', 'Style3D'],
      bio: 'Digital fashion artist pushing the boundaries of 3D design. Creates innovative virtual prototypes and concept visualizations for avant-garde and sportswear brands.',
      portrait: '/images/team/hiroshi-tanaka.jpg',
      portfolio: [
        { id: 'p16', title: 'Avant-Garde Collection', thumbnail: '/placeholder.jpg' },
        { id: 'p17', title: 'Digital Fashion Week', thumbnail: '/placeholder.jpg' },
        { id: 'p18', title: 'Concept Footwear', thumbnail: '/placeholder.jpg' }
      ]
    }
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.projectType) newErrors.projectType = 'Please select a project type';
    if (!formData.consent) newErrors.consent = 'You must agree to the privacy policy';

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
            ...formData,
            subject: "New Team Access Request - Virtuality Fashion",
          }),
        });

        const result = await response.json();

        if (result.success) {
          localStorage.setItem('teamAccess', 'granted');
          localStorage.setItem('clientData', JSON.stringify(formData));
          setHasAccess(true);
          setSubmitted(true);
        } else {
          console.error("Web3Forms Error:", result);
          setErrors({ form: 'Something went wrong. Please try again.' });
        }
      } catch (error) {
        console.error("Web3Forms Connection Error:", error);
        setErrors({ form: 'Connection error. Please try again.' });
      }
    } else {
      setErrors(newErrors);
    }
  };

  const toggleBio = (id: number) => {
    setExpandedBio(expandedBio === id ? null : id);
  };

  return (
    <>
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute w-full h-full inset-0 z-0 pointer-events-none">
          <img
            src="/images/6224739.jpg"
            alt="Background pattern"
            className="w-full h-full object-cover"
            style={{ opacity: 0.05 }}
          />
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-32 relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-4 sm:mb-6 md:mb-8 animate-fade-in-up font-copperplate">Meet the Team</h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 max-w-2xl animate-fade-in-up delay-200 mb-6 sm:mb-8" style={{ animationFillMode: 'both' }}>
            {hasAccess
              ? 'Our vetted Fashion Technical Designers ready to bring your vision to life.'
              : 'Unlock access to our marketplace of vetted Fashion Technical Designers.'}
          </p>

          {/* CTAs - Only show when has access */}
          {hasAccess && (
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 animate-fade-in-up delay-300" style={{ animationFillMode: 'both' }}>
              <button
                onClick={() => setShowEnterpriseForm(true)}
                className="w-full sm:w-auto px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm sm:text-base"
              >
                Enterprise
              </button>
              <button
                onClick={() => setShowJoinModal(true)}
                className="w-full sm:w-auto px-6 py-3 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors text-sm sm:text-base"
              >
                Join the Team
              </button>
              <p className="w-full text-xs sm:text-sm text-gray-500 mt-2">
                Get a tailored quote and a curated team for your project.
              </p>
            </div>
          )}
        </div>
      </div>

      {!hasAccess ? (
        <>
          {/* Blurred Team Grid */}
          <div className="bg-gray-50 border-b border-gray-200 relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 blur-md pointer-events-none select-none">
                {teamMembers.map((member) => (
                  <div key={member.id} className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-200">
                    <div className="aspect-square bg-gray-200 rounded-full mb-4 sm:mb-6"></div>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-1">{member.name}</h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-1">{member.role}</p>
                    <p className="text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">{member.location}</p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {member.tools.slice(0, 3).map((tool, index) => (
                        <span key={index} className="px-2 sm:px-3 py-1 bg-gray-100 text-gray-700 text-xs sm:text-sm rounded">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Overlay with unlock message */}
            <div className="absolute inset-0 flex items-center justify-center bg-white/30 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md text-center border-2 border-black mx-4">
                <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔒</div>
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">Access Required</h2>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
                  Submit your project details below to unlock full access to our team of designers.
                </p>
                <a href="#unlock-form" className="px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded font-medium hover:bg-gray-900 transition-colors inline-block text-sm sm:text-base">
                  Unlock Access
                </a>
              </div>
            </div>
          </div>

          {/* Unlock Form */}
          <div id="unlock-form" className="bg-white">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-3 sm:mb-4">Get Access to Our Team</h2>
                <p className="text-base sm:text-lg text-gray-700">
                  Tell us about your project and we&apos;ll unlock the full team marketplace for you.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded font-medium transition-colors text-black ${
                      errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-black focus:bg-white'
                    } outline-none`}
                    placeholder="Your Name"
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-2">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded font-medium transition-colors text-black ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-black focus:bg-white'
                    } outline-none`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
                </div>

                {/* Company */}
                <div>
                  <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Company *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded font-medium transition-colors text-black ${
                      errors.company ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-black focus:bg-white'
                    } outline-none`}
                    placeholder="Your Company"
                  />
                  {errors.company && <p className="text-red-600 text-sm mt-2">{errors.company}</p>}
                </div>

                {/* Project Type */}
                <div>
                  <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Type of Project *</label>
                  <select
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded font-medium transition-colors text-black ${
                      errors.projectType ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-black focus:bg-white'
                    } outline-none`}
                  >
                    <option value="">Select project type</option>
                    <option value="2d-flats">2D Technical Flats</option>
                    <option value="3d-simulation">3D Fashion Simulation</option>
                    <option value="digital-samples">Digital Sample Creation</option>
                    <option value="collection-dev">Collection Development</option>
                    <option value="tech-packs">Tech Pack Preparation</option>
                    <option value="full-service">Full Service Design</option>
                  </select>
                  {errors.projectType && <p className="text-red-600 text-sm mt-2">{errors.projectType}</p>}
                </div>

                {/* Estimated Volume */}
                <div>
                  <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Estimated Volume</label>
                  <input
                    type="text"
                    name="volume"
                    value={formData.volume}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-gray-50 rounded font-medium focus:border-black focus:bg-white outline-none transition-colors text-black"
                    placeholder="e.g., 50 designs per month"
                  />
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Timeline</label>
                  <input
                    type="text"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-gray-50 rounded font-medium focus:border-black focus:bg-white outline-none transition-colors text-black"
                    placeholder="e.g., 2-3 months"
                  />
                </div>

                {/* Additional Details */}
                <div>
                  <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Additional Details</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-300 bg-gray-50 rounded font-medium resize-none focus:border-black focus:bg-white outline-none transition-colors text-black"
                    placeholder="Tell us more about your project..."
                  />
                </div>

                {/* Consent Checkbox */}
                <div>
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <span className="text-sm text-gray-700">
                      I agree to the processing of my personal data in accordance with the{' '}
                      <a href="/privacy" className="text-black font-semibold underline">Privacy Policy</a> and consent to being contacted about my project.
                    </span>
                  </label>
                  {errors.consent && <p className="text-red-600 text-sm mt-2">{errors.consent}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-8 py-4 bg-black text-white rounded font-semibold hover:bg-gray-900 transition-colors"
                >
                  Unlock Team Access
                </button>
              </form>
            </div>
          </div>
        </>
      ) : (
        /* Full Team Grid (After Unlock) */
        <div className="bg-gray-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-12 sm:py-16 md:py-24 lg:py-32">
            {submitted && (
              <div className="mb-8 sm:mb-12 md:mb-16 text-center py-6 sm:py-8 md:py-10 px-4 bg-white rounded-2xl sm:rounded-3xl border-2 border-black animate-scale-in shadow-lg">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-black mb-2 sm:mb-3">Access Granted!</h2>
                <p className="text-gray-700 text-sm sm:text-base md:text-lg">You can now view and contact our team members.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 md:p-6 border border-gray-200 hover:border-black hover:shadow-2xl transition-all duration-500 animate-fade-in-up flex flex-col"
                  style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
                >
                  {/* Portrait */}
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl sm:rounded-2xl mb-4 sm:mb-5 flex items-center justify-center overflow-hidden">
                    {member.portrait && member.portrait !== '/placeholder.jpg' ? (
                      <Image
                        src={member.portrait}
                        alt={member.name}
                        width={200}
                        height={200}
                        className="w-full h-full object-cover grayscale"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-4xl font-bold text-gray-500">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Name and Role */}
                  <h3 className="text-lg sm:text-xl font-bold text-black mb-1">{member.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-2 sm:mb-3">{member.role}</p>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">
                    <MapPin className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{member.location}</span>
                  </div>

                  {/* Languages */}
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                    <div className="flex flex-wrap gap-1">
                      {member.languages.map((lang, idx) => (
                        <span key={idx} className="text-[10px] sm:text-xs text-gray-600 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded">
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Specialties */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">Specialties</p>
                    <div className="flex flex-wrap gap-1">
                      {member.specialties.map((specialty, idx) => (
                        <span key={idx} className="text-[10px] sm:text-xs text-black bg-gray-100 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tools */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">Tools</p>
                    <div className="flex flex-wrap gap-1">
                      {member.tools.map((tool, idx) => (
                        <span key={idx} className="text-[10px] sm:text-xs text-gray-700 bg-gray-50 border border-gray-200 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-lg">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bio */}
                  <div className="mb-3 sm:mb-4 flex-grow">
                    <p className={`text-xs sm:text-sm text-gray-600 leading-relaxed ${expandedBio !== member.id ? 'line-clamp-3' : ''}`}>
                      {member.bio}
                    </p>
                    {member.bio.length > 120 && (
                      <button
                        onClick={() => toggleBio(member.id)}
                        className="text-[10px] sm:text-xs text-gray-500 hover:text-black mt-1 flex items-center gap-1"
                      >
                        {expandedBio === member.id ? (
                          <>Show less <ChevronUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /></>
                        ) : (
                          <>Read more <ChevronDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" /></>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Portfolio Preview */}
                  <div className="mb-4 sm:mb-5">
                    <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">Portfolio</p>
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      {member.portfolio.slice(0, 3).map((item) => (
                        <div key={item.id} className="aspect-square bg-gray-100 rounded-md sm:rounded-lg overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
                    <Link
                      href={`/contact?designer=${encodeURIComponent(member.name)}`}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 bg-black text-white rounded-lg sm:rounded-xl font-semibold text-center text-xs sm:text-sm hover:bg-gray-800 transition-colors"
                    >
                      Get Quote
                    </Link>
                    <Link
                      href={`/team/${member.id}`}
                      className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-black text-black rounded-lg sm:rounded-xl font-semibold text-center text-xs sm:text-sm hover:bg-black hover:text-white transition-colors"
                    >
                      View Portfolio
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="mt-10 sm:mt-12 md:mt-16 text-center">
              <button
                onClick={() => setShowJoinModal(true)}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-colors text-sm sm:text-base"
              >
                Join the Team
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Modals */}
      <EnterpriseForm
        isOpen={showEnterpriseForm}
        onClose={() => setShowEnterpriseForm(false)}
      />
      <JoinTeamModal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
      />
    </>
  );
}
