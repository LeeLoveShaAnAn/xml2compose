# xml2compose.dev

一个现代化的工具，帮助开发者将Android XML布局文件转换为Jetpack Compose代码。

## 🎨 设计系统

本项目采用苹果设计风格，具有以下特点：

### 颜色系统
- **主色调**: `#007AFF` (iOS蓝)
- **次要色**: `#5856D6` (紫色)
- **强调色**: `#FF2D92` (粉色)
- **成功色**: `#34C759` (绿色)
- **警告色**: `#FF9500` (橙色)
- **错误色**: `#FF3B30` (红色)

### 间距系统
- `--space-1`: 4px
- `--space-2`: 8px
- `--space-3`: 12px
- `--space-4`: 16px
- `--space-5`: 20px
- `--space-6`: 24px
- `--space-8`: 32px
- `--space-10`: 40px
- `--space-12`: 48px
- `--space-16`: 64px
- `--space-20`: 80px
- `--space-24`: 96px

### 圆角系统
- `--radius-xs`: 4px
- `--radius-sm`: 8px
- `--radius-md`: 12px
- `--radius-lg`: 16px
- `--radius-xl`: 20px
- `--radius-2xl`: 24px

### 字体系统
- **主字体**: `-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif`
- **等宽字体**: `'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace`

### 阴影系统
- `--shadow-xs`: 0 1px 2px rgba(0, 0, 0, 0.05)
- `--shadow-sm`: 0 2px 4px rgba(0, 0, 0, 0.1)
- `--shadow-md`: 0 4px 8px rgba(0, 0, 0, 0.12)
- `--shadow-lg`: 0 8px 16px rgba(0, 0, 0, 0.15)
- `--shadow-xl`: 0 16px 32px rgba(0, 0, 0, 0.2)

## 📱 页面结构

### 1. 首页 (index.html)
- **功能**: 展示项目介绍和代码转换示例
- **特色**: 
  - 响应式代码对比展示
  - 更多示例展示
  - 邮件订阅功能
  - 反馈表单

### 2. 转换器页面 (converter.html)
- **功能**: 在线XML到Compose代码转换
- **特色**:
  - 实时代码转换
  - 语法高亮
  - 复制功能
  - 响应式布局

### 3. 博客页面 (blog.html)
- **功能**: 技术文章展示
- **特色**:
  - 卡片式布局
  - 渐变背景
  - 暗色模式支持
  - 动画效果

### 4. 博客文章页面 (blog/*.html)
- **功能**: 详细的技术文章
- **特色**:
  - 代码块语法高亮
  - 响应式排版
  - 阅读时间估算
  - 社交分享

## 🚀 功能特性

### 多语言支持
- 默认使用英文
- 支持中英文切换
- 响应式语言切换按钮

### 暗色模式
- 自动检测系统主题
- 平滑的主题切换动画
- 优化的暗色配色方案

### 响应式设计
- 移动端优先设计
- 断点: 640px, 768px, 1024px, 1280px
- 流畅的布局适配

### 可访问性
- 键盘导航支持
- 焦点状态优化
- 语义化HTML结构
- ARIA标签支持

### 性能优化
- CSS变量系统
- 优化的字体加载
- 平滑的动画过渡
- 最小化的重绘重排

## 🛠️ 技术栈

- **HTML5**: 语义化标记
- **CSS3**: 现代CSS特性
- **JavaScript**: 原生JS，无框架依赖
- **字体**: Inter, SF Pro Display, SF Mono
- **图标**: SVG图标系统

## 📁 文件结构

```
xml2compose/
├── index.html              # 首页
├── converter.html          # 转换器页面
├── blog.html              # 博客列表页
├── style.css              # 主样式文件
├── converter.css          # 转换器专用样式
├── converter.js           # 转换器逻辑
├── script.js              # 通用脚本
├── blog/                  # 博客文章目录
│   ├── jetpack-compose-migration.html
│   ├── xml-layout-optimization.html
│   └── sample-article.html
└── README.md              # 项目说明
```

## 🎯 使用指南

### 开发环境
1. 克隆项目到本地
2. 使用现代浏览器打开HTML文件
3. 推荐使用Live Server进行本地开发

### 自定义样式
1. 修改 `style.css` 中的CSS变量
2. 遵循设计系统的命名规范
3. 使用提供的间距和颜色变量

### 添加新页面
1. 复制现有页面模板
2. 引入 `style.css` 主样式文件
3. 添加页面专用样式
4. 保持一致的HTML结构

## 🔧 维护说明

### 样式更新
- 所有样式更改应在 `style.css` 中进行
- 使用CSS变量保持一致性
- 遵循BEM命名规范

### 内容更新
- 博客文章放在 `blog/` 目录下
- 保持HTML结构的语义化
- 定期更新sitemap.xml

### 性能监控
- 定期检查页面加载速度
- 优化图片和字体资源
- 监控Core Web Vitals指标

## 📄 许可证

本项目采用MIT许可证，详见LICENSE文件。

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目！

### 贡献流程
1. Fork项目
2. 创建功能分支
3. 提交更改
4. 创建Pull Request

### 代码规范
- 使用语义化的HTML
- 遵循CSS变量命名规范
- 保持代码注释清晰
- 确保响应式设计

---

**xml2compose.dev** - 让Android UI开发更简单、更现代！