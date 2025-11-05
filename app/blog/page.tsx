import Link from 'next/link';
import { getAllPosts } from '../../content/posts';

export const metadata = {
  title: '博客 · Compose 迁移洞察',
  description:
    '精选 Compose 迁移实践文章，涵盖架构、状态管理、动效优化与真实案例复盘，每篇均通过技术审校确保质量。',
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="page-blog">
      <header className="card" style={{ marginBottom: 'var(--space-12)' }}>
        <h1 className="section-title" style={{ marginBottom: 'var(--space-3)' }}>
          Compose 迁移知识库
        </h1>
        <p className="section-subtitle" style={{ marginBottom: 0 }}>
          每篇文章都包含详尽的步骤、验证指标与合规提示，帮助你避免常见风险。内容定期更新，确保与 Android 生态同步。
        </p>
      </header>

      <div className="blog-grid">
        {posts.map((post) => (
          <article key={post.slug} className="blog-card" aria-labelledby={`${post.slug}-title`}>
            <span className="badge">阅读 {post.readingMinutes} 分钟</span>
            <h3 id={`${post.slug}-title`}>{post.title}</h3>
            <p>{post.description}</p>
            <dl style={{ margin: 0, display: 'grid', gap: '0.35rem' }}>
              <div>
                <dt className="sr-only">发布时间</dt>
                <dd>发布：{post.publishedAt}</dd>
              </div>
              <div>
                <dt className="sr-only">最近更新</dt>
                <dd>更新：{post.updatedAt}</dd>
              </div>
              <div>
                <dt className="sr-only">作者</dt>
                <dd>作者：{post.author}</dd>
              </div>
            </dl>
            <div className="pill-list" aria-label="文章标签">
              {post.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
            <Link className="cta-button" href={`/blog/${post.slug}`}>
              阅读全文
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

