import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '联系我们',
  description: '获取技术支持、政策咨询或教育合作信息，xml2compose.dev 团队将在 72 小时内邮件回复。',
};

const contactChannels = [
  {
    label: '电子邮件',
    value: 'support@xml2compose.dev',
    description: '请附上项目背景、期望完成时间与团队规模，我们会安排专属顾问跟进。',
  },
  {
    label: '政策合规热线',
    value: '+86-10-6800-2025（工作日 10:00-18:00）',
    description: '适用于了解内容审核要求、隐私政策或青少年保护标准的问题。',
  },
  {
    label: '教育合作',
    value: 'academy@xml2compose.dev',
    description: '如果你来自学校或培训机构，请说明课程计划及学员年龄段，我们会提供定制化授权方案。',
  },
];

export default function ContactPage() {
  return (
    <div className="content">
      <header className="card">
        <span className="badge">服务承诺</span>
        <h1>联系我们</h1>
        <p>
          我们重视每一次沟通请求。提交后 72 小时内，你将收到来自 xml2compose.dev 官方邮箱的回复。对于紧急生产事故，请直接拨打政策合规热线并在邮件中标注
          “紧急”。
        </p>
      </header>

      <section aria-labelledby="contact-preference" className="card">
        <h2 id="contact-preference">沟通渠道</h2>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 'var(--space-6)' }}>
          {contactChannels.map((channel) => (
            <li key={channel.label} style={{ borderBottom: '1px solid rgba(15, 23, 42, 0.08)', paddingBottom: 'var(--space-4)' }}>
              <h3 style={{ marginBottom: '0.35rem' }}>{channel.label}</h3>
              <p style={{ fontWeight: 600 }}>{channel.value}</p>
              <p>{channel.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="service-scope" className="card">
        <h2 id="service-scope">我们可以提供的帮助</h2>
        <ul>
          <li>制定符合 Google Publisher Policies 的产品内容规划与审核流程。</li>
          <li>为教育场景或未成年人用户提供可访问性与隐私保护建议。</li>
          <li>协助对接 Jetpack Compose 迁移项目的架构评审、代码走查与上线验收。</li>
        </ul>
        <div className="note">
          我们不会收集除联系所需信息之外的任何个人数据。收到你的邮件后，我们将提供数据处理说明与删除选项。
        </div>
      </section>
    </div>
  );
}

