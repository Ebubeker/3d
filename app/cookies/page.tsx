import Header from '../components/Header';
import Footer from '../components/Footer';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
            Cookie Policy
          </h1>
          <p className="text-gray-500 mb-12">Last updated: January 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">1. What Are Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Cookies are small text files that are stored on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">2. How We Use Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                virtuality.fashion uses cookies for several purposes:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Performance Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Functionality Cookies:</strong> Remember your preferences and settings</li>
                <li><strong>Analytics Cookies:</strong> Collect anonymous data for statistical analysis</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">3. Types of Cookies We Use</h2>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Essential Cookies</h3>
                <p className="text-gray-600 text-sm mb-2">These cookies are necessary for the website to function and cannot be switched off.</p>
                <p className="text-gray-500 text-sm">Duration: Session</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Analytics Cookies</h3>
                <p className="text-gray-600 text-sm mb-2">Help us understand how visitors interact with our website by collecting anonymous information.</p>
                <p className="text-gray-500 text-sm">Duration: Up to 2 years</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Preference Cookies</h3>
                <p className="text-gray-600 text-sm mb-2">Remember your settings and preferences to provide a personalized experience.</p>
                <p className="text-gray-500 text-sm">Duration: Up to 1 year</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-black mb-2">Marketing Cookies</h3>
                <p className="text-gray-600 text-sm mb-2">Used to track visitors across websites to display relevant advertisements.</p>
                <p className="text-gray-500 text-sm">Duration: Up to 1 year</p>
              </div>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">4. Third-Party Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may use third-party services that set cookies on our behalf:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li><strong>Google Analytics:</strong> Website traffic analysis</li>
                <li><strong>Web3Forms:</strong> Contact form submissions</li>
                <li><strong>Social Media:</strong> If you use social sharing features</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                These third parties have their own privacy policies governing the use of cookies.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">5. Managing Cookies</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                You can control and manage cookies in various ways:
              </p>
              <h3 className="text-xl font-semibold text-black mb-3">Browser Settings</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Most browsers allow you to manage cookie settings. You can set your browser to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Block all cookies</li>
                <li>Accept only first-party cookies</li>
                <li>Clear cookies when you close the browser</li>
                <li>Receive a notification before a cookie is stored</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                Please note that blocking cookies may affect your experience on our website and limit certain features.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">6. Cookie Consent</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you first visit our website, you will be presented with a cookie consent banner. You can choose to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>Accept all cookies</li>
                <li>Accept only essential cookies</li>
                <li>Customize your cookie preferences</li>
              </ul>
              <p className="text-gray-600 leading-relaxed mb-4">
                You can change your preferences at any time by clearing your browser cookies and revisiting the site.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">7. Updates to This Policy</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data practices. We encourage you to review this policy periodically.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">8. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <p className="text-gray-600 leading-relaxed">
                Email: info@virtuality.fashion
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
