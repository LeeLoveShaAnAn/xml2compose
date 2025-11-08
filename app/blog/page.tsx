import Link from 'next/link';
import { getAllPosts } from '../../content/posts';

export const metadata = {
  title: 'Blog - Tech Articles on Android Development',
  description:
    'Explore the latest technical articles on Android development, Jetpack Compose, and XML conversion, sharing best practices and development experience.',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="container">
      <div className="hero" style={{ textAlign: 'center', padding: 'var(--space-20) 0' }}>
        <h1>Tech Blog</h1>
        <p className="subtitle">
          Explore the latest technical articles on Android development, Jetpack Compose, and XML conversion, sharing best practices and development experience
        </p>
      </div>

      <div className="blog-list">
        {posts.map((post) => (
          <article key={post.slug} className="blog-item">
            <span className="badge" style={{ 
              display: 'inline-block',
              padding: '4px 12px',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              textTransform: 'uppercase',
              background: 'rgba(0, 122, 255, 0.1)',
              color: 'var(--primary-color)',
              marginBottom: '12px'
            }}>
              {post.tags[0]}
            </span>
            <h3>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
            <p className="blog-meta">
              📅 {post.publishedAt} • ⏱️ {post.readingMinutes} min read
            </p>
            <p className="blog-summary">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="read-more">
              Read More →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
