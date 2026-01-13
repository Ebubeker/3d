'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    if (Object.keys(newErrors).length === 0) {
      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <>
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 md:px-12 py-24 md:py-32">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-4">
            Contact Us
          </p>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-black mb-8 font-copperplate">Get in Touch</h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl leading-relaxed">
            Have a project in mind? Let&apos;s discuss how we can help bring your vision to life.
          </p>
        </div>
      </div>

      {/* Contact Form Section */}
      <div className="bg-white">
        <div className="max-w-2xl mx-auto px-6 py-20">
          {submitted ? (
            <div className="text-center py-12 bg-gray-50 rounded p-8 border border-gray-200">
              <h2 className="text-3xl font-bold text-black mb-4">Thank You!</h2>
              <p className="text-gray-700 text-lg">
                We&apos;ve received your message and will get back to you within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-black font-semibold mb-3">Name *</label>
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
                <label className="block text-black font-semibold mb-3">Email *</label>
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
                <label className="block text-black font-semibold mb-3">Company *</label>
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

              {/* Message */}
              <div>
                <label className="block text-black font-semibold mb-3">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className={`w-full px-4 py-3 border-2 rounded font-medium transition-colors resize-none text-black ${
                    errors.message ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 focus:border-black focus:bg-white'
                  } outline-none`}
                  placeholder="Tell us about your project..."
                />
                {errors.message && <p className="text-red-600 text-sm mt-2">{errors.message}</p>}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full px-8 py-4 bg-black text-white rounded font-semibold hover:bg-gray-900 transition-colors"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <h3 className="text-2xl font-bold text-black mb-3">Response Time</h3>
              <p className="text-gray-700">
                We typically respond to inquiries within 24 hours during business days.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black mb-3">Project Types</h3>
              <p className="text-gray-700">
                From concept to photorealistic renders, game-ready assets to VR experiences.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-black mb-3">Confidentiality</h3>
              <p className="text-gray-700">
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
