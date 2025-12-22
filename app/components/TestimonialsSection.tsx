import { User, Briefcase, Palette, Laptop, Star } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Alex Johnson",
      role: "Fashion Director",
      company: "Premium Brands Co.",
      icon: User,
      rating: 5,
      text: "Virtuality.Fashion has completely transformed how we showcase our collections. The 3D rendering quality is exceptional, and our customers love the virtual try-on experience.",
    },
    {
      id: 2,
      name: "Sarah Chen",
      role: "E-commerce Manager",
      company: "Luxury Apparel Inc.",
      icon: Briefcase,
      rating: 5,
      text: "The platform is incredibly fast and intuitive. Our conversion rates increased by 40% after implementing Virtuality.Fashion. Highly recommended for any fashion brand.",
    },
    {
      id: 3,
      name: "Marcus Williams",
      role: "Creative Director",
      company: "Fashion Innovation Labs",
      icon: Palette,
      rating: 5,
      text: "Finally, a 3D fashion platform that delivers on quality and performance. The team's commitment to rebuilding with excellence is evident in every detail.",
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      role: "Brand Manager",
      company: "Trend Forward Collective",
      icon: Laptop,
      rating: 5,
      text: "The immersive environments and realistic fabric rendering are mind-blowing. Our customers spend 3x longer on product pages now. This is the future of fashion retail.",
    },
  ];

  const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex gap-1">
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  );

  return (
    <section className="bg-linear-to-br from-gray-50 to-white py-20 px-6 relative overflow-hidden">
      {/* Decorative 3D Blobs */}
      <div className="absolute top-20 left-20 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Loved by Fashion Brands
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See what industry leaders are saying about Virtuality.Fashion
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => {
            const Icon = testimonial.icon;
            return (
              <div
                key={testimonial.id}
                className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-xl transition-all duration-300"
              >
                {/* Rating */}
                <div className="mb-4">
                  <StarRating rating={testimonial.rating} />
                </div>

                {/* Testimonial Text */}
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.text}&rdquo;
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-linear-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 font-semibold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                    <p className="text-purple-600 text-xs font-medium">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Stats */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              500+
            </div>
            <p className="text-gray-600">Active Brands</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              1M+
            </div>
            <p className="text-gray-600">Monthly Users</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              4.9/5
            </div>
            <p className="text-gray-600">Avg. Rating</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              40%
            </div>
            <p className="text-gray-600">Avg. Conversion Lift</p>
          </div>
        </div>
      </div>
    </section>
  );
}
