import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllPosts, getPostBySlug, type PostSection } from '../../../content/posts';

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container">
      <article>
        <h2>{post.title}</h2>
        <p className="blog-meta">
          By {post.author} • Published: {post.publishedAt} • Updated: {post.updatedAt} • {post.readingMinutes} min read
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {post.tags.map((tag: string) => (
            <span
              key={tag}
              style={{
                padding: '4px 12px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 600,
                background: 'rgba(0, 122, 255, 0.1)',
                color: 'var(--primary-color)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {post.sections.map((section: PostSection, index: number) => (
          <div key={index} style={{ marginBottom: '32px' }}>
            {section.heading && <h3 style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>{section.heading}</h3>}
            {section.paragraphs?.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
            {section.list && (
              <ul style={{ paddingLeft: '24px', marginBottom: '16px' }}>
                {section.list.map((item, idx) => (
                  <li key={idx} style={{ marginBottom: '8px' }}>{item}</li>
                ))}
              </ul>
            )}
            {section.code && (
              <pre style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '14px',
                background: 'var(--bg-secondary)',
                padding: '16px',
                borderRadius: '8px',
                overflowX: 'auto',
                marginBottom: '16px'
              }}>
                <code>{section.code}</code>
              </pre>
            )}
            {section.note && (
              <div style={{
                padding: '12px 16px',
                borderRadius: '8px',
                background: 'rgba(255, 149, 0, 0.1)',
                border: '1px solid rgba(255, 149, 0, 0.3)',
                marginBottom: '16px'
              }}>
                <strong>Note:</strong> {section.note}
              </div>
            )}
          </div>
        ))}

        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid var(--border-secondary)' }}>
          <Link href="/blog" className="button primary-button">
            ← Back to Blog
          </Link>
        </div>
      </article>
    </div>
  );
}
