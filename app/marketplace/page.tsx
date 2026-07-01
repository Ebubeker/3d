'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

interface Project {
  id: number;
  name: string;
  description: string;
  emoji: string;
}

interface Employee {
  id: number;
  name: string;
  role: string;
  emoji: string;
  projects: Project[];
}

export default function MarketplacePage() {
  const [hasAccess, setHasAccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '' });

  // Employee showcase data
  const employees: Employee[] = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      role: '3D Fashion Designer',
      emoji: '👩‍💼',
      projects: [
        { id: 1, name: 'Premium Tee Collection', description: 'Photorealistic 3D rendered classic t-shirts', emoji: '👕' },
        { id: 2, name: 'Oversized Hoodies', description: 'Comfortable and stylish hoodie designs', emoji: '🧥' },
        { id: 3, name: 'Casual Joggers', description: 'Modern athletic wear with precision details', emoji: '👖' },
      ],
    },
    {
      id: 2,
      name: 'James Rodriguez',
      role: 'Visualization Specialist',
      emoji: '👨‍💼',
      projects: [
        { id: 4, name: 'Luxury Polo Shirts', description: 'High-end polo collection with detailed texturing', emoji: '🎽' },
        { id: 5, name: 'Athletic Wear Line', description: 'Performance-focused 3D apparel designs', emoji: '⛹️' },
        { id: 6, name: 'Accessory Pack', description: 'Hats, belts, and complementary pieces', emoji: '🧢' },
      ],
    },
    {
      id: 3,
      name: 'Emma Chen',
      role: 'Materials & Textures Lead',
      emoji: '👩‍🎨',
      projects: [
        { id: 7, name: 'Fabric Simulation', description: 'Realistic fabric physics and rendering', emoji: '🎨' },
        { id: 8, name: 'Color Variations', description: 'Premium color palettes and finishes', emoji: '🌈' },
        { id: 9, name: 'Pattern Library', description: 'Detailed pattern and print designs', emoji: '✨' },
      ],
    },
  ];

  // Check if user has already accessed marketplace
  useEffect(() => {
    const checkMarketplaceAccess = () => {
      const storedData = localStorage.getItem('marketplaceUser');
      if (storedData) {
        setHasAccess(true);
      }
      setIsLoading(false);
    };

    checkMarketplaceAccess();
  }, []);

  // Validate email format
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form
    const newErrors = { name: '', email: '' };

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (newErrors.name || newErrors.email) {
      setErrors(newErrors);
      return;
    }

    // Store data in localStorage
    const userData = {
      name: formData.name,
      email: formData.email,
      accessTime: new Date().toISOString(),
    };

    localStorage.setItem('marketplaceUser', JSON.stringify(userData));

    // Notify the team about the captured lead (non-blocking, fire and forget)
    fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        formType: 'general',
        queryType: 'Marketplace Access Request',
        name: formData.name,
        email: formData.email,
        company: '',
        message: 'Requested marketplace access via the gate form.',
      }),
    }).catch((err) => console.error('marketplace gate notify failed', err));

    (window as unknown as { dataLayer?: Array<Record<string, unknown>> }).dataLayer?.push({
      event: 'lead_form_submit',
      form_type: 'marketplace-gate',
    });

    setSubmitted(true);

    // Redirect to marketplace after 1.5 seconds
    setTimeout(() => {
      setHasAccess(true);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-white via-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading marketplace...</p>
        </div>
      </div>
    );
  }

  if (hasAccess && !submitted) {
    // User has access - show marketplace
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white pt-24">
          {/* Marketplace Hero */}
          <div className="bg-linear-to-br from-purple-50 to-blue-50 py-20 px-6">
            <div className="max-w-6xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to Our 3D Fashion
                <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Marketplace</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                Explore exclusive 3D apparel collections and customize your virtual wardrobe
              </p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button className="px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
                  Browse Collections
                </button>
                <button className="px-8 py-4 border-2 border-gray-800 text-gray-900 rounded-lg font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-300">
                  View My Cart
                </button>
              </div>
            </div>
          </div>

          {/* Employee Showcase Section */}
          <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meet Our Creative Team
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Discover the talented professionals behind our premium 3D fashion collections
              </p>
            </div>

            {/* Alternating Employee Rows */}
            <div className="space-y-20">
              {employees.map((employee, index) => (
                <div
                  key={employee.id}
                  className={`grid md:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'md:auto-cols-auto' : ''
                  }`}
                >
                  {/* Employee Profile - Left or Right based on index */}
                  {index % 2 === 0 ? (
                    <>
                      {/* Left: Employee Profile */}
                      <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-3xl p-12 border border-gray-200 relative group">
                        <div className="relative z-10">
                          <div className="text-8xl mb-6">{employee.emoji}</div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h3>
                          <p className="text-lg text-purple-600 font-semibold mb-6">{employee.role}</p>
                          <p className="text-gray-600 mb-8">
                            Expert in {employee.role.toLowerCase()} with years of experience creating photorealistic 3D fashion simulations and immersive digital experiences.
                          </p>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                          <Link href="/employees">
                            <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                              Check Projects
                            </button>
                          </Link>
                          <Link href="/inquiry">
                            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all transform hover:scale-105">
                              Get Inquiry
                            </button>
                          </Link>
                        </div>
                      </div>

                      {/* Right: Projects Grid */}
                      <div className="grid grid-cols-1 gap-6">
                        {employee.projects.map((project) => (
                          <div
                            key={project.id}
                            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all group relative overflow-hidden"
                          >
                            <div className="flex items-start gap-4">
                              <div className="text-5xl shrink-0">{project.emoji}</div>
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h4>
                                <p className="text-gray-600">{project.description}</p>
                              </div>
                            </div>

                            {/* Project Hover Overlay */}
                            <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                              <Link href="/inquiry">
                                <button className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                                  Request Quote
                                </button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Right: Projects Grid */}
                      <div className="grid grid-cols-1 gap-6 md:order-2">
                        {employee.projects.map((project) => (
                          <div
                            key={project.id}
                            className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition-all group relative overflow-hidden"
                          >
                            <div className="flex items-start gap-4">
                              <div className="text-5xl shrink-0">{project.emoji}</div>
                              <div className="flex-1">
                                <h4 className="text-xl font-bold text-gray-900 mb-2">{project.name}</h4>
                                <p className="text-gray-600">{project.description}</p>
                              </div>
                            </div>

                            {/* Project Hover Overlay */}
                            <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex items-center justify-center">
                              <Link href="/inquiry">
                                <button className="px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all">
                                  Request Quote
                                </button>
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Left: Employee Profile */}
                      <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-3xl p-12 border border-gray-200 relative group md:order-1">
                        <div className="relative z-10">
                          <div className="text-8xl mb-6">{employee.emoji}</div>
                          <h3 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h3>
                          <p className="text-lg text-purple-600 font-semibold mb-6">{employee.role}</p>
                          <p className="text-gray-600 mb-8">
                            Expert in {employee.role.toLowerCase()} with years of experience creating photorealistic 3D fashion simulations and immersive digital experiences.
                          </p>
                        </div>

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-linear-to-br from-purple-600 to-blue-600 rounded-3xl opacity-0 group-hover:opacity-90 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
                          <Link href="/employees">
                            <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105">
                              Check Projects
                            </button>
                          </Link>
                          <Link href="/inquiry">
                            <button className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all transform hover:scale-105">
                              Get Inquiry
                            </button>
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Show gated access form
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center px-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply opacity-30 blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card Container */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-200 p-8 md:p-12">
          {submitted ? (
            // Success State
            <div className="text-center space-y-6 py-8">
              <div className="w-16 h-16 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto">
                <span className="text-3xl">✓</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Welcome!</h2>
              <p className="text-gray-600">
                Thanks for registering, <span className="font-semibold">{formData.name}</span>. Redirecting you to the marketplace...
              </p>
              <div className="pt-4">
                <div className="inline-block">
                  <div className="w-8 h-8 border-3 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
                </div>
              </div>
            </div>
          ) : (
            // Form State
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold text-gray-900">
                  Access
                  <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"> Marketplace</span>
                </h1>
                <p className="text-gray-600">Enter your details to explore our exclusive 3D collections</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      errors.name
                        ? 'border-red-500 bg-red-50 focus:border-red-600'
                        : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                    } text-gray-900 placeholder-gray-400`}
                  />
                  {errors.name && <p className="text-red-600 text-sm mt-2">{errors.name}</p>}
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className={`w-full px-4 py-3 rounded-lg border transition-all outline-none ${
                      errors.email
                        ? 'border-red-500 bg-red-50 focus:border-red-600'
                        : 'border-gray-200 bg-gray-50 focus:border-purple-500 focus:bg-white'
                    } text-gray-900 placeholder-gray-400`}
                  />
                  {errors.email && <p className="text-red-600 text-sm mt-2">{errors.email}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105 mt-6"
                >
                  Enter Marketplace
                </button>
              </form>

              {/* Info */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-600 text-center">
                  Your information is secure and will only be used to personalize your experience.
                </p>
              </div>

              {/* Back Link */}
              <div className="text-center">
                <Link href="/" className="text-sm text-purple-600 hover:text-purple-700 font-semibold transition-colors">
                  ← Back to Home
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Trust Badge */}
        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm flex items-center justify-center gap-2">
            <span>🔒</span>
            <span>Secure & Private</span>
          </p>
        </div>
      </div>
    </div>
  );
}
