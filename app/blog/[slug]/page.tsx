import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getAllPosts, getPostBySlug } from '../../../content/posts';

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
    alternates: {
      canonical: `https://www.xml2compose.dev/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="content" aria-labelledby="post-title">
      <header className="card" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
        <span className="badge">博客文章</span>
        <h1 id="post-title" style={{ marginBottom: 'var(--space-2)' }}>
          {post.title}
        </h1>
        <p style={{ marginTop: 0 }}>{post.description}</p>
        <dl style={{ display: 'grid', gap: '0.35rem', margin: 'var(--space-4) 0 0' }}>
          <div>
            <dt className="sr-only">作者</dt>
            <dd>作者：{post.author}</dd>
          </div>
          <div>
            <dt className="sr-only">发布时间</dt>
            <dd>发布于：{post.publishedAt}</dd>
          </div>
          <div>
            <dt className="sr-only">最近更新</dt>
            <dd>更新于：{post.updatedAt}</dd>
          </div>
          <div>
            <dt className="sr-only">阅读时长</dt>
            <dd>预计阅读时长：{post.readingMinutes} 分钟</dd>
          </div>
        </dl>
        <div className="pill-list" aria-label="标签">
          {post.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </header>

      {post.sections.map((section, index) => (
        <section key={index} aria-labelledby={section.heading ? `section-${index}` : undefined}>
          {section.heading ? (
            <h2 id={`section-${index}`}>{section.heading}</h2>
          ) : null}
          {section.paragraphs?.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
          {section.list ? (
            <ul>
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
          {section.code ? (
            <pre>
              <code>{section.code}</code>
            </pre>
          ) : null}
          {section.note ? <div className="note">{section.note}</div> : null}
        </section>
      ))}
    </article>
  );
}

