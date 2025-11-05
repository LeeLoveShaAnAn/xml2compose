import Link from 'next/link';

const capabilityHighlights = [
  {
    title: '自动化转换引擎',
    description:
      '基于AST的解析与语义校验，支持ConstraintLayout、Material组件、主题样式与自定义视图适配。',
  },
  {
    title: '迁移质量评估',
    description:
      '内置90+质量检查项，包括UI一致性、性能指标、无障碍适配以及Compose最佳实践建议。',
  },
  {
    title: '团队培训手册',
    description:
      '提供循序渐进的学习路径，从语法基础到复杂界面构建，帮助初级开发者快速上手Compose。',
  },
];

const policyChecklist = [
  '所有页面均为原创内容，附带示例代码、最佳实践与案例分析。',
  '明确展示团队信息、联系方式与数据处理方式，确保透明可信。',
  '提供隐私政策、Cookie说明与用户选择权，满足隐私合规要求。',
  '针对未成年人内容的特别说明，默认不进行兴趣类追踪。',
];

const metrics = [
  { label: '成功迁移项目', value: '130+' },
  { label: '平均节省工时', value: '68%' },
  { label: '代码质量建议', value: '90+' },
  { label: '满意度评分', value: '4.9 / 5' },
];

export default function HomePage() {
  return (
    <div className="page-home">
      <section className="hero" aria-labelledby="hero-heading">
        <span className="badge">透明合规 · 高质量内容</span>
        <h1 id="hero-heading">让 Android XML 向 Jetpack Compose 迁移更安全高效</h1>
        <p>
          xml2compose.dev 团队结合真实项目经验，打造面向教育机构与企业团队的迁移工具链。我们遵循
          Google Publisher Policies 要求，提供原创、可靠且可验证的技术内容，帮助你快速完成界面重构。若你是初学者，也可以使用我们的学习路径循序渐进掌握Compose。
        </p>
        <div style={{ marginTop: 'var(--space-8)', display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
          <Link className="cta-button" href="/converter">
            立即试用在线转换器
          </Link>
          <Link className="nav-links" style={{ padding: '0.65rem 1.25rem', borderRadius: '999px', border: '1px solid rgba(0, 122, 255, 0.18)', fontWeight: 600 }} href="/blog">
            阅读迁移实践文章
          </Link>
        </div>
      </section>

      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="section-title">
          数据验证迁移成效
        </h2>
        <p className="section-subtitle">
          以下指标来自历次咨询与内部项目复盘，帮助你评估工具可带来的收益。所有数据均以季度为单位定期复核。
        </p>
        <div className="metrics-grid" role="list">
          {metrics.map((metric) => (
            <article key={metric.label} className="metric-card" role="listitem">
              <strong>{metric.value}</strong>
              <span>{metric.label}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="split-section" aria-labelledby="capability-heading">
        <div>
          <h2 id="capability-heading" className="section-title">
            三大核心能力覆盖迁移全流程
          </h2>
          <p className="section-subtitle">
            工具、文档与培训内容均由资深安卓与前端工程师编写，确保内容可读、可操作、可追溯。
          </p>
          <div className="content">
            {capabilityHighlights.map((item) => (
              <article key={item.title} className="list-divider">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
        <aside className="card" aria-labelledby="policy-heading">
          <h3 id="policy-heading">AdSense 合规检查清单</h3>
          <p>我们在发布前对每个页面执行以下检查，确保内容价值与透明度：</p>
          <ul>
            {policyChecklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="note">
            所有示例代码均标注来源，禁止展示侵权或违规内容。如发现问题，请通过联系我们页面反馈，我们将在72小时内响应。
          </p>
        </aside>
      </section>

      <section aria-labelledby="workflow-heading">
        <h2 id="workflow-heading" className="section-title">
          迁移流程四步走
        </h2>
        <div className="card content">
          <article>
            <h3>1. 评估与规划</h3>
            <p>
              上传现有XML布局，我们会生成兼容性评估报告，并给出组件映射、主题适配及无障碍策略。报告遵循透明原则，包含数据来源与假设说明。
            </p>
          </article>
          <article>
            <h3>2. 自动转换与代码审查</h3>
            <p>
              使用在线转换器生成Compose草稿，并结合质量规则进行审查。我们会标记所有需要人工确认的部分，避免误导或信息缺失。
            </p>
          </article>
          <article>
            <h3>3. 性能与体验优化</h3>
            <p>
              内置性能基线，包括重组次数、启动时间与内存占用评估建议。文档还提供屏幕阅读器测试用例与焦点顺序校验指南。
            </p>
          </article>
          <article>
            <h3>4. 团队培训与发布</h3>
            <p>
              提供培训计划模板、代码规范以及回归测试清单，帮助团队在发布前进行多角色验收，确保上线质量与政策符合性。
            </p>
          </article>
        </div>
      </section>

      <section aria-labelledby="cta-heading" style={{ marginBottom: 'var(--space-16)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <h2 id="cta-heading" className="section-title">
            准备好开始迁移了吗？
          </h2>
          <p className="section-subtitle" style={{ margin: '0 auto var(--space-6)' }}>
            我们的工具适用于教育项目、个人开发者与企业团队。你可以先从转换器体验开始，随后阅读博客了解最佳实践，再通过联系我们获得个性化指导。
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <Link className="cta-button" href="/converter">
              立即转换我的XML
            </Link>
            <Link className="nav-links" style={{ padding: '0.65rem 1.25rem', borderRadius: '999px', border: '1px solid rgba(0, 122, 255, 0.18)', fontWeight: 600 }} href="/contact">
              联系专家团队
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

