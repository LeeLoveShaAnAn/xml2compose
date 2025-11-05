import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于我们',
  description: '认识 xml2compose.dev 团队，了解我们的使命、方法论以及对内容质量与政策合规的承诺。',
};

const teamMembers = [
  {
    name: '刘佳',
    role: 'Android 架构师',
    focus: '负责转换算法与性能优化，拥有 12 年移动端经验。',
  },
  {
    name: '王潇',
    role: '解决方案工程师',
    focus: '主导企业咨询项目与质量保障体系搭建。',
  },
  {
    name: '陈颖',
    role: '全栈工程师',
    focus: '负责 Web 平台、Next.js 架构与可访问性标准执行。',
  },
  {
    name: '赵彦',
    role: '体验与动效设计师',
    focus: '制定跨平台设计系统，确保 UI/UX 一致性。',
  },
];

const principles = [
  '透明：所有文档明确标注数据来源、适用范围与潜在限制。',
  '安全：工具默认本地运行，不上传用户代码；线下合作遵循保密协议。',
  '可持续：定期更新知识库，跟进 Google 与 Jetpack Compose 最新政策与版本。',
  '教育友好：为学生与教师准备的指南保持语言简洁，提供示例与练习。',
];

export default function AboutPage() {
  return (
    <div className="content">
      <header className="card">
        <span className="badge">我们的使命</span>
        <h1>关于 xml2compose.dev</h1>
        <p>
          我们是一支拥有跨平台背景的资深工程师团队，专注于帮助开发者安全地从 Android XML 迁移到 Jetpack Compose。自 2020 年起，我们与国内外多家教育、金融与出行企业合作，积累了丰富的架构决策与合规案例。
        </p>
      </header>

      <section className="card" aria-labelledby="principle-heading">
        <h2 id="principle-heading">价值观与承诺</h2>
        <ul>
          {principles.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <div className="note">
          我们遵循 <a href="https://support.google.com/adsense/answer/9335564">Google Publisher Policies</a>，确保站点内容对所有年龄层用户友好，不包含误导、危险或受限制信息。
        </div>
      </section>

      <section className="card" aria-labelledby="team-heading">
        <h2 id="team-heading">核心团队</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-6)' }}>
          {teamMembers.map((member) => (
            <li key={member.name} style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)', paddingBottom: 'var(--space-4)' }}>
              <h3 style={{ marginBottom: '0.35rem' }}>{member.name}</h3>
              <p style={{ margin: 0, fontWeight: 600 }}>{member.role}</p>
              <p style={{ marginTop: '0.4rem' }}>{member.focus}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card" aria-labelledby="transparency-heading">
        <h2 id="transparency-heading">透明度报告节选</h2>
        <table>
          <thead>
            <tr>
              <th scope="col">季度</th>
              <th scope="col">新增文章</th>
              <th scope="col">工具更新</th>
              <th scope="col">用户反馈处理</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025 Q3</td>
              <td>4 篇（新增案例与政策解读）</td>
              <td>3 次（引入 Next.js 14 SSR、性能优化）</td>
              <td>12 条反馈，平均响应 36 小时</td>
            </tr>
            <tr>
              <td>2025 Q2</td>
              <td>3 篇</td>
              <td>2 次（改进转换器兼容性）</td>
              <td>15 条反馈，平均响应 30 小时</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}

