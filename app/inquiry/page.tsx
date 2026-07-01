'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface FormData {
  // Step 1: Personal Details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  // Step 2: Product Details
  productName: string;
  productType: string;
  quantity: string;
  targetMarket: string;
  // Step 3: Materials Upload
  budgetRange: string;
  timeline: string;
  additionalNotes: string;
  filesUploaded: boolean;
}

export default function InquiryPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    productName: '',
    productType: 'apparel',
    quantity: '',
    targetMarket: '',
    budgetRange: 'standard',
    timeline: '3-months',
    additionalNotes: '',
    filesUploaded: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Please enter a valid email';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
      if (!formData.company.trim()) newErrors.company = 'Company name is required';
    }

    if (step === 2) {
      if (!formData.productName.trim()) newErrors.productName = 'Product name is required';
      if (!formData.quantity.trim()) newErrors.quantity = 'Quantity is required';
      if (!formData.targetMarket.trim()) newErrors.targetMarket = 'Target market is required';
    }

    if (step === 3) {
      if (!formData.additionalNotes.trim()) newErrors.additionalNotes = 'Please add some details about your requirements';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep(currentStep)) {
      setIsLoading(true);
      try {
        // Send to our server route (spam checking and notification happen server-side)
        const response = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            formType: 'inquiry',
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            phone: formData.phone,
            company: formData.company,
            productName: formData.productName,
            projectType: formData.productType,
            quantity: formData.quantity,
            targetMarket: formData.targetMarket,
            budgetRange: formData.budgetRange,
            timeline: formData.timeline,
            additionalNotes: formData.additionalNotes,
          }),
        });

        const result = await response.json();

        if (result.success) {
          setSubmitted(true);
          (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer?.push({
            event: 'lead_form_submit',
            form_type: 'inquiry',
          });
          // Reset form after 3 seconds
          setTimeout(() => {
            setCurrentStep(1);
            setFormData({
              firstName: '',
              lastName: '',
              email: '',
              phone: '',
              company: '',
              productName: '',
              productType: 'apparel',
              quantity: '',
              targetMarket: '',
              budgetRange: 'standard',
              timeline: '3-months',
              additionalNotes: '',
              filesUploaded: false,
            });
            setSubmitted(false);
          }, 3000);
        } else {
          console.error('Email Error:', result);
          setErrors({ form: 'Something went wrong. Please try again.' });
        }
      } catch (error) {
        console.error('Email Connection Error:', error);
        setErrors({ form: 'Connection error. Please try again.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      <Header />
      {/* Hero Section */}
      <div className="bg-linear-to-br from-white via-gray-50 to-gray-100 min-h-screen flex items-center justify-center overflow-hidden pt-20 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-pulse"></div>
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 py-20">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Custom Project
              <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Inquiry</span>
            </h1>
            <p className="text-xl text-gray-600">
              Fill out this form to request a custom 3D fashion project. We&apos;ll get back to you within 24 hours.
            </p>
          </div>

          {/* Form Container */}
          <div className="bg-white border border-gray-200 rounded-3xl p-8 md:p-12 shadow-xl">
            {submitted ? (
              // Success State
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">✓</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h2>
                <p className="text-gray-600 mb-8">
                  Your inquiry has been submitted successfully. Our team will review your project requirements and contact you within 24 hours.
                </p>
                <Link href="/">
                  <button className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                    Back to Home
                  </button>
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step Indicator */}
                <div className="flex justify-between items-center mb-12">
                  {[1, 2, 3, 4].map((step) => (
                    <div key={step} className="flex items-center">
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-sm sm:text-base transition-all ${
                          step < currentStep
                            ? 'bg-green-500 text-white'
                            : step === currentStep
                            ? 'bg-linear-to-r from-purple-600 to-blue-600 text-white'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step < currentStep ? '✓' : step}
                      </div>
                      {step < 4 && (
                        <div
                          className={`h-1 w-6 mx-1 sm:w-12 sm:mx-2 md:w-16 ${
                            step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Personal Details */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-900">Step 1: Personal Details</h2>
                    <p className="text-gray-600">Tell us about yourself and your company</p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">First Name *</label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          placeholder="John"
                          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                            errors.firstName
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                          } text-gray-900 placeholder-gray-400`}
                        />
                        {errors.firstName && <p className="text-red-600 text-sm mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name *</label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          placeholder="Doe"
                          className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                            errors.lastName
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                          } text-gray-900 placeholder-gray-400`}
                        />
                        {errors.lastName && <p className="text-red-600 text-sm mt-1">{errors.lastName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="john@example.com"
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          errors.email
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                        } text-gray-900 placeholder-gray-400`}
                      />
                      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          errors.phone
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                        } text-gray-900 placeholder-gray-400`}
                      />
                      {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Company Name *</label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your Fashion Brand"
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          errors.company
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                        } text-gray-900 placeholder-gray-400`}
                      />
                      {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
                    </div>
                  </div>
                )}

                {/* Step 2: Product Details */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-900">Step 2: Product Details</h2>
                    <p className="text-gray-600">Tell us about the products you want to create</p>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Product Name *</label>
                      <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder="e.g., Summer Collection 2024"
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          errors.productName
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                        } text-gray-900 placeholder-gray-400`}
                      />
                      {errors.productName && <p className="text-red-600 text-sm mt-1">{errors.productName}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Product Type</label>
                      <select
                        name="productType"
                        value={formData.productType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-purple-500 focus:bg-white outline-none transition-all"
                      >
                        <option value="apparel">Apparel</option>
                        <option value="footwear">Footwear</option>
                        <option value="accessories">Accessories</option>
                        <option value="mixed">Mixed Collection</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Estimated Quantity *</label>
                      <input
                        type="text"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="e.g., 50-100 units"
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          errors.quantity
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                        } text-gray-900 placeholder-gray-400`}
                      />
                      {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Target Market *</label>
                      <input
                        type="text"
                        name="targetMarket"
                        value={formData.targetMarket}
                        onChange={handleChange}
                        placeholder="e.g., North America, Europe, Asia"
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                          errors.targetMarket
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                        } text-gray-900 placeholder-gray-400`}
                      />
                      {errors.targetMarket && <p className="text-red-600 text-sm mt-1">{errors.targetMarket}</p>}
                    </div>
                  </div>
                )}

                {/* Step 3: Budget & Timeline */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-900">Step 3: Budget & Timeline</h2>
                    <p className="text-gray-600">Help us understand your project scope and timeline</p>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Budget Range</label>
                      <select
                        name="budgetRange"
                        value={formData.budgetRange}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-purple-500 focus:bg-white outline-none transition-all"
                      >
                        <option value="starter">Starter ($5k - $15k)</option>
                        <option value="standard">Standard ($15k - $50k)</option>
                        <option value="premium">Premium ($50k - $100k)</option>
                        <option value="enterprise">Enterprise ($100k+)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Project Timeline</label>
                      <select
                        name="timeline"
                        value={formData.timeline}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-900 focus:border-purple-500 focus:bg-white outline-none transition-all"
                      >
                        <option value="urgent">Urgent (4 weeks)</option>
                        <option value="1-month">1-2 Months</option>
                        <option value="3-months">3 Months</option>
                        <option value="6-months">6 Months</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Additional Details *</label>
                      <textarea
                        name="additionalNotes"
                        value={formData.additionalNotes}
                        onChange={handleChange}
                        placeholder="Describe your project, specific requirements, design preferences, color schemes, material preferences, etc."
                        rows={5}
                        className={`w-full px-4 py-3 rounded-lg border transition-all outline-none resize-none ${
                          errors.additionalNotes
                            ? 'border-red-500 bg-red-50'
                            : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                        } text-gray-900 placeholder-gray-400`}
                      />
                      {errors.additionalNotes && <p className="text-red-600 text-sm mt-1">{errors.additionalNotes}</p>}
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Submit */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fadeIn">
                    <h2 className="text-2xl font-bold text-gray-900">Step 4: Review & Submit</h2>
                    <p className="text-gray-600">Please review your information before submitting</p>

                    {/* Summary Card */}
                    <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-6">
                      {/* Personal Info */}
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Personal Details</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Name</p>
                            <p className="font-semibold text-gray-900">{formData.firstName} {formData.lastName}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Email</p>
                            <p className="font-semibold text-gray-900">{formData.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Phone</p>
                            <p className="font-semibold text-gray-900">{formData.phone}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Company</p>
                            <p className="font-semibold text-gray-900">{formData.company}</p>
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="border-t border-gray-300 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Product Details</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Product Name</p>
                            <p className="font-semibold text-gray-900">{formData.productName}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Type</p>
                            <p className="font-semibold text-gray-900 capitalize">{formData.productType}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Quantity</p>
                            <p className="font-semibold text-gray-900">{formData.quantity}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Target Market</p>
                            <p className="font-semibold text-gray-900">{formData.targetMarket}</p>
                          </div>
                        </div>
                      </div>

                      {/* Project Info */}
                      <div className="border-t border-gray-300 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-3">Project Details</h3>
                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Budget Range</p>
                            <p className="font-semibold text-gray-900 capitalize">{formData.budgetRange}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Timeline</p>
                            <p className="font-semibold text-gray-900 capitalize">{formData.timeline}</p>
                          </div>
                        </div>
                        <div className="mt-4">
                          <p className="text-gray-600 text-sm mb-2">Additional Notes</p>
                          <p className="text-gray-900">{formData.additionalNotes}</p>
                        </div>
                      </div>
                    </div>

                    {/* Agreement Checkbox */}
                    <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <input
                        type="checkbox"
                        id="agree"
                        required
                        className="w-5 h-5 rounded border border-blue-300 bg-white text-blue-600 cursor-pointer mt-1 shrink-0"
                      />
                      <label htmlFor="agree" className="text-sm text-gray-700 cursor-pointer">
                        I agree to the terms and conditions and confirm that the information provided is accurate. I understand that our team will contact me to discuss the project in detail.
                      </label>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {errors.form && (
                  <p className="text-red-600 text-sm text-center">{errors.form}</p>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-4 pt-8 border-t border-gray-200">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="flex-1 px-6 py-3 border-2 border-gray-200 text-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-all"
                    >
                      Previous
                    </button>
                  )}
                  {currentStep < 4 && (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all ml-auto"
                    >
                      Next
                    </button>
                  )}
                  {currentStep === 4 && (
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all ml-auto transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? 'Submitting...' : 'Get Quote'}
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
