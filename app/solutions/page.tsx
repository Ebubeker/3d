import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export const metadata: Metadata = {
  title: "3D Fashion Design Solutions | virtuality.fashion",
  description: "3D fashion design software solutions: virtual prototyping, digital fitting, and collaborative design platform.",
  keywords: "3d fashion design, virtual clothing, digital garment design",
};

export default function SolutionsPage() {
  const solutions = [
    {
      id: 1,
      title: "3D Design",
      description: "CLO3D & Browzwear integration",
      icon: "🎨"
    },
    {
      id: 2,
      title: "Virtual Prototyping",
      description: "Digital samples, 60% cost savings",
      icon: "💎"
    },
    {
      id: 3,
      title: "Ecommerce Visualization",
      description: "Virtual try-on & configurators",
      icon: "🛍️"
    },
    {
      id: 4,
      title: "CAD Tools",
      description: "Technical flats & pattern making",
      icon: "📐"
    },
    {
      id: 5,
      title: "Cloud Platform",
      description: "Real-time collaboration",
      icon: "🌐"
    },
    {
      id: 6,
      title: "Manufacturing",
      description: "Production-ready workflows",
      icon: "🏭"
    }
  ];

  return (
    <>
      <Header />

      {/* Hero Section */}
      <div className="bg-white min-h-[60vh] flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
            Complete 3D Fashion Solutions
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl">
            Virtual prototyping to collaborative design platforms.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/team">
              <button className="px-8 py-4 bg-black text-white rounded font-medium hover:bg-gray-900 transition-colors">
                Explore Platform
              </button>
            </Link>
            <Link href="/pricing">
              <button className="px-8 py-4 border-2 border-black text-black rounded font-medium hover:bg-black hover:text-white transition-colors">
                View Pricing
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-black mb-10 text-center">
            Solutions
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution) => (
              <div
                key={solution.id}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-400 transition-colors"
              >
                <div className="text-4xl mb-3">{solution.icon}</div>
                <h3 className="text-xl font-bold text-black mb-2">
                  {solution.title}
                </h3>
                <p className="text-gray-700">
                  {solution.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-black mb-10 text-center">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-black mb-3">Easy to Use</h3>
              <p className="text-gray-700">
                Start designing in hours, not weeks.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-black mb-3">Fast Launch</h3>
              <p className="text-gray-700">
                50% faster collection development.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-black mb-3">Sustainable</h3>
              <p className="text-gray-700">
                Eliminate physical sampling waste.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tools */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-black mb-10 text-center">
            Tools We Use
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['CLO3D', 'Browzwear', 'Marvelous Designer', 'Adobe Illustrator'].map((tool, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 text-center border border-gray-200">
                <div className="text-2xl mb-2">⚙️</div>
                <h3 className="text-sm font-bold text-black">{tool}</h3>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/contact">
              <button className="px-8 py-4 bg-black text-white rounded font-medium hover:bg-gray-900 transition-colors">
                Request Demo
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Get Started
          </h2>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/team">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded font-medium hover:bg-gray-100 transition-colors">
                Explore Platform
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white rounded font-medium hover:bg-white hover:text-black transition-colors">
                Contact Sales
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
