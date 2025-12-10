import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-12 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Get Started
        </h2>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <button className="w-full sm:w-auto px-8 py-4 bg-white text-black rounded font-medium hover:bg-gray-100 transition-colors">
              Contact Us
            </button>
          </Link>
          <Link href="/team">
            <button className="w-full sm:w-auto px-8 py-4 border-2 border-white text-white rounded font-medium hover:bg-white hover:text-black transition-colors">
              View Team
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
