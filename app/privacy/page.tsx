export default function PrivacyPage() {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
            <p>
              JOB HOUSE PRODUCTION ("we", "us", "our", or "Company") operates the jobhouseproduction.com website 
              and related services. This Privacy Policy explains our data handling practices and your privacy rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
            <p>We may collect information about you in the following ways:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Information you provide directly (name, email, phone, etc.)</li>
              <li>Information about your usage of our platform</li>
              <li>Information from cookies and similar tracking technologies</li>
              <li>Information from third-party sources</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Provide and improve our services</li>
              <li>Communicate with you about our services</li>
              <li>Process your studio service requests</li>
              <li>Personalize your experience</li>
              <li>Analyze usage patterns and trends</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">4. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal data 
              against unauthorized access, alteration, disclosure, or destruction. However, no method of 
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">5. Cookies and Tracking</h2>
            <p>
              We use cookies and similar tracking technologies to enhance your experience. You can control 
              cookie settings through your browser preferences.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">6. Third-Party Links</h2>
            <p>
              Our website may contain links to third-party websites. We are not responsible for the privacy 
              practices of external sites. Please review their privacy policies before providing your information.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">7. Your Rights</h2>
            <p>You have the right to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Access your personal data</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Data portability</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">8. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="font-semibold text-foreground">
              Email: privacy@jobhouseproduction.com
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of any changes by 
              updating the "Last Updated" date of this Privacy Policy.
            </p>
            <p className="text-sm text-muted-foreground">Last Updated: February 2024</p>
          </section>
        </div>
      </div>
    </div>
  )
}
