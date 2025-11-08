import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the xml2compose team for support, feedback, or collaboration opportunities.',
};

export default function ContactPage() {
  return (
    <div className="container">
      <section className="about-section">
        <div className="container">
          <h2>Contact Us</h2>
          <p>
            We value your feedback and inquiries. Get in touch with us through the following channels:
          </p>
          
          <div style={{ display: 'grid', gap: '24px', marginTop: '32px' }}>
            <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-secondary)' }}>
              <h3>Email</h3>
              <p><strong>support@xml2compose.dev</strong></p>
              <p>For technical support, feature requests, or general inquiries. We typically respond within 24-48 hours.</p>
            </div>
            
            <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-secondary)' }}>
              <h3>GitHub</h3>
              <p><strong>github.com/xml2compose</strong></p>
              <p>Report bugs, request features, or contribute to the project on our GitHub repository.</p>
            </div>
            
            <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-secondary)' }}>
              <h3>Community</h3>
              <p>Join our community discussions and connect with other developers using xml2compose.</p>
            </div>
          </div>

          <div style={{ marginTop: '48px', padding: '24px', background: 'rgba(255, 149, 0, 0.1)', borderRadius: '12px', border: '1px solid rgba(255, 149, 0, 0.3)' }}>
            <h3>Privacy & Data</h3>
            <p>
              We respect your privacy. All correspondence is confidential. For more information about how we handle data, please review our <a href="/privacy" style={{ color: 'var(--primary-color)' }}>Privacy Policy</a>.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
