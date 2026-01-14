'use client';

import { useState } from 'react';
import { X, Calendar } from 'lucide-react';

interface JoinTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinTeamModal({ isOpen, onClose }: JoinTeamModalProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    roleSpecialty: '',
    portfolioLink: '',
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUrl = (url: string) => {
    if (!url) return true; // Optional field
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
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
    if (formData.portfolioLink && !validateUrl(formData.portfolioLink)) {
      newErrors.portfolioLink = 'Please enter a valid URL';
    }

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
            fullName: formData.fullName,
            email: formData.email,
            roleSpecialty: formData.roleSpecialty,
            portfolioLink: formData.portfolioLink,
            message: formData.message,
            subject: "New Team Application - Virtuality Fashion",
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSubmitted(true);
        } else {
          console.error("Web3Forms Error:", result);
          setErrors({ form: 'Something went wrong. Please try again.' });
        }
      } catch (error) {
        console.error("Web3Forms Connection Error:", error);
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
      portfolioLink: '',
      message: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-black mb-3">Application Received!</h2>
              <p className="text-gray-600 mb-6">
                Thanks for your interest! Book a short interview to complete your application.
              </p>
              <a
                href="https://calendly.com/amnon-vf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors mb-4"
              >
                <Calendar className="w-5 h-5" />
                Book an Interview
              </a>
              <button
                onClick={handleReset}
                className="block mx-auto text-gray-500 hover:text-black text-sm transition-colors"
              >
                Close this window
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                  Join the Team
                </h2>
                <p className="text-gray-600">
                  Introduce yourself and book a short interview.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg text-black ${
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
                    className={`w-full px-4 py-3 border-2 rounded-lg text-black ${
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
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:border-black outline-none transition-colors"
                  >
                    <option value="">Select your specialty</option>
                    <option value="technical-designer">Technical Designer</option>
                    <option value="3d-fashion-designer">3D Fashion Designer</option>
                    <option value="patternmaker">Patternmaker</option>
                    <option value="collection-developer">Collection Developer</option>
                    <option value="3d-visualization-specialist">3D Visualization Specialist</option>
                    <option value="knitwear-specialist">Knitwear Specialist</option>
                    <option value="footwear-designer">Footwear Designer</option>
                    <option value="accessories-designer">Accessories Designer</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                {/* Portfolio Link */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Portfolio Link</label>
                  <input
                    type="url"
                    name="portfolioLink"
                    value={formData.portfolioLink}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg text-black ${
                      errors.portfolioLink ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'
                    } outline-none transition-colors`}
                    placeholder="https://your-portfolio.com"
                  />
                  {errors.portfolioLink && <p className="text-red-600 text-sm mt-1">{errors.portfolioLink}</p>}
                </div>

                {/* Short Message */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Short Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:border-black outline-none transition-colors resize-none"
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
                  className="w-full px-6 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Submitting...' : 'Submit Application'}
                </button>

                {/* Calendly Link */}
                <div className="text-center">
                  <span className="text-gray-500 text-sm">or</span>
                  <a
                    href="https://calendly.com/amnon-vf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 mt-3 text-black font-medium hover:underline"
                  >
                    <Calendar className="w-4 h-4" />
                    Book an interview directly
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
