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
  {
    slug: 'compose-interoperability-strategy',
    title: 'Compose 与传统 View 互操作策略：分层解耦实战',
    description:
      '讲解如何在多模块工程中渐进式引入 Compose，同时保持与现有 View 层的互操作与性能稳定。',
    publishedAt: '2025-10-28',
    updatedAt: '2025-10-28',
    author: '孙越 · 平台工程师',
    tags: ['互操作', '多模块', '架构治理'],
    readingMinutes: 13,
    sections: [
      {
        paragraphs: [
          '大多数企业级应用都会经历较长的迁移窗口期，Compose 不可能一蹴而就。在并存阶段，我们需要构建清晰的互操作边界，确保宿主模块的生命周期、主题体系与性能指标不被破坏。',
          '我们建议从“阅读型模块”切入，引入 `ComposeView` 作为桥接容器，并通过统一的 Design System Adapter 将颜色、排版、间距等设计令牌映射到 Compose `MaterialTheme`。',
        ],
      },
      {
        heading: '模块化拆分原则',
        list: [
          '桥接层独立成模块：`ui-interop` 仅负责 View 与 Compose 的交互，避免业务模块直接依赖实现细节；',
          'Compose 入口保持无状态：通过参数传递数据与回调，将状态托管在 ViewModel 或 UseCase 层；',
          '对外暴露稳定接口：使用 `@Stable` 数据结构作为边界契约，降低重组带来的 diff 噪音。',
        ],
        note: '互操作模块需单独配置 R8 keep 规则，保留 `androidx.compose` 相关类，防止代码压缩阶段误删。',
      },
      {
        heading: '桥接层实现要点',
        paragraphs: [
          '如下示例展示了如何在 View 模块中安全托管 Compose，并同步宿主主题与生命周期。我们推荐使用 `ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed` 避免内存泄漏。',
        ],
        code: `class ComposeInterstitial @JvmOverloads constructor(
     context: Context,
     attrs: AttributeSet? = null
 ) : FrameLayout(context, attrs) {

     private val composeView = ComposeView(context).apply {
         setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)
     }

     init {
         addView(composeView)
     }

     fun render(state: InteropState, onAction: (InteropAction) -> Unit) {
         composeView.setContent {
             LegacyThemeAdapter {
                 InteropScreen(state = state, onAction = onAction)
             }
         }
     }
 }

 @Stable
data class InteropState(
     val title: String,
     val illustrations: ImmutableList<Illustration>
 )`,
      },
      {
        heading: '监控与性能回归',
        paragraphs: [
          '互操作阶段的性能监控尤为关键。我们在 FrameMetricsAggregator 中记录新旧界面的首帧时间，并借助 `Choreographer.FrameCallback` 捕获掉帧，将指标写入 Grafana。',
          '当 Compose 模块占比超过 60% 时，可考虑将 `ComposeView` 迁移为完全的 `Activity`/`Fragment` 层级，以减少额外的测量与布局成本。',
        ],
      },
    ],
  },
  {
    slug: 'compose-continuous-delivery',
    title: '构建 Compose CI/CD 流水线：可视化回归与性能保障',
    description:
      '介绍如何在 CI/CD 平台上集成 Compose 专属的可视化回归、无障碍校验与性能基准测试，确保每次发布都可追溯。',
    publishedAt: '2025-10-12',
    updatedAt: '2025-10-24',
    author: '李航 · DevOps 架构师',
    tags: ['CI/CD', '测试', '性能'],
    readingMinutes: 14,
    sections: [
      {
        paragraphs: [
          'Compose 引入后，传统的截图对比与 Espresso 测试难以覆盖声明式特性。我们需要重新设计流水线，将“快速反馈 + 深度基准”结合，构建分层的测试矩阵。',
          '流水线应包含：静态检查（ktlint、Detekt、Compose Metrics）、可视化回归（Paparazzi 或 Shot）、性能基准（Macrobenchmark）以及无障碍校验（Accessibility Test Framework）。',
        ],
      },
      {
        heading: '流水线拓扑',
        list: [
          'Stage 1 - 静态分析：在 PR 级别运行 `./gradlew lint ktlintCheck detekt`，并开启 Compose Compiler Metrics 输出；',
          'Stage 2 - 可视化回归：触发 Paparazzi 渲染 Compose 组件快照，将差异图上传至 Artifact；',
          'Stage 3 - 性能与无障碍：夜间定时运行 Macrobenchmark 与无障碍脚本，结果同步到 DataDog/Grafana；',
          'Stage 4 - 部署与回滚：构建内部 Beta，配合 Firebase App Distribution 推送给 QA 与业务干系人。',
        ],
      },
      {
        heading: 'GitHub Actions 实例',
        paragraphs: [
          '以下 YAML 片段给出了常见的 GitHub Actions 配置。我们将 Macrobenchmark 与 Paparazzi 拆分成可复用的 job，便于独立扩展并行度。',
        ],
        code: `jobs:
   compose-static-checks:
     runs-on: ubuntu-latest
     steps:
       - uses: actions/checkout@v4
       - uses: gradle/gradle-build-action@v3
         with:
           arguments: lint ktlintCheck detekt

   compose-visual-regression:
     needs: compose-static-checks
     runs-on: macos-latest
     steps:
       - uses: actions/checkout@v4
       - uses: gradle/gradle-build-action@v3
         with:
           arguments: verifyPaparazziDebug

   compose-performance:
     needs: compose-visual-regression
     runs-on: android-large
     steps:
       - uses: actions/checkout@v4
       - uses: gradle/gradle-build-action@v3
         with:
           arguments: :benchmark:connectedCheck`,
      },
      {
        heading: '可视化与回滚策略',
        paragraphs: [
          '我们在 App Startup 中注入发布版本号与 Git 提交哈希，日志上报至 ELK。Dashboards 以组件维度展示可用性、掉帧、无障碍通过率，一旦出现异常，可通过 Rollback Playbook 快速切回上一个稳定版本。',
        ],
        note: '建议将 Compose Compiler 的 `reportsDestination` 指向独立的 CI Artifact，长期追踪 `skipped` 与 `restart` 指标波动。',
      },
    ],
  },
  {
    slug: 'why-migrate-to-compose',
    title: '告别 XML：为什么 Jetpack Compose 是 Android UI 的未来',
    description: '深入探讨传统 XML 布局的性能瓶颈与维护难题，分析 Jetpack Compose 如何从根本上解决这些痛点，成为 Google 官方推荐的现代 UI 工具包。',
    publishedAt: '2025-11-08',
    updatedAt: '2025-11-08',
    author: 'AI 助手',
    tags: ['Compose', 'XML', 'Android开发', '性能'],
    readingMinutes: 8,
    sections: [
      {
        heading: '摘要：2025 年的必然选择',
        paragraphs: [
          '在 Android 开发领域，一场深刻的变革正在发生。传统的 XML 视图体系正被 Google 的现代声明式 UI 框架——Jetpack Compose——迅速取代。截至 2025 年，Compose 已成为成熟的行业标准，被 Google 官方标记为“Android 的推荐现代 UI 工具包”。Play 商店前 1,000 的应用中已有 60% 采用它，这明确地宣告了 Compose 代表着 Android UI 的现在与未来。',
          '这场变革的核心驱动力是生产力的巨大飞跃。Compose 解决了 XML 布局固有的两大痛点：代码冗余和维护复杂性。Google Play 商店团队报告称，迁移到 Compose 使其 UI 代码减少了 50%，而 Lyft 的案例更具说服力：一个原先需要 800 行代码和 17 个 XML 文件的按钮组件，被简化为一个 Compose 函数。',
        ],
      },
      {
        heading: '传统 XML 布局的原理与局限',
        paragraphs: [
          '要理解这场变革的必要性，首先需要了解 XML 的工作原理。Android 系统通过 `LayoutInflater` 将静态的 XML 文本文件“膨胀”为用户可以交互的动态 View 对象树。这个过程包括解析 XML、实例化 View 对象、应用属性和构建视图层级。',
          '尽管功能强大，XML 的性能模型却存在一个根本性缺陷：测量开销。Android 的渲染分为测量（Measure）和布局（Layout）两个阶段。某些布局（如 RelativeLayout）或参数（如 LinearLayout 的 `layout_weight`）会导致“双重测量”，即一个 View 被测量两次。',
          '当带有权重的 `LinearLayout` 相互嵌套时，测量复杂度会呈指数级增长。一个嵌套 3 层的加权布局可能导致最内层的 View 被测量 8 次。这种开销在 `RecyclerView` 中尤其致命，因为列表项在滚动时会反复测量。XML View 系统的核心性能模型，与其构建现代复杂 UI 的目标从根本上是冲突的。'
        ],
        note: 'ConstraintLayout 等布局的出现，本质上是为了缓解这个固有的测量问题，但它们只是“创可贴”，而非根本的解决方案。'
      }
    ]
  },
  {
    slug: 'compose-core-principles',
    title: 'Jetpack Compose 核心揭秘：声明式 UI 与 Kotlin 的协同效应',
    description: '从 @Composable 注解到重组机制，全面解析 Compose 的工作原理。探索其如何利用 Kotlin 语言特性构建高效、可维护的 UI，以及声明式范式如何颠覆传统开发思维。',
    publishedAt: '2025-11-09',
    updatedAt: '2025-11-09',
    author: 'AI 助手',
    tags: ['声明式UI', 'Kotlin', '架构', '重组'],
    readingMinutes: 9,
    sections: [
      {
        heading: '范式转变：从命令式到声明式',
        paragraphs: [
            '传统的 XML 是一种命令式范式。开发者需要关心“如何”更新 UI：获取 View 引用，然后手动调用 `setText()` 等方法来改变其内部状态。这种模式导致 UI 控件自己维护复杂状态，逻辑分散，难以跟踪。',
            'Jetpack Compose 则采用声明式范式，开发者只关心“是什么” UI。其核心理念是 UI = f(State)，即 UI 是状态的函数。开发者只需在 Kotlin 代码中描述给定状态下的 UI 外观，当状态变化时，Compose 框架会自动且智能地“重组”受影响的 UI 部分。',
        ]
      },
      {
        heading: '核心解密：@Composable、编译器与重组',
        paragraphs: [
          'Compose 的能力深度集成在 Kotlin 编译器中。`@Composable` 注解会触发一个编译器插件，在编译期转换函数代码，注入一个 `Composer` 对象，它负责跟踪 UI 树的结构和状态。',
          '重组是 Compose 更新 UI 的高效过程。当使用 `remember { mutableStateOf(...) }` 声明状态时，Compose 会将其存储在“插槽表”中。当 Composable 函数读取该状态的 `.value` 时，它会自动“订阅”这个状态。一旦状态被修改，Compose 会精确地只重新执行那些订阅了该状态的函数，而跳过所有未受影响的部分，从而实现极高的运行时效率。'
        ],
      },
      {
        heading: 'Kotlin 为本：语言特性如何赋能 Compose',
        paragraphs: [
          'Compose 的 API 设计与 Kotlin 语言特性密不可分，它本身就是一套领域特定语言 (DSL)。',
        ],
        list: [
          '高阶函数与 Lambda：Compose API 的基础，例如 `Button(onClick = { ... })`。',
          '尾随 Lambda：实现了优雅的嵌套结构，如 `Column { Text("Hello") }`。',
          '扩展函数：`Modifier` 系统完全建立在扩展函数之上，使其可以链式调用。',
          '协程：所有异步操作和副作用管理都通过协程处理，如 `LaunchedEffect`，它能完美地将异步任务与 UI 组件的生命周期绑定。'
        ]
      }
    ]
  },
  {
    slug: 'compose-migration-and-performance',
    title: '实战指南：从 XML 到 Compose 的迁移策略与性能优化',
    description: '提供一份权威的“xml 转 compose”分步指南，涵盖互操作性 API 的使用、常见挑战的解决方案，以及如何通过基线配置文件等工具优化 Compose 应用的性能。',
    publishedAt: '2025-11-10',
    updatedAt: '2025-11-10',
    author: 'AI 助手',
    tags: ['迁移', '互操作', '性能优化', '实战'],
    readingMinutes: 11,
    sections: [
      {
        heading: '性能对决：Compose vs. XML',
        paragraphs: [
          'Compose 和 XML 哪个更快？答案是复杂的。XML 在初始渲染上通常更快，因为它作为系统框架的一部分被预编译（AOT）。而 Compose 作为一个库，在首次运行时需要即时编译（JIT），导致启动时间较长。',
          '然而，这个问题可以通过基线配置文件（Baseline Profiles）解决，它能触发对关键代码路径的 AOT 编译，使 Compose 的启动速度与 XML 基本持平。',
          '在运行时效率上，Compose 通常更优。它的智能重组机制可以跳过未变化的 UI 更新，提供比 XML 更平滑的用户体验，慢帧百分比更低。'
        ],
        note: '编写糟糕的 Compose 代码比编写糟糕的 XML 代码更容易。最大的陷阱是“过度重组”，通常是由于向 Composable 传递了不稳定的参数（如可变的 `List<T>`）引起的。请优先使用不可变集合或用 `@Immutable` 注解标记你的数据类。'
      },
      {
        heading: '权威迁移指南：从 XML 到 Compose',
        paragraphs: [
          '对于已有项目，“xml 转 compose”的核心原则是：绝不要一次性重写所有内容。官方推荐的策略是增量迁移。',
        ],
        list: [
            '步骤一：用 Compose 构建所有新屏幕。',
            '步骤二：将可重用的 UI 元素提取到共享的 Compose 组件库中。',
            '步骤三：按照从简单到复杂的顺序，逐个屏幕替换现有功能。'
        ]
      },
      {
        heading: '战术一：在 XML 中嵌入 Compose (ComposeView)',
        paragraphs: [
          '这是迁移的起点。你可以在现有的 XML 布局中添加一个 `<androidx.compose.ui.platform.ComposeView>`，然后在代码中调用其 `setContent` 方法来渲染 Composable 函数。',
          '关键点：在 Fragment 中使用时，必须设置正确的组合策略 `ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed`，以防止因 View 重建导致 Compose 状态丢失。',
        ],
        code: `my_compose_view.apply {
   setViewCompositionStrategy(
       ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed
   )
   setContent {
       MaterialTheme {
           Text("Hello Compose!")
       }
   }
}`
      },
      {
        heading: '战术二：在 Compose 中嵌入 XML (AndroidView)',
        paragraphs: [
          '当你正在构建一个 Compose 屏幕，但需要嵌入一个旧的 View 组件（如 MapView）时，可以使用 `AndroidView` Composable。它通过 `factory` lambda（仅执行一次，用于创建 View）和 `update` lambda（每次重组时执行，用于更新 View）来实现双向通信。',
        ],
        code: `@Composable
fun MyLegacyViewInCompose(selectedItem: Int) {
   AndroidView(
       factory = { context ->
           MyCustomView(context).apply {
               // View -> Compose 通信
               setOnClickListener { /*... */ }
           }
       },
       update = { view ->
           // Compose -> View 通信
           view.selectedItem = selectedItem
       }
   )
}`
      }
    ]
  }
];

export function getAllPosts() {
  return posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getPostBySlug(slug: string) {
  return posts.find((post) => post.slug === slug);
}

