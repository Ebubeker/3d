import Link from 'next/link';

export default function AudienceSegments() {
  const segments = [
    {
      id: 1,
      headline: "Small & Medium Business",
      subtitle: "Perfect for growing fashion businesses",
      description: "Access professional 3D design services without the overhead of a full-time team. Scale your design capabilities on demand.",
      features: [
        "Pay-per-project flexibility",
        "48-hour turnaround available",
        "Dedicated project manager",
        "Unlimited revisions"
      ],
      cta: "Get Started",
      ctaLink: "/contact"
    },
    {
      id: 2,
      headline: "Fashion Brands",
      subtitle: "Streamline your product development",
      description: "Accelerate your design-to-market pipeline with our comprehensive digital prototyping and visualization solutions.",
      features: [
        "60% faster time-to-market",
        "Reduce sampling costs by 70%",
        "Seamless PLM integration",
        "Priority support & SLA"
      ],
      cta: "View Solutions",
      ctaLink: "/solutions"
    },
    {
      id: 3,
      headline: "Enterprise",
      subtitle: "Custom solutions at scale",
      description: "Full-service digital transformation for large organizations. Dedicated teams, custom workflows, and enterprise-grade security.",
      features: [
        "Dedicated design team",
        "Custom API integrations",
        "On-premise deployment options",
        "24/7 premium support"
      ],
      cta: "Contact Sales",
      ctaLink: "/contact"
    }
  ];

  return (
    <section className="bg-gray-50 py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-black mb-6">
            For Teams of All Sizes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Whether you're a startup or a global brand, we have the right solution for your needs
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="bg-white border-2 border-gray-200 rounded-2xl p-8 hover:border-black hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-black mb-2">
                  {segment.headline}
                </h3>
                <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {segment.subtitle}
                </p>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {segment.description}
              </p>

              <ul className="space-y-3 mb-8 flex-grow">
                {segment.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start text-sm text-gray-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-black mr-3 mt-1.5 flex-shrink-0"></span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href={segment.ctaLink} className="mt-auto">
                <button className="w-full px-6 py-4 border-2 border-black text-black rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 text-base">
                  {segment.cta}
                </button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
