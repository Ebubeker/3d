import Link from 'next/link';

export default function AudienceSegments() {
  const segments = [
    {
      id: 1,
      headline: "SMBs",
      description: "On-demand support",
      cta: "Get Started",
      ctaLink: "/contact"
    },
    {
      id: 2,
      headline: "Brands",
      description: "Faster workflow",
      cta: "View Services",
      ctaLink: "/pricing"
    },
    {
      id: 3,
      headline: "Enterprise",
      description: "Dedicated teams",
      cta: "Contact Sales",
      ctaLink: "/enterprise"
    }
  ];

  return (
    <section className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-black mb-10 text-center">
          For Teams
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {segments.map((segment) => (
            <div
              key={segment.id}
              className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-black transition-colors"
            >
              <h3 className="text-2xl font-bold text-black mb-3">
                {segment.headline}
              </h3>
              <p className="text-gray-700 mb-6">
                {segment.description}
              </p>
              <Link href={segment.ctaLink}>
                <button className="w-full px-6 py-3 border-2 border-black text-black rounded font-medium hover:bg-black hover:text-white transition-colors">
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
