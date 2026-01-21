import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl font-bold text-black mb-8">
            Terms of Service
          </h1>
          <p className="text-gray-500 mb-12">Last updated: January 2026</p>

          <div className="prose prose-gray max-w-none">
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                By accessing or using virtuality.fashion&apos;s website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">2. Services Description</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                virtuality.fashion provides digital fashion design services including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>3D garment design and visualization</li>
                <li>2D technical drawings and specifications</li>
                <li>Virtual prototyping</li>
                <li>Product rendering</li>
                <li>Virtual try-on solutions</li>
                <li>Collaborative design platform access</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">3. User Accounts</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding your account credentials and for any activities under your account.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                You agree to notify us immediately of any unauthorized access to your account.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">4. Intellectual Property</h2>
              <h3 className="text-xl font-semibold text-black mb-3">Our Content</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                All content on our website, including text, graphics, logos, and software, is the property of virtuality.fashion and is protected by intellectual property laws.
              </p>
              <h3 className="text-xl font-semibold text-black mb-3">Your Content</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                You retain ownership of any designs, specifications, or materials you provide to us. By submitting content, you grant us a license to use it solely for providing our services to you.
              </p>
              <h3 className="text-xl font-semibold text-black mb-3">Deliverables</h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Upon full payment, you will own the rights to the final deliverables created specifically for your project, unless otherwise agreed in writing.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">5. Payment Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Payment terms will be specified in your project agreement. Unless otherwise stated:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
                <li>A deposit may be required before work begins</li>
                <li>Final payment is due upon project completion</li>
                <li>All fees are non-refundable unless otherwise specified</li>
                <li>Late payments may incur additional charges</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">6. Confidentiality</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We understand the sensitive nature of fashion design. We agree to keep all project details, designs, and business information confidential and will not disclose them to third parties without your consent.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To the maximum extent permitted by law, virtuality.fashion shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of our services.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Our total liability shall not exceed the amount paid by you for the specific service giving rise to the claim.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">8. Termination</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We may terminate or suspend your access to our services immediately, without prior notice, for any breach of these Terms. Upon termination, your right to use our services will cease immediately.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">9. Changes to Terms</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                We reserve the right to modify these terms at any time. We will notify users of significant changes via email or website notice. Continued use of our services after changes constitutes acceptance of the new terms.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">10. Governing Law</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-black mb-4">11. Contact Us</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
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
