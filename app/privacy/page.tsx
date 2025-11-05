import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隐私政策与数据使用说明',
  description:
    '说明 xml2compose.dev 如何收集、使用与保护用户信息，遵循 Google Publisher Policies、COPPA 与适用数据合规要求。',
};

const dataPractices = [
  {
    title: '收集的信息',
    items: [
      '站点访问日志：包括浏览器类型、访问时间与匿名化 IP（用于安全审计与性能分析）。',
      '联系请求信息：当你发送邮件或提交表单时，我们会存储姓名、邮箱与描述内容，以便回复。',
      '教学合作数据：仅在双方签署协议后收集，且会通过独立加密存储。',
    ],
  },
  {
    title: '不收集的内容',
    items: [
      '不主动追踪个人身份信息或精准定位数据。',
      '不使用第三方广告 Cookie 或跨站追踪脚本。',
      '不向未成年人展示定向广告或收集营销数据。',
    ],
  },
  {
    title: '数据使用目的',
    items: [
      '回复咨询、提供技术支持与续签服务。',
      '分析站点性能与内容受欢迎程度，以改进产品。',
      '履行法规义务，例如保留必要的财务记录。',
    ],
  },
];

const rights = [
  '访问与导出：你可以随时请求查看或导出我们保存的个人数据。',
  '更正与删除：如需更新或删除信息，请联系我们，7 个工作日内处理完毕。',
  '撤回同意：若你曾授权我们保存信息，可随时撤回，该操作不影响之前基于同意开展的处理。',
  '投诉渠道：如对处理结果不满意，可向所在地数据监管机构投诉，我们会协助提供必要信息。',
];

export default function PrivacyPage() {
  return (
    <div className="content">
      <header className="card">
        <span className="badge">政策透明</span>
        <h1>隐私政策与数据使用说明</h1>
        <p>
          xml2compose.dev 坚持最小化数据收集原则，遵守 Google Publisher Policies、欧盟 GDPR、加州 CCPA 以及《儿童在线隐私保护法》（COPPA）。我们将在本页面实时更新政策变更，并在重大修改时通过邮件通知订阅用户。
        </p>
      </header>

      <section id="data-usage" className="card" aria-labelledby="data-practice-heading">
        <h2 id="data-practice-heading">数据处理详情</h2>
        {dataPractices.map((practice) => (
          <article key={practice.title} style={{ marginBottom: 'var(--space-4)' }}>
            <h3>{practice.title}</h3>
            <ul>
              {practice.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
        <div className="note">
          所有访问日志将保留 180 天并自动删除。对于教学合作项目，我们会与合作方签订数据处理协议（DPA），明确双方责任。
        </div>
      </section>

      <section className="card" aria-labelledby="child-protection-heading">
        <h2 id="child-protection-heading">未成年人保护</h2>
        <p>
          如果你的项目面向 13 岁以下用户，请在首次联系时告知我们，我们会提供 COPPA 合规指引并禁用任何可能的兴趣类追踪。所有面向青少年的页面均不包含评论区或用户生成内容，避免出现不当互动。
        </p>
      </section>

      <section className="card" aria-labelledby="rights-heading">
        <h2 id="rights-heading">你的权利</h2>
        <ul>
          {rights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section id="contact" className="card" aria-labelledby="contact-heading">
        <h2 id="contact-heading">隐私相关联系方式</h2>
        <p>隐私问题请发送至：privacy@xml2compose.dev，或邮寄至：</p>
        <address style={{ fontStyle: 'normal', lineHeight: 1.8 }}>
          北京市海淀区知春路 108 号创想大厦 A 座 12F<br />
          xml2compose.dev 数据保护办公室
        </address>
        <p>请在邮件标题注明“隐私请求”，我们会在 7 个工作日内回复。</p>
      </section>
    </div>
  );
}

