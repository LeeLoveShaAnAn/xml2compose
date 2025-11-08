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
          
          <h3 style={{ marginTop: '48px', marginBottom: '24px' }}>Our Team</h3>
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-secondary)' }}>
              <h4>刘佳 · Android 架构师</h4>
              <p>负责转换算法与性能优化，拥有 12 年移动端经验。</p>
            </div>
            <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-secondary)' }}>
              <h4>王潇 · 解决方案工程师</h4>
              <p>主导企业咨询项目与质量保障体系搭建。</p>
            </div>
            <div style={{ padding: '24px', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--border-secondary)' }}>
              <h4>陈颖 · 全栈工程师</h4>
              <p>负责 Web 平台、Next.js 架构与可访问性标准执行。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
