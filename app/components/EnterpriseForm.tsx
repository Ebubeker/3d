'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface EnterpriseFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EnterpriseForm({ isOpen, onClose }: EnterpriseFormProps) {
  const [formData, setFormData] = useState({
    company: '',
    name: '',
    email: '',
    role: '',
    projectType: '',
    category: '',
    deliverables: {
      techPacks: false,
      prototyping: false,
      productVisuals: false
    },
    timeline: '',
    notes: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith('deliverables.')) {
      const deliverableKey = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        deliverables: {
          ...prev.deliverables,
          [deliverableKey]: checked
        }
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (Object.keys(newErrors).length === 0) {
      setIsLoading(true);
      try {
        const deliverablesText = Object.entries(formData.deliverables)
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(', ');

        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY,
            company: formData.company,
            name: formData.name,
            email: formData.email,
            role: formData.role,
            projectType: formData.projectType,
            category: formData.category,
            deliverables: deliverablesText,
            timeline: formData.timeline,
            notes: formData.notes,
            subject: "Enterprise Quote Request - Virtuality Fashion",
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSubmitted(true);
          setTimeout(() => {
            setSubmitted(false);
            onClose();
            setFormData({
              company: '',
              name: '',
              email: '',
              role: '',
              projectType: '',
              category: '',
              deliverables: {
                techPacks: false,
                prototyping: false,
                productVisuals: false
              },
              timeline: '',
              notes: ''
            });
          }, 3000);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>

        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✓</div>
              <h2 className="text-2xl font-bold text-black mb-2">Request Submitted!</h2>
              <p className="text-gray-600">We&apos;ll get back to you with a tailored quote shortly.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                  Enterprise Quote Request
                </h2>
                <p className="text-gray-600">
                  Get a tailored quote and a curated team for your project.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Subject: Enterprise quote and team build request
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Company */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Company *</label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-black ${
                        errors.company ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'
                      } outline-none transition-colors`}
                      placeholder="Your Company"
                    />
                    {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 border-2 rounded-lg text-black ${
                        errors.name ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-black'
                      } outline-none transition-colors`}
                      placeholder="Your Name"
                    />
                    {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Role</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:border-black outline-none transition-colors"
                      placeholder="Your Role"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {/* Project Type */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Project Type</label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:border-black outline-none transition-colors"
                    >
                      <option value="">Select type</option>
                      <option value="ongoing">Ongoing Partnership</option>
                      <option value="project">Single Project</option>
                      <option value="trial">Trial Period</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:border-black outline-none transition-colors"
                    >
                      <option value="">Select category</option>
                      <option value="womenswear">Womenswear</option>
                      <option value="menswear">Menswear</option>
                      <option value="kidswear">Kidswear</option>
                      <option value="sportswear">Sportswear</option>
                      <option value="outerwear">Outerwear</option>
                      <option value="denim">Denim</option>
                      <option value="knitwear">Knitwear</option>
                      <option value="accessories">Accessories</option>
                      <option value="multiple">Multiple Categories</option>
                    </select>
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">Deliverables</label>
                  <div className="flex flex-wrap gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="deliverables.techPacks"
                        checked={formData.deliverables.techPacks}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="text-sm text-gray-700">Tech packs</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="deliverables.prototyping"
                        checked={formData.deliverables.prototyping}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="text-sm text-gray-700">3D prototyping</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        name="deliverables.productVisuals"
                        checked={formData.deliverables.productVisuals}
                        onChange={handleChange}
                        className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                      />
                      <span className="text-sm text-gray-700">Product visuals</span>
                    </label>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Timeline</label>
                  <select
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:border-black outline-none transition-colors"
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">ASAP</option>
                    <option value="1month">Within 1 month</option>
                    <option value="3months">1-3 months</option>
                    <option value="6months">3-6 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">Additional Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-black focus:border-black outline-none transition-colors resize-none"
                    placeholder="Tell us more about your project needs..."
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
                  {isLoading ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
