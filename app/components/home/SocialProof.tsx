export default function SocialProof() {
  const clients = [
    { name: "Under Armour" },
    { name: "Armani" },
    { name: "Nike" },
    { name: "Zara" },
    { name: "H&M" }
  ];

  return (
    <section className="bg-white border-y border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-center text-sm uppercase tracking-wide text-gray-500 mb-8">
          Trusted by leading fashion brands
        </p>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-8 items-center">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-center opacity-50 hover:opacity-100 transition-opacity"
            >
              <div className="bg-gray-200 h-16 w-32 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500 font-semibold">{client.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
