export default function ExperienceSection() {
  return (
    <section className="bg-linear-to-b from-gray-50 to-white py-20 px-6 relative overflow-hidden">
      {/* Decorative 3D Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-linear-to-br from-purple-100 to-transparent rounded-full opacity-30 blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-linear-to-tr from-blue-100 to-transparent rounded-full opacity-30 blur-3xl -z-10"></div>

      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Why Choose virtuality.fashion
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Experience the next generation of digital fashion with cutting-edge 3D technology
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-purple-500 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Realistic 3D Rendering</h3>
            <p className="text-gray-600 leading-relaxed">
              High-fidelity 3D models of branded apparel with accurate fabric textures and lighting effects.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
              <span className="text-2xl">👕</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Virtual Try-On</h3>
            <p className="text-gray-600 leading-relaxed">
              Immersive 3D environments where you can virtually try on items before making a purchase.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-purple-500 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Lightning Fast</h3>
            <p className="text-gray-600 leading-relaxed">
              Optimized performance for seamless 3D experiences across all devices and browsers.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
              <span className="text-2xl">🌍</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Immersive Environments</h3>
            <p className="text-gray-600 leading-relaxed">
              Explore branded collections in stunning 3D worlds designed for ultimate engagement.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-purple-500 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:shadow-purple-500/50 transition-shadow">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Secure & Premium</h3>
            <p className="text-gray-600 leading-relaxed">
              Enterprise-grade security with premium features built for branded partners.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-8 hover:border-blue-500 hover:shadow-xl transition-all duration-300 group">
            <div className="w-14 h-14 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center mb-6 shadow-lg group-hover:shadow-blue-500/50 transition-shadow">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Analytics & Insights</h3>
            <p className="text-gray-600 leading-relaxed">
              Powerful analytics to track user engagement and optimize your 3D collections.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
