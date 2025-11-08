import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Learn how xml2compose.dev protects your privacy and handles data.',
};

export default function PrivacyPage() {
  return (
    <div className="container">
      <section className="about-section">
        <div className="container">
          <h2>Privacy Policy</h2>
          <p><strong>Last Updated:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          
          <div style={{ marginTop: '32px' }}>
            <h3>1. Introduction</h3>
            <p>
              At xml2compose.dev, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our services.
            </p>

            <h3 style={{ marginTop: '32px' }}>2. Information We Collect</h3>
            <p>We may collect the following types of information:</p>
            <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
              <li><strong>Email Addresses:</strong> When you subscribe to our newsletter or contact us.</li>
              <li><strong>Usage Data:</strong> Analytics data about how you interact with our website (via Google Analytics).</li>
              <li><strong>XML Files:</strong> Files you upload to our converter tool are processed in your browser and never stored on our servers.</li>
            </ul>

            <h3 style={{ marginTop: '32px' }}>3. How We Use Your Information</h3>
            <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
              <li>To provide and improve our services</li>
              <li>To send launch notifications and updates (if you subscribed)</li>
              <li>To respond to your inquiries and support requests</li>
              <li>To analyze website usage and optimize user experience</li>
            </ul>

            <h3 style={{ marginTop: '32px' }}>4. Data Security</h3>
            <p>
              We implement industry-standard security measures to protect your data. All XML conversions happen client-side in your browser, and we never store uploaded files on our servers.
            </p>

            <h3 style={{ marginTop: '32px' }}>5. Third-Party Services</h3>
            <p>We use the following third-party services:</p>
            <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
              <li><strong>Google Analytics:</strong> For website analytics and usage tracking</li>
              <li><strong>Google AdSense:</strong> For serving ads (cookies may be used)</li>
              <li><strong>Web3Forms:</strong> For handling form submissions securely</li>
            </ul>

            <h3 style={{ marginTop: '32px' }}>6. Your Rights</h3>
            <p>You have the right to:</p>
            <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
              <li>Access your personal data</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of email communications</li>
              <li>Disable cookies through your browser settings</li>
            </ul>

            <h3 style={{ marginTop: '32px' }}>7. Cookies</h3>
            <p>
              We use cookies and similar technologies to improve your experience. You can control cookie settings through your browser preferences.
            </p>

            <h3 style={{ marginTop: '32px' }}>8. Changes to This Policy</h3>
            <p>
              We may update this Privacy Policy from time to time. Significant changes will be posted on this page with an updated effective date.
            </p>

            <h3 style={{ marginTop: '32px' }}>9. Contact Us</h3>
            <p>
              If you have questions about this Privacy Policy, please contact us at <strong>support@xml2compose.dev</strong>.
            </p>
          </div>

          <div style={{ marginTop: '48px', padding: '24px', background: 'rgba(0, 122, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(0, 122, 255, 0.3)' }}>
            <p style={{ margin: 0 }}>
              <strong>Important:</strong> By using xml2compose.dev, you agree to this Privacy Policy and our data practices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
