import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PricingPage() {
  const services = [
    {
      id: 1,
      category: '2D Technical Design',
      items: [
        { name: '2D Technical Flat (single garment)', rate: '$50-75/hour', typical: '2-4 hours per design' },
        { name: 'Tech Pack Creation (full)', rate: '$60-85/hour', typical: '6-10 hours per tech pack' },
        { name: 'Grading & Sizing', rate: '$55-70/hour', typical: '2-3 hours per size run' },
        { name: 'Line Sheet Development', rate: '$50-65/hour', typical: '4-6 hours per collection' }
      ]
    },
    {
      id: 2,
      category: '3D Fashion Simulation',
      items: [
        { name: '3D Garment Model (CLO3D/Browzwear)', rate: '$75-100/hour', typical: '4-8 hours per garment' },
        { name: 'Digital Sample with Textures', rate: '$80-110/hour', typical: '6-10 hours per sample' },
        { name: 'Photorealistic Rendering', rate: '$70-95/hour', typical: '3-5 hours per render' },
        { name: 'Style Variations', rate: '$60-80/hour', typical: '2-3 hours per variation' }
      ]
    },
    {
      id: 3,
      category: 'Collection Development',
      items: [
        { name: 'Collection Planning & Coordination', rate: '$65-85/hour', typical: 'Project-based' },
        { name: 'Concept to Production Support', rate: '$70-90/hour', typical: 'Ongoing support' },
        { name: 'Material & Trim Research', rate: '$50-70/hour', typical: '4-8 hours' },
        { name: 'Fit Review & Adjustments', rate: '$65-80/hour', typical: '3-5 hours per review' }
      ]
    }
  ];

  return (
    <>
      <Header />

      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h1 className="text-6xl font-bold text-black mb-6">Pricing</h1>
          <p className="text-xl text-gray-700 max-w-2xl">
            Transparent hourly rates for our fashion technical design services. All rates are in USD and vary based on designer experience and project complexity.
          </p>
        </div>
      </div>

      {/* How Pricing Works */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-black mb-12 text-center">How Our Pricing Works</h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">1</div>
              <h3 className="text-2xl font-bold text-black mb-3">Choose Your Designer</h3>
              <p className="text-gray-700">
                Browse our team marketplace and select the designer that best matches your project needs and budget.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">2</div>
              <h3 className="text-2xl font-bold text-black mb-3">Hourly Billing</h3>
              <p className="text-gray-700">
                Work is billed hourly based on the rates below. You'll receive detailed time tracking and progress updates.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-gray-200">
              <div className="w-12 h-12 bg-black text-white rounded-full flex items-center justify-center text-2xl font-bold mb-4">3</div>
              <h3 className="text-2xl font-bold text-black mb-3">Simple Commission</h3>
              <p className="text-gray-700">
                virtuality.fashion takes a small commission to maintain the platform and ensure quality standards.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Tables */}
      <div className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-black mb-12 text-center">Service Rates</h2>

          <div className="space-y-12">
            {services.map((service) => (
              <div key={service.id} className="border-2 border-gray-200 rounded-2xl overflow-hidden">
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-200">
                  <h3 className="text-3xl font-bold text-black">{service.category}</h3>
                </div>

                <div className="p-8">
                  <div className="space-y-6">
                    {service.items.map((item, index) => (
                      <div key={index} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-gray-200 last:border-0">
                        <div className="flex-1">
                          <h4 className="text-xl font-bold text-black mb-2">{item.name}</h4>
                          <p className="text-sm text-gray-600">{item.typical}</p>
                        </div>
                        <div className="shrink-0">
                          <p className="text-2xl font-bold text-black">{item.rate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise Pricing */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="bg-black text-white rounded-2xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Enterprise Pricing</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Need a dedicated design team or managing high-volume production? We offer custom enterprise packages with volume discounts and dedicated support.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-8 text-left">
              <div>
                <h3 className="text-lg font-bold mb-2">Dedicated Design Pods</h3>
                <p className="text-gray-300 text-sm">
                  Full-time teams of 3-10 designers exclusively for your brand
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">Volume Discounts</h3>
                <p className="text-gray-300 text-sm">
                  Reduced rates for 100+ hours per month commitments
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold mb-2">Custom SLAs</h3>
                <p className="text-gray-300 text-sm">
                  Guaranteed turnaround times and priority support
                </p>
              </div>
            </div>

            <Link href="/enterprise">
              <button className="px-8 py-4 bg-white text-black rounded font-medium hover:bg-gray-100 transition-colors">
                Get Enterprise Quote
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <h2 className="text-4xl font-bold text-black mb-12 text-center">Pricing FAQs</h2>

          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-black mb-3">How is time tracked?</h3>
              <p className="text-gray-700 leading-relaxed">
                All designers use time tracking software to log hours accurately. You receive detailed reports showing exactly what was worked on and for how long.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-3">What's the minimum project size?</h3>
              <p className="text-gray-700 leading-relaxed">
                We don't have a strict minimum, but most projects are at least 5-10 hours to ensure quality results. For smaller tasks, we recommend batching multiple designs together.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-3">Can I get a fixed-price quote?</h3>
              <p className="text-gray-700 leading-relaxed">
                Yes! For well-defined projects, we can provide fixed-price quotes based on estimated hours. Contact us with your project details for a custom quote.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-700 leading-relaxed">
                We accept credit cards, ACH transfers, and wire transfers. Enterprise clients can arrange for NET 30 payment terms.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-3">What if I'm not satisfied with the work?</h3>
              <p className="text-gray-700 leading-relaxed">
                We offer revisions as part of the process. If there are quality concerns, we work with you and the designer to ensure satisfaction. Our quality guarantee ensures you get professional results.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-black mb-3">Are there any setup or platform fees?</h3>
              <p className="text-gray-700 leading-relaxed">
                No setup fees or monthly charges. You only pay for the hours worked by designers. Our commission is built into the hourly rates shown above.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Browse our team of designers or contact us for a custom quote.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/team">
              <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded font-medium hover:bg-gray-100 transition-colors">
                Browse Team
              </button>
            </Link>
            <Link href="/contact">
              <button className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white rounded font-medium hover:bg-white hover:text-black transition-colors">
                Get a Quote
              </button>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
