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
    portfolioLinks: [''],
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [website, setWebsite] = useState('');

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
            website,
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
    setWebsite('');
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
                href="https://app.hubspot.com/meetings/amnon2"
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
                        className={`w-full px-4 py-3 border-2 rounded-lg text-black ${
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
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:border-black outline-none transition-colors resize-none"
                    placeholder="Tell us briefly about your experience..."
                  />
                </div>

                {/* Error Message */}
                {errors.form && (
                  <p className="text-red-600 text-sm text-center">{errors.form}</p>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
