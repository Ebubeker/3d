'use client';

import { useState } from 'react';
import { Calendar, Briefcase, DollarSign, Globe, CheckCircle, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function JoinTeamPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    roleSpecialty: '',
    portfolioLinks: [''],
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleLinkChange = (index: number, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.portfolioLinks];
      updated[index] = value;
      return { ...prev, portfolioLinks: updated };
    });
    if (errors.portfolioLinks) {
      setErrors((prev) => ({ ...prev, portfolioLinks: '' }));
    }
  };

  const addLink = () => {
    if (formData.portfolioLinks.length < 5) {
      setFormData((prev) => ({ ...prev, portfolioLinks: [...prev.portfolioLinks, ''] }));
    }
  };

  const removeLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      portfolioLinks: prev.portfolioLinks.filter((_, i) => i !== index)
    }));
  };

  const normalizeUrl = (url: string): string => {
    const trimmed = url.trim();
    if (!trimmed) return '';
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  };

  const validateUrl = (url: string) => {
    if (!url.trim()) return true;
    try {
      new URL(normalizeUrl(url));
      return true;
    } catch {
      return false;
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    const filledLinks = formData.portfolioLinks.filter(l => l.trim());
    for (const link of filledLinks) {
      if (!validateUrl(link)) {
        newErrors.portfolioLinks = 'One or more links are invalid';
        break;
      }
    }

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const normalizedLinks = filledLinks.map(normalizeUrl).filter(Boolean);

        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.fullName,
            email: formData.email,
            company: '',
            role: formData.roleSpecialty,
            notes: normalizedLinks.join('\n'),
            message: formData.message,
            formType: 'join-team',
          }),
        });

        const result = await response.json();

        if (result.success) {
          (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer?.push({ event: 'lead_form_submit', form_type: 'join-team' });
          setSubmitted(true);
        } else {
          console.error('Email Error:', result);
          setErrors({ form: 'Something went wrong. Please try again.' });
        }
      } catch (error) {
        console.error('Connection Error:', error);
        setErrors({ form: 'Connection error. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      fullName: '',
      email: '',
      roleSpecialty: '',
      portfolioLinks: [''],
      message: ''
    });
  };

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black mb-6">
            Join the Team
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Become part of our global network of fashion technical designers and work with leading brands worldwide.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">Ready to Join?</h2>
            <p className="text-lg text-gray-600">
              Become part of the marketplace community.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <div className="flex justify-center mb-6">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">Application Received!</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Thanks for your interest! Book a short interview to complete your application.
              </p>
              <a
                href="https://app.hubspot.com/meetings/amnon2"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors mb-6"
              >
                <Calendar className="w-5 h-5" />
                Book an Interview
              </a>
              <button
                onClick={handleReset}
                className="block mx-auto text-gray-500 hover:text-black text-sm transition-colors"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-bold text-black mb-2">
                  Quick Application
                </h3>
                <p className="text-gray-600">
                  Introduce yourself and book a short interview.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-black bg-white ${
                      errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'
                    } outline-none transition-colors`}
                    placeholder="Your Full Name"
                  />
                  {errors.fullName && <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-black bg-white ${
                      errors.email ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'
                    } outline-none transition-colors`}
                    placeholder="your@email.com"
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Role / Specialty */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Role / Specialty</label>
                  <select
                    name="roleSpecialty"
                    value={formData.roleSpecialty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black bg-white focus:border-black outline-none transition-colors"
                  >
                    <option value="">Select your specialty</option>
                    <option value="Technical Designer">Technical Designer</option>
                    <option value="3D Fashion Designer">3D Fashion Designer</option>
                    <option value="Patternmaker">Patternmaker</option>
                    <option value="Collection Developer">Collection Developer</option>
                    <option value="3D Visualization Specialist">3D Visualization Specialist</option>
                    <option value="Knitwear Specialist">Knitwear Specialist</option>
                    <option value="Footwear Designer">Footwear Designer</option>
                    <option value="Accessories Designer">Accessories Designer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Portfolio Links */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Portfolio Links</label>
                  <p className="text-xs text-gray-500 mb-2">Google Drive, Behance, personal website, etc.</p>
                  {formData.portfolioLinks.map((link, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={link}
                        onChange={(e) => handleLinkChange(index, e.target.value)}
                        className={`w-full px-4 py-3 border-2 rounded-xl text-black bg-white ${
                          errors.portfolioLinks ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'
                        } outline-none transition-colors`}
                        placeholder="drive.google.com/... or your-portfolio.com"
                      />
                      {formData.portfolioLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLink(index)}
                          className="px-3 py-3 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {formData.portfolioLinks.length < 5 && (
                    <button
                      type="button"
                      onClick={addLink}
                      className="text-sm text-gray-500 hover:text-black transition-colors mt-1"
                    >
                      + Add another link
                    </button>
                  )}
                  {errors.portfolioLinks && <p className="text-red-600 text-sm mt-1">{errors.portfolioLinks}</p>}
                </div>

                {/* Short Message */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Short Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-black bg-white focus:border-black outline-none transition-colors resize-none"
                    placeholder="Tell us briefly about your experience..."
                  />
                </div>

                {/* Error Message */}
                {errors.form && (
                  <p className="text-red-600 text-sm text-center">{errors.form}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>

                {/* Calendly Link */}
                <div className="text-center pt-4 border-t border-gray-200">
                  <span className="text-gray-500 text-sm">or skip the form</span>
                  <a
                    href="https://app.hubspot.com/meetings/amnon2"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 mt-3 text-black font-medium hover:underline"
                  >
                    <Calendar className="w-4 h-4" />
                    Book an interview directly
                  </a>
                </div>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl font-bold text-black mb-4">Who is virtuality.fashion?</h2>
              <p className="text-gray-600 leading-relaxed">
                Founded in 2016 to connect fashion brands with top-level professionals who turn ideas into production-ready assets. We&apos;re a global team of vetted freelancers across technical design, tech packs, 3D visualization, and digital product development.
              </p>
            </div>
            <div className="space-y-6">
              <div className="border-l-4 border-black pl-5">
                <p className="font-semibold text-black text-lg">
                  &quot;Back to basics. Strong foundations. Digital tools as enablers, not shortcuts.&quot;
                </p>
              </div>
              <p className="text-gray-600 leading-relaxed">
                Today, we&apos;re evolving into a curated marketplace for professionals who understand both design and execution, delivering assets that move products forward.
              </p>
              <p className="font-bold text-black">
                We are building a marketplace for the best in the industry.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-black mb-12 text-center">Why Join Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Premium Projects</h3>
              <p className="text-gray-600">
                Work with established fashion brands including Adidas, Under Armour, and more.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Competitive Rates</h3>
              <p className="text-gray-600">
                Earn competitive hourly rates based on your skills and experience level.
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-black mb-3">Work Remotely</h3>
              <p className="text-gray-600">
                Flexible remote work from anywhere in the world. Set your own schedule.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
