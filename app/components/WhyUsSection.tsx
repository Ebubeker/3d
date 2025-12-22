import { Sparkles, Zap, Crown, RefreshCw } from 'lucide-react';

export default function WhyUsSection() {
  return (
    <section className="bg-white py-20 px-6 relative overflow-hidden">
      {/* Decorative 3D Blobs */}
      <div className="absolute top-40 right-20 w-72 h-72 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-40 left-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Why Choose Us
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We&apos;re not just another platform. Here&apos;s what sets Virtuality.Fashion apart
          </p>
        </div>

        {/* Content Grid */}
        <div className="space-y-12">
          {/* Reason 1 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">01</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Premium Quality</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    We rebuilt our platform from scratch focusing on quality design and performance. Every detail matters, from fabric rendering to environmental lighting.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-purple-100 to-blue-100 rounded-2xl h-64 flex items-center justify-center border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-center flex flex-col items-center">
                <Sparkles className="w-16 h-16 text-purple-600 mb-4" />
                <p className="text-gray-600">Premium Design</p>
              </div>
            </div>
          </div>

          {/* Reason 2 */}
          <div className="grid md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
            <div className="bg-linear-to-br from-blue-100 to-purple-100 rounded-2xl h-64 flex items-center justify-center border border-gray-200 md:order-2 hover:shadow-xl transition-shadow">
              <div className="text-center flex flex-col items-center">
                <Zap className="w-16 h-16 text-blue-600 mb-4" />
                <p className="text-gray-600">Lightning Performance</p>
              </div>
            </div>
            <div className="md:order-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">02</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Lightning Fast Performance</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Optimized 3D rendering engine ensures smooth 60fps experiences on all devices. No compromise on speed or visual quality.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Reason 3 */}
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">03</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Branded Partnership</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Built for luxury and premium brands. Dedicated support and custom solutions tailored to your brand&apos;s unique needs.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-purple-100 to-blue-100 rounded-2xl h-64 flex items-center justify-center border border-gray-200 hover:shadow-xl transition-shadow">
              <div className="text-center flex flex-col items-center">
                <Crown className="w-16 h-16 text-purple-600 mb-4" />
                <p className="text-gray-600">Premium Partners</p>
              </div>
            </div>
          </div>

          {/* Reason 4 */}
          <div className="grid md:grid-cols-2 gap-8 items-center md:flex-row-reverse">
            <div className="bg-linear-to-br from-blue-100 to-purple-100 rounded-2xl h-64 flex items-center justify-center border border-gray-200 md:order-2 hover:shadow-xl transition-shadow">
              <div className="text-center flex flex-col items-center">
                <RefreshCw className="w-16 h-16 text-blue-600 mb-4" />
                <p className="text-gray-600">Innovation Focused</p>
              </div>
            </div>
            <div className="md:order-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xl font-bold text-white">04</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Continuous Innovation</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    We&apos;re constantly improving and adding new features. Stay ahead with the latest in 3D fashion technology and digital innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
