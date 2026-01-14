'use client';

import { useState } from 'react';

// Web3Forms Access Key
const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || '';

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    queryType: 'pricing',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Prepare form data for Web3Forms
      const formPayload = {
        access_key: WEB3FORMS_ACCESS_KEY,
        name: formData.name,
        email: formData.email,
        company: formData.company,
        queryType: formData.queryType,
        message: formData.message,
        subject: `New Contact Query: ${formData.queryType} from ${formData.name}`,
        from_name: formData.name,
        redirect: '',
      };

      // Send to Web3Forms API
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(formPayload),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        // Reset form after 3 seconds
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            company: '',
            queryType: 'pricing',
            message: '',
          });
          setSubmitted(false);
        }, 3000);
      } else {
        alert('Error submitting form. Please try again.');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      alert('Error submitting form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-black py-20 px-6 relative overflow-hidden">
      {/* Pattern background */}
      <img
        src="/images/6224739.jpg"
        alt="Background pattern"
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-black/40" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get Started Today
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Request a quote, get pricing information, or schedule a demo with our team
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 shadow-xl">
          {submitted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl text-white">✓</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
              <p className="text-gray-600 mb-4">
                Your query has been submitted successfully. Our team will get back to you within 24 hours.
              </p>
              <div className="flex gap-4 justify-center">
                <div className="text-center">
                  <p className="text-sm text-gray-500">Email us at</p>
                  <p className="text-black font-semibold">hello@virtuality.fashion</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-900 font-semibold mb-3">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:bg-white focus:outline-none transition-colors"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-3">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:bg-white focus:outline-none transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Company and Query Type Row */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-900 font-semibold mb-3">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:bg-white focus:outline-none transition-colors"
                    placeholder="Your Brand Co."
                  />
                </div>
                <div>
                  <label className="block text-gray-900 font-semibold mb-3">Query Type *</label>
                  <select
                    name="queryType"
                    value={formData.queryType}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 focus:border-black focus:bg-white focus:outline-none transition-colors"
                  >
                    <option value="pricing">Pricing Information</option>
                    <option value="demo">Schedule a Demo</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="custom">Custom Solution</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-900 font-semibold mb-3">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-400 focus:border-black focus:bg-white focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about your needs and how we can help..."
                ></textarea>
              </div>

              {/* Checkbox */}
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  required
                  className="w-5 h-5 rounded border border-gray-300 bg-gray-50 text-black accent-black cursor-pointer mt-1"
                />
                <label htmlFor="agree" className="text-gray-600 text-sm cursor-pointer">
                  I agree to the privacy policy and terms of service. We&apos;ll get back to you within 24 hours.
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 hover:shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Submit Query'}
              </button>

              {/* Help Text */}
              <p className="text-center text-gray-500 text-sm">
                Prefer to call? Reach us at <span className="text-black font-semibold">+1 (555) 123-4567</span>
              </p>
            </form>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
            <div className="text-4xl mb-3">📧</div>
            <h3 className="text-white font-semibold mb-2">Email</h3>
            <p className="text-gray-300 text-sm">hello@virtuality.fashion</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-white font-semibold mb-2">Phone</h3>
            <p className="text-gray-300 text-sm">+1 (555) 123-4567</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 text-center hover:bg-white/20 transition-all">
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="text-white font-semibold mb-2">Live Chat</h3>
            <p className="text-gray-300 text-sm">Available 9 AM - 6 PM EST</p>
          </div>
        </div>
      </div>
    </section>
  );
}
