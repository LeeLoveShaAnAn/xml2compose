# xml2compose.dev

一个面向教育机构与企业团队的 Jetpack Compose 迁移支持平台，现已升级为 **Next.js 14 App Router** 架构，提供自动转换工具、原创技术文档与合规指南。

## ✨ 功能概览

- **在线转换器**：浏览器本地执行 XML → Compose 代码转换，附带导入语句、警告与性能建议。
- **知识库**：精选迁移蓝图、状态管理、动效优化与案例复盘，全部为原创内容并定期更新。
- **合规保障**：内置隐私政策、数据使用说明、联系渠道，确保站点符合 Google Publisher Policies、页面体验与隐私要求。
- **响应式体验**：统一设计系统、可访问性优化（跳转链接、语义化结构、焦点样式）、移动优先布局。

## 🧱 技术架构

- **框架**：Next.js 14 + App Router，优先使用 Server Components；Converter 使用 Client Component 挂载原生转换逻辑。
- **语言**：TypeScript + React 18。
- **样式**：`app/globals.css` 维护设计系统变量、响应式规则和可访问性样式。
- **内容**：博客数据集中在 `content/posts.ts`，支持 SSG；隐私、关于、联系等页面为静态 Server Components。
- **SSR/SSG**：主页、博客列表、文章详情采用静态生成；如需纯静态部署，可执行 `next build && next export`。

## 📁 目录结构

```
xml2compose/
├── app/
│   ├── layout.tsx             # 根布局（Server Component）
│   ├── page.tsx               # 首页
│   ├── converter/page.tsx     # 在线转换器（Client + Server 混合）
│   ├── blog/
│   │   ├── page.tsx           # 博客列表
│   │   └── [slug]/page.tsx    # 博客详情（SSG）
│   ├── about/page.tsx         # 关于我们
│   ├── contact/page.tsx       # 联系我们
│   └── privacy/page.tsx       # 隐私政策与数据使用说明
├── components/                # 站点级组件（Header、Footer、ConverterClient 等）
├── content/posts.ts           # 博客元数据与正文段落
├── js/core/                   # XML → Compose 转换核心逻辑（沿用原有模块）
├── public/                    # 静态资源（如需要）
├── next.config.mjs            # Next.js 配置
├── tsconfig.json              # TypeScript 配置
└── README.md
```

> 历史静态 HTML/CSS/JS 文件已由 Next.js App Router 取代，仅保留转换核心逻辑以保证功能一致性。

## 🚀 快速开始

```bash
npm install
npm run dev   # 在 http://localhost:3000 启动开发服务器

npm run build # 生成生产构建（默认 SSR/SSG）
npm run start # 仅在完成 build 后执行
```

若需生成纯静态站点，可执行：

```bash
npm run build
npx next export
```

## 🧭 页面说明

- `主页 /`：展示核心能力、合规检查清单、迁移流程与行动召唤。
- `转换器 /converter`：Client 端转换器组件，强调本地执行与版权提示。
- `博客 /blog`：展示所有文章卡片，附带发布时间、标签与阅读时长。
- `博客详情 /blog/[slug]`：结构化章节、代码片段、提示信息，便于教育使用。
- `关于我们 /about`：团队成员、价值观、透明度报告。
- `联系我们 /contact`：邮件、热线、教育合作渠道与承诺。
- `隐私政策 /privacy`：数据收集范围、COPPA 应对、用户权利、联系地址。

## ✅ 内容质量与合规流程

1. **原创与透明**：所有文章由团队审校，包含数据来源与适用条件，避免薄内容或误导表述。
2. **政策自检**：发布前核对 Google Publisher Policies、AdSense 页面体验、隐私要求；重大更新记录在 README 与透明度表格。
3. **隐私保护**：默认最小化收集，提供撤回与删除流程，未成年人内容附加声明与禁用兴趣追踪。
4. **可访问性**：跳过链接、语义结构、ARIA 标签、键盘导航和对比度均在设计阶段校验。
5. **持续更新**：季度复盘新增文章、工具更新、用户反馈响应时效，见关于页面的透明度表。

## 🛠️ 开发与维护

- 修改样式时集中在 `app/globals.css`，遵循设计变量命名。
- 新增页面使用 Server Components，必要时在 `components/` 中创建 Client Component。
- 添加文章：在 `content/posts.ts` 中补充对象，系统会自动生成列表与详情。
- 更新导航或页脚：修改 `components/SiteHeader.tsx` 或 `components/SiteFooter.tsx`。
- 发布前检查：
  - `npm run lint` 确保通过 Next.js Lint/TypeScript 检查。
  - 运行 `npm run build` 验证 SSR/SSG 编译正常。
  - 手动检查页面无敏感、侵权或误导内容。

## 📄 许可证

MIT License。详见仓库根目录中的 `LICENSE`。

## 🤝 贡献指南

1. Fork 仓库并创建特性分支。
2. 执行 `npm run lint` 与 `npm run build` 确认通过。
3. 在 Pull Request 描述中说明内容更新与合规自检结果。
4. 若涉及隐私或政策文案，请一并更新 README 与相关页面。

---

**xml2compose.dev** —— 让 Android UI 迁移更透明、可控、合规。
