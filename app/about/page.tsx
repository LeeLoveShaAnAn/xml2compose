import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about the xml2compose team and our mission to streamline Android UI migration.',
};

export default function AboutPage() {
  return (
    <div className="container">
      <section className="about-section">
        <div className="container">
          <h2>About xml2compose</h2>
          <p>
            xml2compose is a powerful tool designed to streamline the transition from traditional Android XML layouts to the modern, declarative UI framework, Jetpack Compose. Our mission is to save developers countless hours of manual conversion, reduce boilerplate code, and help teams adopt Compose faster and more efficiently.
          </p>
          <p>
            Whether you&apos;re migrating a large, existing project or just starting a new one, xml2compose provides an intuitive and reliable solution to bring your UI development into the future.
          </p>
          <p>
            Developed by a team of experienced Android engineers passionate about developer productivity and open source.
          </p>

          <h3 style={{ marginTop: '48px', marginBottom: '16px' }}>Our Mission</h3>
          <p>
            We believe that the future of Android UI development lies in declarative frameworks like Jetpack Compose. Our goal is to make this transition as smooth as possible for development teams worldwide, removing barriers and accelerating adoption.
          </p>

          <h3 style={{ marginTop: '48px', marginBottom: '16px' }}>What We Offer</h3>
          <ul style={{ paddingLeft: '24px', marginBottom: '24px' }}>
            <li><strong>Instant Conversion:</strong> Convert your XML layouts to Compose code in seconds</li>
            <li><strong>Privacy First:</strong> All conversions happen in your browser - we never store your code</li>
            <li><strong>Best Practices:</strong> Generated code follows Compose best practices and conventions</li>
            <li><strong>Educational Resources:</strong> Our blog provides in-depth articles on Compose development</li>
          </ul>

          <h3 style={{ marginTop: '48px', marginBottom: '24px' }}>Our Team</h3>
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-secondary)' }}>
              <h4>Jia Liu · Android Architect</h4>
              <p>Leading conversion algorithms and performance optimization with 12 years of mobile development experience.</p>
            </div>
            <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-secondary)' }}>
              <h4>Xiao Wang · Solutions Engineer</h4>
              <p>Managing enterprise consulting projects and building quality assurance systems.</p>
            </div>
            <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-secondary)' }}>
              <h4>Ying Chen · Full-stack Engineer</h4>
              <p>Responsible for web platform development, Next.js architecture, and accessibility standards implementation.</p>
            </div>
          </div>

          <div style={{ marginTop: '48px', padding: '24px', background: 'rgba(0, 122, 255, 0.1)', borderRadius: '12px', border: '1px solid rgba(0, 122, 255, 0.3)' }}>
            <p style={{ margin: 0 }}>
              <strong>Open Source:</strong> xml2compose is committed to open source principles. We believe in building tools that benefit the entire Android developer community.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
