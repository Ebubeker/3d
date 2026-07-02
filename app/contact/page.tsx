'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { createClient } from '@/lib/supabase/client';

function ContactForm() {
  const searchParams = useSearchParams();
  const designerName = searchParams.get('designer');
  const projectName = searchParams.get('project');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
    designer: '',
  });

  const [designers, setDesigners] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch all designers (id and name only, the server resolves designer emails)
  useEffect(() => {
    const fetchDesigners = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('team_members')
        .select('id, name')
        .eq('is_active', true)
        .order('name');

      if (data) {
        setDesigners(data);

        // If designer name provided in URL, pre-select it
        if (designerName) {
          const matchedDesigner = data.find(d => d.name === designerName);
          if (matchedDesigner) {
            setFormData(prev => ({ ...prev, designer: matchedDesigner.name }));
          }
        }
      }
    };

    fetchDesigners();
  }, []);

  // Pre-fill message if designer name and/or project provided
  useEffect(() => {
    if (designerName) {
      const projectRef = projectName ? ` regarding the project "${projectName}"` : '';
      setFormData(prev => ({
        ...prev,
        message: `I'm interested in working with ${designerName}${projectRef}.\n\n`
      }));
    }
  }, [designerName, projectName]);

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [website, setWebsite] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const [isLoading, setIsLoading] = useState(false);

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
    if (!formData.designer.trim()) newErrors.designer = 'Please select a designer';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            company: formData.company,
            message: formData.message,
            designer: formData.designer === 'no-preference' ? '' : formData.designer,
            projectReference: projectName || '',
            formType: 'contact',
            website,
          }),
        });

        const result = await response.json();

        if (result.success) {
          (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer?.push({ event: 'lead_form_submit', form_type: 'contact' });
          setSubmitted(true);
          setFormData({ name: '', email: '', company: '', message: '', designer: '' });
          setWebsite('');
          setTimeout(() => setSubmitted(false), 5000);
        } else {
          console.error("Email Error:", result);
          setErrors({ form: 'Something went wrong. Please try again.' });
        }
      } catch (error) {
        console.error("Email Connection Error:", error);
        setErrors({ form: 'Connection error. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrors(newErrors);
    }
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28 lg:py-32 pt-24 sm:pt-28 md:pt-32 relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-4 sm:mb-6 md:mb-8 font-copperplate">Get in Touch</h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl leading-relaxed">
            Have a project in mind? Let&apos;s discuss how we can help bring your vision to life.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          {submitted ? (
            <div className="text-center py-8 sm:py-12 bg-gray-50 rounded p-6 sm:p-8 border border-gray-200">
              <h2 className="text-2xl sm:text-3xl font-bold text-black mb-3 sm:mb-4">Thank You!</h2>
              <p className="text-gray-700 text-base sm:text-lg">
                We&apos;ve received your message and will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Name */}
              <div>
                <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded font-medium transition-colors text-black text-sm sm:text-base ${
                    errors.name ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-black focus:bg-white'
                  } outline-none`}
                  placeholder="Your Name"
                />
                {errors.name && <p className="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded font-medium transition-colors text-black text-sm sm:text-base ${
                    errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-black focus:bg-white'
                  } outline-none`}
                  placeholder="your@email.com"
                />
                {errors.email && <p className="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2">{errors.email}</p>}
              </div>

              {/* Company */}
              <div>
                <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Company *</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded font-medium transition-colors text-black text-sm sm:text-base ${
                    errors.company ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-black focus:bg-white'
                  } outline-none`}
                  placeholder="Your Company"
                />
                {errors.company && <p className="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2">{errors.company}</p>}
              </div>

              {/* Designer Selection */}
              <div>
                <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Select Designer *</label>
                <select
                  name="designer"
                  value={formData.designer}
                  onChange={handleChange}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded font-medium transition-colors text-black text-sm sm:text-base ${
                    errors.designer ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-black focus:bg-white'
                  } outline-none`}
                >
                  <option value="">Choose a designer...</option>
                  <option value="no-preference">No preference (we&apos;ll match you)</option>
                  {designers.map((designer) => (
                    <option key={designer.id} value={designer.name}>
                      {designer.name}
                    </option>
                  ))}
                </select>
                {errors.designer && <p className="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2">{errors.designer}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="block text-black font-semibold mb-2 sm:mb-3 text-sm sm:text-base">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded font-medium transition-colors resize-none text-black text-sm sm:text-base ${
                    errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-black focus:bg-white'
                  } outline-none`}
                  placeholder="Tell us about your project..."
                />
                {errors.message && <p className="text-red-600 text-xs sm:text-sm mt-1.5 sm:mt-2">{errors.message}</p>}
              </div>

              {/* Error Message */}
              {errors.form && (
                <p className="text-red-600 text-xs sm:text-sm text-center">{errors.form}</p>
              )}

              {/* Honeypot field: hidden from real visitors, bots fill it */}
              <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', height: 0, width: 0, overflow: 'hidden' }}>
                <label>
                  Website
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-6 sm:px-8 py-3 sm:py-4 bg-black text-white rounded font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
              >
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 md:gap-12">
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 sm:mb-3">Response Time</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                We typically respond to inquiries within 24 hours during business days.
              </p>
            </div>
            <div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 sm:mb-3">Project Types</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                From concept to photorealistic renders, game-ready assets to VR experiences.
              </p>
            </div>
            <div className="sm:col-span-2 md:col-span-1">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-black mb-2 sm:mb-3">Confidentiality</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                All project information is kept strictly confidential under NDA.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default function ContactPage() {
  // The fallback is what crawlers without JavaScript (including AI
  // crawlers) receive as the server-rendered page, so it mirrors the
  // real hero content instead of a skeleton.
  return (
    <Suspense fallback={
      <>
        <Header />
        <div className="bg-white border-b border-gray-200 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-16 sm:py-20 md:py-28 lg:py-32 pt-24 sm:pt-28 md:pt-32 relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-black mb-4 sm:mb-6 md:mb-8 font-copperplate">Get in Touch</h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl leading-relaxed">
              Have a project in mind? Let&apos;s discuss how we can help bring your vision to life.
            </p>
            <p className="text-base sm:text-lg text-gray-600 mt-4">
              Request a quote with the form on this page, or email us at info@virtuality.fashion. We typically respond within 24 hours during business days.
            </p>
          </div>
        </div>
        <Footer />
      </>
    }>
      <ContactForm />
    </Suspense>
  );
}
