export default function AboutSection() {
  return (
    <section className="bg-linear-to-b from-gray-50 via-purple-50/30 to-blue-50/30 py-20 px-6 relative overflow-hidden">
      {/* Decorative 3D Blobs */}
      <div className="absolute top-10 right-10 w-96 h-96 bg-linear-to-br from-purple-100 to-blue-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-linear-to-br from-blue-100 to-purple-100 rounded-full blur-3xl opacity-20"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left side - Content */}
          <div>
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-linear-to-r from-purple-100 to-blue-100 text-purple-600 text-sm font-semibold rounded-full border border-purple-200">
                About virtuality.fashion
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              The Future of Digital Fashion
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              virtuality.fashion is a cutting-edge 3D fashion simulator that revolutionizes how brands and consumers interact with apparel. We&apos;re building the next generation of digital fashion experiences with realistic 3D rendering and immersive environments.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              After our initial venture with AI integration, we&apos;ve completely rebuilt the platform from the ground up. Our focus is on delivering premium quality, exceptional performance, and a seamless experience that sets new standards in digital fashion.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">100%</div>
                <p className="text-sm text-gray-600">3D Rendered</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-1">60fps</div>
                <p className="text-sm text-gray-600">Performance</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 mb-1">∞</div>
                <p className="text-sm text-gray-600">Possibilities</p>
              </div>
            </div>

            {/* CTA Button */}
            <button className="px-8 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300">
              Learn More
            </button>
          </div>

          {/* Right side - Visual */}
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-r from-purple-200/40 to-blue-200/40 rounded-2xl blur-3xl"></div>
            <div className="relative bg-white/80 rounded-2xl border border-gray-200 p-12 backdrop-blur-sm shadow-xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-linear-to-br from-purple-100 to-purple-50 rounded-lg p-6 border border-purple-200 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-2">🎨</div>
                  <p className="text-sm text-gray-600">Advanced Rendering</p>
                </div>
                <div className="bg-linear-to-br from-blue-100 to-blue-50 rounded-lg p-6 border border-blue-200 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-2">🌍</div>
                  <p className="text-sm text-gray-600">Immersive Worlds</p>
                </div>
                <div className="bg-linear-to-br from-purple-100 to-purple-50 rounded-lg p-6 border border-purple-200 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-2">⚡</div>
                  <p className="text-sm text-gray-600">Lightning Fast</p>
                </div>
                <div className="bg-linear-to-br from-blue-100 to-blue-50 rounded-lg p-6 border border-blue-200 text-center hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-2">👕</div>
                  <p className="text-sm text-gray-600">Virtual Try-On</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-500 text-sm">
                  Powered by cutting-edge 3D technology
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
