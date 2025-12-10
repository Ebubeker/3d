import Image from 'next/image';

export default function BenefitsSection() {
  const benefits = [
    {
      id: 1,
      title: "Faster Production",
      description: "Digital samples, no delays.",
      visual: "speed",
      image: "/images/portfolio/f2.jpg"
    },
    {
      id: 2,
      title: "60% Cost Savings",
      description: "Lower sampling costs.",
      visual: "cost",
      image: null
    },
    {
      id: 3,
      title: "Expert Team",
      description: "Vetted professionals.",
      visual: "talent",
      image: "/images/portfolio/f3.jpg"
    },
    {
      id: 4,
      title: "Top Technology",
      description: "CLO3D, Browzwear.",
      visual: "tech",
      image: null
    }
  ];

  return (
    <section className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-black mb-10 text-center">
          Benefits
        </h2>

        <div className="space-y-12">
          {benefits.map((benefit, index) => (
            <div key={benefit.id} className="grid md:grid-cols-2 gap-8 items-center">
              {/* Text content */}
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <h3 className="text-3xl font-bold text-black mb-3">
                  {benefit.title}
                </h3>
                <p className="text-lg text-gray-700">
                  {benefit.description}
                </p>
              </div>

              {/* Visual - Full height */}
              <div className={index % 2 === 1 ? 'md:order-1' : ''}>
                {benefit.image ? (
                  <div className="relative h-[60vh] min-h-[400px] rounded-2xl overflow-hidden">
                    <Image
                      src={benefit.image}
                      alt={benefit.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="h-[60vh] min-h-[400px] bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl border border-gray-200 flex items-center justify-center">
                    <p className="text-gray-400 text-sm">[{benefit.visual}]</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
