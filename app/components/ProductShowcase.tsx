import { Shirt, Layers, ShoppingBag, MoveHorizontal, ZoomIn, Scissors } from 'lucide-react';

export default function ProductShowcase() {
  const products = [
    {
      id: 1,
      name: 'Premium Classic Tee',
      category: 'T-Shirts',
      colors: 3,
      icon: Shirt,
      price: '$29.99',
      colors_available: ['purple', 'blue', 'white'],
    },
    {
      id: 2,
      name: 'Oversized Hoodie',
      category: 'Hoodies',
      colors: 4,
      icon: Layers,
      price: '$59.99',
      colors_available: ['purple', 'black', 'gray', 'blue'],
    },
    {
      id: 3,
      name: 'Fitted Polo Shirt',
      category: 'Polos',
      colors: 3,
      icon: Scissors,
      price: '$39.99',
      colors_available: ['blue', 'white', 'navy'],
    },
    {
      id: 4,
      name: 'Jogger Pants',
      category: 'Pants',
      colors: 2,
      icon: ShoppingBag,
      price: '$49.99',
      colors_available: ['gray', 'black'],
    },
  ];

  return (
    <section className="bg-white py-20 px-6 relative overflow-hidden">
      {/* Decorative 3D Blobs */}
      <div className="absolute top-20 right-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-100 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            3D Product Collection
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore our premium apparel collection with photorealistic 3D visualization. Rotate, zoom, and customize in real-time.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {products.map((product) => {
            const Icon = product.icon;
            return (
              <div
                key={product.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer"
              >
                {/* Product Visualization */}
                <div className="relative bg-linear-to-br from-gray-50 to-gray-100 aspect-square flex flex-col items-center justify-center overflow-hidden group-hover:from-purple-50 group-hover:to-blue-50 transition-colors">
                  {/* 3D Product Icon */}
                  <div className="animate-bounce group-hover:scale-110 transition-transform" style={{animationDuration: '2.5s'}}>
                    <Icon className="w-24 h-24 text-gray-700" strokeWidth={1} />
                  </div>

                  {/* Color indicators */}
                  <div className="absolute bottom-4 left-0 right-0 flex gap-2 justify-center">
                    {product.colors_available.map((color, idx) => (
                      <div
                        key={idx}
                        className={`w-3 h-3 rounded-full border-2 border-white transition-all ${
                          color === 'purple'
                            ? 'bg-purple-600'
                            : color === 'blue'
                            ? 'bg-blue-600'
                            : color === 'black'
                            ? 'bg-black'
                            : color === 'white'
                            ? 'bg-white'
                            : color === 'gray'
                            ? 'bg-gray-400'
                            : 'bg-blue-900'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-sm text-purple-600 font-semibold mb-3">{product.category}</p>

                  {/* Price and specs */}
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-semibold">
                        {product.colors} colors
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button className="w-full px-4 py-3 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-105">
                    View in 3D
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Featured Feature Section */}
        <div className="bg-linear-to-r from-purple-50 to-blue-50 rounded-3xl p-12 border border-gray-200">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left - Features List */}
            <div className="space-y-4">
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Advanced 3D Features</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">360° Rotation</h4>
                    <p className="text-gray-600">View products from every angle with smooth, real-time 3D rotation</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Zoom & Details</h4>
                    <p className="text-gray-600">Inspect fabric texture, stitching, and materials with precision zoom</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Color Customization</h4>
                    <p className="text-gray-600">See products in different colors and materials instantly</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">AR Preview</h4>
                    <p className="text-gray-600">Use augmented reality to see how products look in your space</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Visual Demo */}
            <div className="relative h-96 flex items-center justify-center">
              <div className="relative w-full max-w-xs">
                {/* Floating card effect */}
                <div className="absolute inset-0 bg-linear-to-br from-purple-200 to-blue-200 rounded-3xl transform rotate-3 opacity-30"></div>

                {/* Main demo container */}
                <div className="relative bg-white rounded-3xl shadow-2xl p-6 border border-gray-200">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="animate-bounce">
                      <Shirt className="w-24 h-24 text-purple-600" strokeWidth={1} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Interactive 3D Model</p>
                      <p className="text-gray-600 mt-2">Premium Classic Tee</p>
                      <div className="flex gap-2 justify-center mt-4">
                        <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                        <div className="w-4 h-4 bg-white rounded-full border-2 border-gray-300"></div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-2">
                      <span className="flex items-center gap-1"><MoveHorizontal className="w-3 h-3" /> Drag to rotate</span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1"><ZoomIn className="w-3 h-3" /> Scroll to zoom</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating accent elements */}
              <div className="absolute -top-6 -right-6 w-16 h-16 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-purple-400 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Ready to Explore Our Collections?</h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the future of online shopping with our interactive 3D product visualization technology
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 transform hover:scale-105">
              Start 3D Experience
            </button>
            <button className="px-8 py-4 border-2 border-gray-800 text-gray-900 rounded-lg font-semibold hover:bg-gray-100 hover:shadow-lg transition-all duration-300">
              View All Products
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
