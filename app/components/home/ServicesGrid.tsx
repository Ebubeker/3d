export default function ServicesGrid() {
  const services = [
    {
      id: 1,
      title: "2D Flats",
      description: "Technical drawings",
      icon: "📐"
    },
    {
      id: 2,
      title: "3D Design",
      description: "CLO3D simulation",
      icon: "🎨"
    },
    {
      id: 3,
      title: "Prototyping",
      description: "Digital samples",
      icon: "💎"
    },
    {
      id: 4,
      title: "Rendering",
      description: "Photorealistic visuals",
      icon: "📊"
    },
    {
      id: 5,
      title: "Virtual Try-On",
      description: "Digital fitting",
      icon: "👥"
    },
    {
      id: 6,
      title: "Cloud Platform",
      description: "On-demand experts",
      icon: "🌐"
    }
  ];

  return (
    <section className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-black mb-10 text-center">
          Services
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-xl p-6 border border-gray-200 hover:border-gray-400 transition-colors"
            >
              <div className="text-3xl mb-3">{service.icon}</div>
              <h3 className="text-xl font-bold text-black mb-2">
                {service.title}
              </h3>
              <p className="text-gray-700">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
