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
    readingMinutes: 12,
    sections: [
      {
        heading: '执行摘要：2025 年的必然选择',
        paragraphs: [
          '在 Android 开发领域，一场深刻的变革正在发生。传统的 XML 视图体系正被 Google 的现代声明式 UI 框架——Jetpack Compose——迅速取代。截至 2025 年，Compose 已成为成熟的行业标准，被 Google 官方标记为“Android 的推荐现代 UI 工具包”。',
          'Google I/O 2025 的数据显示，Play 商店排名前 1,000 的应用中已有 60% 采用了 Jetpack Compose。这一转变不仅是技术上的迭代，更是生产力的巨大飞跃。Compose 解决了传统 XML 布局固有的两大痛点：代码冗余和维护复杂性。',
          'Google Play 商店团队的实战数据显示，迁移到 Compose 使其 UI 代码量减少了高达 50%。更令人印象深刻的是 Lyft 的案例：一个核心按钮组件在 XML 时代需要 3 个 Java/Kotlin 文件（800 行代码）以及 17 个不同的 XML 文件来定义各种样式和布局；而迁移后，它被简化为一个仅需几行代码的 Compose 函数。这不仅减少了代码，更消除了文件碎片化带来的认知负荷。',
          'MAX (前 HBO Max) 团队也报告称，采用 Compose 后，其 UI 变更的实现速度提升了 30%。这些数据清楚地表明，Compose 不仅是 Google 的推荐，更是企业提升研发效能的必经之路。',
        ],
      },
      {
        heading: '传统 XML 布局的痛点深度剖析',
        paragraphs: [
          'XML 布局的核心问题在于其“命令式”和“碎片化”的本质。开发者必须在 XML 文件（定义“是什么”）和 Kotlin/Java 文件（定义“如何做”）之间频繁切换。当需要调试一个功能时，理解其完整的上下文变得极其困难。',
          '此外，XML 视图系统存在严重的性能隐患。传统的 View 系统在渲染时需要经过测量（Measure）和布局（Layout）两个阶段。某些布局（如使用 `layout_weight` 的 `LinearLayout` 或 `RelativeLayout`）会导致“双重测量” (Double Taxation)。当这些布局发生嵌套时，测量次数会呈指数级增长（例如 3 层嵌套可能导致 8 次测量），严重影响渲染性能，特别是在 `RecyclerView` 等滚动列表中。',
          'ConstraintLayout 的出现虽然缓解了这个问题，但它更像是一个“创可贴”，并没有从根本上解决 View 系统本身“允许甚至依赖多重测量”的底层架构。而 Compose 通过单次测量规则（Single Pass Measurement）和固有的 Intrinsic Measurement 机制，从架构层面根除了双重测量的问题。',
        ],
      },
    ],
  },
  {
    slug: 'compose-core-principles',
    title: 'Jetpack Compose 核心揭秘：声明式 UI 与 Kotlin 的协同效应',
    description: '从 @Composable 注解到重组机制，全面解析 Compose 的工作原理。探索其如何利用 Kotlin 语言特性构建高效、可维护的 UI，以及声明式范式如何颠覆传统开发思维。',
    publishedAt: '2025-11-09',
    updatedAt: '2025-11-09',
    author: 'AI 助手',
    tags: ['声明式UI', 'Kotlin', '架构', '重组'],
    readingMinutes: 15,
    sections: [
      {
        heading: '范式转变：从命令式到声明式',
        paragraphs: [
          '传统的 XML 是一种命令式 (Imperative) 范式。开发者必须手动管理 UI 的状态更新：先通过 `findViewById` 获取 View 引用，然后在数据变化时手动调用 `setText()` 或 `setVisibility()`。这种模式下，View 自身持有状态，而业务逻辑又在外部修改状态，很容易导致状态不一致（State Inconsistency）和难以追踪的 Bug。',
          'Jetpack Compose 采用声明式 (Declarative) 范式。核心公式是 `UI = f(State)`。开发者不再关心“如何”更新 UI，而是描述在给定状态下 UI “应该是什么样子”。当状态发生变化时，Compose 框架会自动负责计算差异并更新屏幕。这种思维模型的转变是迁移中最困难但也最有价值的部分。',
        ],
      },
      {
        heading: '核心解密：@Composable 与编译器插件',
        paragraphs: [
          'Compose 不是一个普通的库，它是一个深度集成到 Kotlin 编译器中的系统。`@Composable` 注解并不是传统的运行时注解，而是一个编译器插件的标记。',
          '在编译阶段，这个插件会转换所有被标记的函数，向其签名中注入一个隐式的 `Composer` 参数。`Composer` 对象负责在运行时跟踪 UI 树的结构和状态。这种机制类似于 Kotlin 协程的 `suspend` 关键字，它也是通过编译器注入 `Continuation` 参数来实现的。',
          'Compose 运行时使用一种称为“间隙缓冲区”（Gap Buffer）或“插槽表”（Slot Table）的高效数据结构来存储 UI 树的信息。这种结构允许 Compose 以极低的开销在 UI 树的任意位置插入、删除或移动节点，从而支持高效的动态 UI 更新。',
        ],
      },
      {
        heading: '智能重组 (Smart Recomposition)',
        paragraphs: [
          '重组是 Compose 更新 UI 的机制。为了保证性能，Compose 实现了极其激进的优化策略。其中最核心的是“位置记忆”（Positional Memoization）和“跳过机制”（Skipping）。',
          '当使用 `remember` 声明状态时，该值被存储在插槽表中。当 Composable 函数读取状态时，它会自动订阅该状态的变更。一旦状态更新，Compose 只会重新执行那些依赖该状态的函数。',
          '更重要的是，如果一个 Composable 的参数在重组期间没有发生变化（即参数是“稳定”的），Compose 会完全跳过该函数的执行。这就是为什么在 Compose 中使用不可变对象（Immutable Objects）和稳定的集合类型如此重要的原因。',
        ],
      },
      {
        heading: 'Kotlin 语言特性的极致运用',
        paragraphs: [
          'Compose 是 Kotlin 语言特性的集大成者。它大量使用了高阶函数和 Lambda 表达式（尤其是尾随 Lambda）来构建声明式的 UI 树结构。',
          '`Modifier` 系统完全基于扩展函数（Extension Functions）构建，允许开发者通过链式调用流畅地添加修饰符。而所有的异步任务和副作用管理（如 `LaunchedEffect`）都直接建立在 Kotlin 协程（Coroutines）之上，使得 UI 生命周期与异步任务的绑定变得前所未有的简单和安全。',
        ],
      },
    ],
  },
  {
    slug: 'compose-migration-and-performance',
    title: '实战指南：从 XML 到 Compose 的迁移策略与性能优化',
    description: '提供一份权威的“xml 转 compose”分步指南，涵盖互操作性 API 的使用、常见挑战的解决方案，以及如何通过基线配置文件等工具优化 Compose 应用的性能。',
    publishedAt: '2025-11-10',
    updatedAt: '2025-11-10',
    author: 'AI 助手',
    tags: ['迁移', '互操作', '性能优化', '实战'],
    readingMinutes: 18,
    sections: [
      {
        heading: '性能真相：AOT vs JIT',
        paragraphs: [
          '关于 Compose 性能的争议从未停止。基准测试显示，Compose 在初始页面加载（启动时间）上往往慢于 XML。这是因为 XML View 是 Android 系统框架的一部分，随系统启动并在安装时进行了 AOT（Ahead-of-Time）预编译。而 Compose 作为一个解耦的库打包在 APK 中，首次运行时需要经过 ART（Android Runtime）的 JIT（Just-in-Time）编译和类加载，这带来了“一次性成本”。',
          '但是，这并不意味着 Compose 慢。通过引入“基线配置文件”（Baseline Profiles），开发者可以指示系统在安装时就对 Compose 的关键路径进行 AOT 编译，从而几乎完全消除启动时的性能差距。',
          '在运行时性能（如列表滚动、动画流畅度）方面，得益于智能重组机制，Compose 往往优于传统的 View 系统，表现出更低的掉帧率（Slow Frame %）。',
        ],
      },
      {
        heading: '权威迁移策略：分步走',
        paragraphs: [
          '对于大型 XML 项目，“重写”是不可接受的。官方推荐且唯一可行的策略是“增量迁移”。',
          '1. **新功能使用 Compose**：所有新屏幕和功能模块应 100% 使用 Compose 开发。',
          '2. **构建 Design System**：将通用的 UI 组件（按钮、输入框、卡片）提取为 Compose 组件，建立统一的设计系统。',
          '3. **逐屏迁移**：从简单的页面开始，逐步替换现有的 Activity 或 Fragment。',
        ],
      },
      {
        heading: '互操作性战术手册',
        paragraphs: [
          '**在 XML 中使用 Compose**：使用 `ComposeView`。关键点是必须设置 `setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)`，以确保 Compose 的状态在 Fragment 视图销毁时正确清理，避免内存泄漏和状态丢失。',
          '**在 Compose 中使用 XML**：使用 `AndroidView`。这是集成地图、Webview 或尚未迁移的复杂自定义 View 的桥梁。通过 `factory` lambda 创建 View，通过 `update` lambda 响应 Compose 状态的变化，实现单向数据流的闭环。',
        ],
        code: `@Composable
fun LegacyMapComponent(lat: Double, lng: Double) {
    AndroidView(
        factory = { context ->
            MapView(context).apply {
                onCreate(null)
                getMapAsync { /* init */ }
            }
        },
        update = { view ->
            // 当 lat/lng 变化时，更新 MapView
            view.updateLocation(lat, lng)
        }
    )
}`,
      },
    ],
  },
  {
    slug: 'xml-performance-deep-dive',
    title: 'XML 布局系统的性能隐患：从 LayoutInflater 到双重测量',
    description: '深入剖析 Android 传统 View 系统的渲染机制，揭示 LayoutInflater 的反射开销与嵌套布局导致的“双重测量”问题，从底层原理层面解释为何 Compose 是必然的进化。',
    publishedAt: '2025-11-20',
    updatedAt: '2025-11-20',
    author: '技术团队',
    tags: ['Android', 'XML', 'Performance', 'Render'],
    readingMinutes: 12,
    sections: [
      {
        heading: 'LayoutInflater：XML 变为 View 的昂贵过程',
        paragraphs: [
          'XML 布局文件本质上只是静态的文本描述。要将其转换为用户可见的界面，Android 系统必须执行“布局膨胀”（Layout Inflation）过程。这个过程由 `LayoutInflater` 类负责，它包含了解析、实例化、属性应用和视图树构建四个步骤。',
          '其中，“实例化”步骤尤为昂贵。对于 XML 中的每一个标签（如 `<Button>`），系统都需要使用 Java 反射（Reflection）机制来查找并加载对应的 View 类。反射操作在运行时是非常耗时的，尤其是在布局复杂、控件数量众多的页面中，这直接导致了界面加载的延迟。',
          '此外，系统还需要遍历 XML 中的每一个属性，并再次通过反射或查找 setter 方法来应用这些属性。这意味着一个复杂的 XML 布局可能包含成百上千次的反射调用和方法查找，累积起来构成了显著的性能开销。',
        ],
      },
      {
        heading: '测量（Measure）与布局（Layout）过程',
        paragraphs: [
          'View 对象创建后，还需要经过测量和布局阶段才能绘制。在测量阶段，父容器会询问子 View 需要多大空间；在布局阶段，父容器决定子 View 的具体位置。',
          '这是一个自顶向下的递归过程。性能问题的核心在于，某些常用的布局容器（特别是 `LinearLayout` 和 `RelativeLayout`）为了确定子 View 的大小，往往需要多次测量同一个子 View。',
        ],
      },
      {
        heading: '双重测量 (Double Taxation) 的指数级灾难',
        paragraphs: [
          '以最常见的 `LinearLayout` 配合 `layout_weight` 为例。为了按比例分配剩余空间，`LinearLayout` 必须执行两次测量传递：第一次测量所有无权重的子项，确定它们占用的空间；第二次根据剩余空间和权重比例，重新测量那些带有权重的子项。',
          '这被称为“双重测量”。如果只有一个层级，这还在可接受范围内。但现代 UI 往往非常复杂，导致布局层层嵌套。当一个需要双重测量的布局嵌套在另一个需要双重测量的布局中时，测量次数会呈指数级爆炸。',
          '例如，一个嵌套 3 层的加权 `LinearLayout` 结构，会导致最内层的 View 被测量 $2^3 = 8$ 次！这种“指数级灾难”在 `RecyclerView` 的 Item 布局中尤为致命，因为列表滚动时会频繁触发绑定和测量，直接导致掉帧和卡顿。',
          '尽管 `ConstraintLayout` 通过其扁平化的特性缓解了嵌套问题，但它并不能改变 View 系统本身“允许甚至依赖多重测量”的底层架构。Jetpack Compose 则引入了“固有特性测量”（Intrinsic Measurement）和严格的“单次测量”规则，从架构上根本杜绝了双重测量问题，确保了 UI 复杂度增加时性能的线性（而非指数级）可预测性。',
        ],
      },
    ],
  },
  {
    slug: 'compose-compiler-magic',
    title: '解构 Compose 编译器：@Composable 如何改变 Android 开发',
    description: '揭开 @Composable 注解的神秘面纱，深入了解 Compose 编译器插件如何通过“插槽表”和“位置记忆”实现高效的 UI 更新，以及它与 Kotlin 挂起函数的异同。',
    publishedAt: '2025-11-21',
    updatedAt: '2025-11-21',
    author: '技术团队',
    tags: ['Compiler', 'Kotlin', 'Internals', 'Composable'],
    readingMinutes: 14,
    sections: [
      {
        heading: '@Composable：不止是一个注解',
        paragraphs: [
          '很多初学者认为 `@Composable` 类似于 Dagger 的 `@Inject`，是一个运行时注解。事实上，它更像 Kotlin 的 `suspend` 关键字，是一个改变函数类型的语言级特性。',
          '`@Composable` 对应着一个 Kotlin 编译器插件（Compose Compiler Plugin）。在编译期间，这个插件会拦截所有被标记的函数，并重写其签名。最显著的变化是注入了一个隐式的参数：`Composer`。',
          '`Composer` 是 Compose 运行时的核心上下文对象，它贯穿于整个 UI 树的构建过程，负责记录正在执行的节点位置、存储状态以及调度重组。这解释了为什么 Composable 函数只能在其他 Composable 函数中调用——因为它们需要这个隐式传递的 `Composer` 上下文。',
        ],
      },
      {
        heading: '插槽表 (Slot Table) 与间隙缓冲区',
        paragraphs: [
          'Compose 如何存储 UI 树？它并没有使用传统的对象树（如 View Hierarchy），而是使用了一种基于数组的线性数据结构，称为“插槽表”。',
          '插槽表的设计灵感来源于文本编辑器中常用的“间隙缓冲区”（Gap Buffer）。它是一个包含数据的数组，但在当前操作位置保留了一段空的“间隙”。这使得 Compose 可以在 O(1) 时间复杂度内移动光标，并在当前位置高效地插入或删除数据。',
          '这种结构极其适合 UI 的动态特性。当重组发生时，Compose 编译器生成的代码会按照执行顺序访问插槽表。如果发现数据（如状态或节点结构）没有变化，它就直接跳过；如果发生变化，它就利用间隙缓冲区高效地更新数组内容。',
        ],
      },
      {
        heading: '位置记忆 (Positional Memoization)',
        paragraphs: [
          '理解了插槽表，就能理解 `remember` 的工作原理。`remember` 并不是魔法，它利用了“位置记忆”技术。',
          '因为 Composable 函数的执行顺序在重组期间通常是稳定的，Compose 可以利用函数在源代码中的“位置”作为 key，在插槽表中查找和存取值。当代码执行到 `remember { ... }` 时，Composer 会检查当前插槽位置是否已有缓存值。如果有且依赖未变，直接返回；否则，执行 lambda 计算新值并存入插槽。',
          '这种机制使得函数式 UI 能够拥有“状态”，并且这种状态能够跨越多次重组而持久存在，直到该 Composable 从 UI 树中被移除。',
        ],
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

