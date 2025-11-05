export type PostSection = {
  heading?: string;
  paragraphs?: string[];
  list?: string[];
  code?: string;
  note?: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  readingMinutes: number;
  sections: PostSection[];
};

export const posts: BlogPost[] = [
  {
    slug: 'compose-migration-blueprint',
    title: 'Android XML 向 Compose 迁移蓝图：从评估到发布',
    description:
      '总结我们在 20+ 企业项目中的迁移经验，提供可落地的评估流程、风险控制方案与上线检查清单。',
    publishedAt: '2025-03-12',
    updatedAt: '2025-10-20',
    author: '刘佳 · Android 架构师',
    tags: ['迁移策略', '团队协作', '风险控制'],
    readingMinutes: 12,
    sections: [
      {
        paragraphs: [
          '在真正进入 Compose 重写之前，团队需要确认业务优先级、组件依赖以及历史遗留债务。我们建议建立统一的迁移面板（Migration Control Board），让产品、设计、开发与 QA 均可追踪任务进度。',
        ],
      },
      {
        heading: '阶段一：资产盘点',
        paragraphs: [
          '从 git 仓库提取所有布局文件，按照业务域、复用率和复杂度划分优先等级。我们采用三色标记法：',
        ],
        list: [
          '绿色：简单列表/容器类布局，可直接转换并在 1-2 天内完成验收；',
          '黄色：涉及自定义 View 或复杂状态逻辑，需要额外验证 Compose 等效实现；',
          '红色：依赖三方 SDK 或输入法等特殊交互的页面，建议保持 XML 直至相关生态完善。',
        ],
      },
      {
        heading: '阶段二：建立设计对照表',
        paragraphs: [
          '设计团队应提供组件基线（Color、Typography、Shape），并与 Compose `MaterialTheme` 对应起来。通过 Figma Tokens 或 Style Dictionary 生成的 JSON，可以直接导入到 Compose 与 Web 端，降低跨端差异。',
        ],
        note: '提示：确保对照表文档对外公开访问，符合 Google 对“透明度”的要求，避免因信息缺失而被判定为薄内容。',
      },
      {
        heading: '阶段三：测试与发布',
        paragraphs: [
          'Regression Test 需覆盖：UI 层级对齐、无障碍服务（TalkBack/VoiceOver）、性能基准（启动时间、绘制帧率）。推荐引入 Macrobenchmark 进行可重复的性能测试，并在 PR 模板中强制填写测试结果。',
        ],
        code: `fun ColumnScope.ReleaseChecklist() {
    Section(title = "发布前自检") {
        ChecklistItem("性能基线 >= XML 版本")
        ChecklistItem("无障碍标签与焦点顺序已确认")
        ChecklistItem("Compose BOM 与依赖版本同步")
        ChecklistItem("日志与监控告警已配置")
    }
}`,
      },
    ],
  },
  {
    slug: 'state-management-patterns',
    title: 'Compose 状态管理模式实践：Unidirectional Data Flow 解析',
    description:
      '结合 MVVM、MVI 与数据驱动组件的对比案例，解释如何构建稳定、高可测的 Compose 状态层。',
    publishedAt: '2025-01-28',
    updatedAt: '2025-09-05',
    author: '王潇 · 解决方案工程师',
    tags: ['状态管理', '架构模式', '最佳实践'],
    readingMinutes: 10,
    sections: [
      {
        paragraphs: [
          'Compose 的声明式特性要求我们重新审视数据流向。无论是采用 ViewModel+StateFlow，还是使用 Orbit、Mavericks 等框架，核心目标都是将状态变化限制在可预期的范围内。',
        ],
      },
      {
        heading: '三种常见模式对比',
        list: [
          'ViewModel + StateFlow：官方推荐方案，适合大多数中型项目；',
          'Unidirectional Data Flow (UDF)：强调输入输出的单向性，易于配合测试快照；',
          'Redux/MVI：事件驱动，适合复杂交互或需要时光旅行调试的场景。',
        ],
        note: '务必避免在 Composable 内部直接持有可变状态，否则会增大重组不一致风险。',
      },
      {
        heading: '示例：过滤器面板',
        paragraphs: [
          '以下代码展示了如何在 ViewModel 中集中处理意图，再把结果通过不可变 State 推送给UI层：',
        ],
        code: `@Stable
data class FilterState(
    val categories: List<String> = emptyList(),
    val selected: Set<String> = emptySet()
)

sealed interface FilterIntent {
    data class Toggle(val category: String) : FilterIntent
    data object Reset : FilterIntent
}

class FilterViewModel : ViewModel() {
    private val _state = MutableStateFlow(FilterState())
    val state: StateFlow<FilterState> = _state.asStateFlow()

    fun dispatch(intent: FilterIntent) {
        _state.update { current ->
            when (intent) {
                is FilterIntent.Toggle -> current.copy(
                    selected = current.selected.toggle(intent.category)
                )
                FilterIntent.Reset -> current.copy(selected = emptySet())
            }
        }
    }
}
`,
      },
    ],
  },
  {
    slug: 'animations-production-guide',
    title: 'Compose 动画落地指南：交互动效与性能调优',
    description:
      '通过三个真实项目说明何时使用动态动画 API，如何控制性能成本并确保可访问性。',
    publishedAt: '2024-11-18',
    updatedAt: '2025-08-11',
    author: '赵彦 · 动效设计师',
    tags: ['动画', '性能优化', '无障碍'],
    readingMinutes: 9,
    sections: [
      {
        paragraphs: [
          '动画不仅是吸引力，更是信息传递的重要渠道。Compose 提供了基于状态的 `animate*AsState`、`Transition`、`AnimationSpec` 等能力，我们建议将动效分为“情境反馈”“空间定位”“品牌表达”三类进行设计。',
        ],
      },
      {
        heading: '性能控制基线',
        list: [
          '启用 `RenderThread` 监控，确保 GPU 呈现耗时稳定在 8ms 内；',
          '对频繁触发的动画使用 `MutableTransitionState` 避免重组抖动；',
          '在 `rememberInfiniteTransition` 中设置合理的 `label`，方便使用 `Macrobenchmark` 与 `Perfetto` 排查。',
        ],
      },
      {
        heading: '无障碍与用户控制',
        paragraphs: [
          '遵循 WCAG 2.2，必须为动画提供“减少动态效果”选项。Compose 可以通过 `LocalViewConfiguration.current` 中的 `minimumTouchTargetSize` 搭配 `LocalAccessibilityManager` 获取用户偏好。',
        ],
      },
    ],
  },
  {
    slug: 'xml-to-compose-case-study',
    title: '案例复盘：教育类 App 的 Compose 重写经验',
    description:
      '详细拆解一款拥有 120+ 页面、面向中学生的教育类应用如何用 Compose 提升留存率与学习体验。',
    publishedAt: '2025-05-06',
    updatedAt: '2025-09-22',
    author: '陈颖 · 全栈工程师',
    tags: ['案例研究', '教育行业', '用户体验'],
    readingMinutes: 11,
    sections: [
      {
        paragraphs: [
          '案例项目在迁移前存在三大痛点：老旧的多层嵌套布局导致渲染缓慢；缺乏暗色模式支持；无障碍标签缺失使得屏幕阅读器无法朗读重点内容。',
        ],
      },
      {
        heading: '解决方案回顾',
        list: [
          '将章节列表改写为 `LazyColumn + stickyHeader`，提升分页加载体验；',
          '利用 `MaterialTheme` 自定义配色，保证日间/夜间模式对比度均符合 WCAG AA；',
          '通过 `Semantics` 与 `contentDescription` 补齐 120+ 关键节点的辅助信息。',
        ],
      },
      {
        heading: '结果与指标',
        paragraphs: [
          '迁移完成后三周内，课程完成率提升 18%，页面平均渲染时间下降 31%。更重要的是，家长群体对无障碍体验的投诉数量下降到个位数。',
        ],
        note: '该案例获得参与学校许可后发布，涉及的数据均经过匿名化处理并取得监护人同意。',
      },
    ],
  },
];

export function getAllPosts() {
  return posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

