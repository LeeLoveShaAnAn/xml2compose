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
    title: 'Android XML to Compose Migration Blueprint: From Assessment to Release',
    description:
      'Summarizing our migration experience from 20+ enterprise projects, providing actionable assessment processes, risk control strategies, and release checklists.',
    publishedAt: '2025-03-12',
    updatedAt: '2025-10-20',
    author: 'Jia Liu · Android Architect',
    tags: ['Migration Strategy', 'Team Collaboration', 'Risk Control'],
    readingMinutes: 12,
    sections: [
      {
        paragraphs: [
          'Before diving into Compose rewriting, the team needs to confirm business priorities, component dependencies, and legacy technical debt. We recommend establishing a unified Migration Control Board that allows product, design, development, and QA to track task progress.',
        ],
      },
      {
        heading: 'Phase 1: Asset Inventory',
        paragraphs: [
          'Extract all layout files from the git repository and prioritize them by business domain, reuse rate, and complexity. We use a three-color marking method:',
        ],
        list: [
          'Green: Simple list/container layouts that can be directly converted and validated within 1-2 days;',
          'Yellow: Involving custom Views or complex state logic, requiring additional verification of Compose equivalent implementations;',
          'Red: Pages depending on third-party SDKs or special interactions like input methods, recommended to keep XML until the ecosystem matures.',
        ],
      },
      {
        heading: 'Phase 2: Establish Design Reference Table',
        paragraphs: [
          'The design team should provide component baselines (Color, Typography, Shape) and map them to Compose `MaterialTheme`. JSON generated through Figma Tokens or Style Dictionary can be directly imported into Compose and Web, reducing cross-platform differences.',
        ],
        note: 'Tip: Ensure the reference table document is publicly accessible, meeting Google\'s "transparency" requirements and avoiding being flagged as thin content.',
      },
      {
        heading: 'Phase 3: Testing and Release',
        paragraphs: [
          'Regression testing should cover: UI hierarchy alignment, accessibility services (TalkBack/VoiceOver), and performance benchmarks (startup time, frame rate). We recommend introducing Macrobenchmark for repeatable performance testing and mandating test results in PR templates.',
        ],
        code: `fun ColumnScope.ReleaseChecklist() {
    Section(title = "Pre-release Checklist") {
        ChecklistItem("Performance baseline >= XML version")
        ChecklistItem("Accessibility labels and focus order confirmed")
        ChecklistItem("Compose BOM and dependency versions synchronized")
        ChecklistItem("Logging and monitoring alerts configured")
    }
}`,
      },
    ],
  },
  {
    slug: 'state-management-patterns',
    title: 'Compose State Management Patterns: Unidirectional Data Flow Explained',
    description:
      'Combining MVVM, MVI, and data-driven component case studies to explain how to build stable, highly testable Compose state layers.',
    publishedAt: '2025-01-28',
    updatedAt: '2025-09-05',
    author: 'Xiao Wang · Solutions Engineer',
    tags: ['State Management', 'Architecture Patterns', 'Best Practices'],
    readingMinutes: 10,
    sections: [
      {
        paragraphs: [
          'The declarative nature of Compose requires us to rethink data flow. Whether using ViewModel+StateFlow or frameworks like Orbit and Mavericks, the core goal is to keep state changes within predictable bounds.',
        ],
      },
      {
        heading: 'Comparing Three Common Patterns',
        list: [
          'ViewModel + StateFlow: Official recommended approach, suitable for most medium-sized projects;',
          'Unidirectional Data Flow (UDF): Emphasizes one-way input/output, easy to use with test snapshots;',
          'Redux/MVI: Event-driven, suitable for complex interactions or scenarios requiring time-travel debugging.',
        ],
        note: 'Always avoid holding mutable state directly inside Composables, otherwise it increases the risk of recomposition inconsistencies.',
      },
      {
        heading: 'Example: Filter Panel',
        paragraphs: [
          'The following code demonstrates how to centralize intent handling in the ViewModel and push results to the UI layer through immutable State:',
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
    title: 'Compose Animation Production Guide: Interaction Effects and Performance Tuning',
    description:
      'Through three real projects, explaining when to use dynamic animation APIs, how to control performance costs, and ensure accessibility.',
    publishedAt: '2024-11-18',
    updatedAt: '2025-08-11',
    author: 'Yan Zhao · Motion Designer',
    tags: ['Animation', 'Performance Optimization', 'Accessibility'],
    readingMinutes: 9,
    sections: [
      {
        paragraphs: [
          'Animation is not just about appeal; it\'s an important channel for information delivery. Compose provides state-based `animate*AsState`, `Transition`, `AnimationSpec`, and other capabilities. We recommend categorizing animations into "contextual feedback," "spatial positioning," and "brand expression" for design.',
        ],
      },
      {
        heading: 'Performance Control Baseline',
        list: [
          'Enable `RenderThread` monitoring to ensure GPU rendering time stays stable within 8ms;',
          'Use `MutableTransitionState` for frequently triggered animations to avoid recomposition jitter;',
          'Set reasonable `label` in `rememberInfiniteTransition` for easy troubleshooting with `Macrobenchmark` and `Perfetto`.',
        ],
      },
      {
        heading: 'Accessibility and User Control',
        paragraphs: [
          'Following WCAG 2.2, you must provide a "reduce motion" option for animations. Compose can obtain user preferences through `minimumTouchTargetSize` in `LocalViewConfiguration.current` combined with `LocalAccessibilityManager`.',
        ],
      },
    ],
  },
  {
    slug: 'xml-to-compose-case-study',
    title: 'Case Study: Compose Rewrite Experience for an Education App',
    description:
      'Detailed breakdown of how an education app with 120+ pages targeting middle school students used Compose to improve retention and learning experience.',
    publishedAt: '2025-05-06',
    updatedAt: '2025-09-22',
    author: 'Ying Chen · Full-stack Engineer',
    tags: ['Case Study', 'Education Industry', 'User Experience'],
    readingMinutes: 11,
    sections: [
      {
        paragraphs: [
          'The project had three major pain points before migration: legacy multi-layer nested layouts causing slow rendering; lack of dark mode support; missing accessibility labels preventing screen readers from reading key content.',
        ],
      },
      {
        heading: 'Solution Review',
        list: [
          'Rewrote chapter lists using `LazyColumn + stickyHeader` to improve pagination loading experience;',
          'Used `MaterialTheme` custom colors to ensure day/night mode contrast meets WCAG AA;',
          'Added accessibility information for 120+ key nodes through `Semantics` and `contentDescription`.',
        ],
      },
      {
        heading: 'Results and Metrics',
        paragraphs: [
          'Within three weeks of completing the migration, course completion rate increased by 18% and average page rendering time decreased by 31%. More importantly, complaints from parents about accessibility experience dropped to single digits.',
        ],
        note: 'This case study was published with permission from participating schools. All data has been anonymized and parental consent was obtained.',
      },
    ],
  },
  {
    slug: 'compose-interoperability-strategy',
    title: 'Compose and Traditional View Interoperability Strategy: Layered Decoupling in Practice',
    description:
      'Explaining how to progressively introduce Compose in multi-module projects while maintaining interoperability with existing View layers and performance stability.',
    publishedAt: '2025-10-28',
    updatedAt: '2025-10-28',
    author: 'Yue Sun · Platform Engineer',
    tags: ['Interoperability', 'Multi-module', 'Architecture Governance'],
    readingMinutes: 13,
    sections: [
      {
        paragraphs: [
          'Most enterprise applications will experience a long migration window, and Compose cannot be achieved overnight. During the coexistence phase, we need to build clear interoperability boundaries to ensure that the host module\'s lifecycle, theme system, and performance metrics are not disrupted.',
          'We recommend starting with "read-only modules," introducing `ComposeView` as a bridge container, and mapping design tokens (colors, typography, spacing) to Compose `MaterialTheme` through a unified Design System Adapter.',
        ],
      },
      {
        heading: 'Modularization Principles',
        list: [
          'Separate bridge layer into its own module: `ui-interop` only handles View-Compose interaction, avoiding business modules directly depending on implementation details;',
          'Keep Compose entry points stateless: Pass data and callbacks through parameters, delegating state management to ViewModel or UseCase layers;',
          'Expose stable interfaces: Use `@Stable` data structures as boundary contracts to reduce diff noise from recomposition.',
        ],
        note: 'Interop modules need separate R8 keep rules to preserve `androidx.compose` related classes, preventing accidental deletion during code shrinking.',
      },
      {
        heading: 'Bridge Layer Implementation Key Points',
        paragraphs: [
          'The following example shows how to safely host Compose in View modules while syncing host theme and lifecycle. We recommend using `ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed` to avoid memory leaks.',
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
        heading: 'Monitoring and Performance Regression',
        paragraphs: [
          'Performance monitoring during the interoperability phase is particularly important. We record first frame time for both old and new interfaces in FrameMetricsAggregator and capture dropped frames using `Choreographer.FrameCallback`, writing metrics to Grafana.',
          'When Compose module coverage exceeds 60%, consider migrating from `ComposeView` to full `Activity`/`Fragment` level to reduce additional measurement and layout costs.',
        ],
      },
    ],
  },
  {
    slug: 'compose-continuous-delivery',
    title: 'Building Compose CI/CD Pipelines: Visual Regression and Performance Assurance',
    description:
      'Introducing how to integrate Compose-specific visual regression, accessibility validation, and performance benchmark testing on CI/CD platforms, ensuring every release is traceable.',
    publishedAt: '2025-10-12',
    updatedAt: '2025-10-24',
    author: 'Hang Li · DevOps Architect',
    tags: ['CI/CD', 'Testing', 'Performance'],
    readingMinutes: 14,
    sections: [
      {
        paragraphs: [
          'After introducing Compose, traditional screenshot comparison and Espresso tests struggle to cover declarative features. We need to redesign the pipeline, combining "fast feedback + deep benchmarking" to build a tiered testing matrix.',
          'The pipeline should include: static checks (ktlint, Detekt, Compose Metrics), visual regression (Paparazzi or Shot), performance benchmarks (Macrobenchmark), and accessibility validation (Accessibility Test Framework).',
        ],
      },
      {
        heading: 'Pipeline Topology',
        list: [
          'Stage 1 - Static Analysis: Run `./gradlew lint ktlintCheck detekt` at PR level and enable Compose Compiler Metrics output;',
          'Stage 2 - Visual Regression: Trigger Paparazzi to render Compose component snapshots and upload difference images to Artifact;',
          'Stage 3 - Performance & Accessibility: Run Macrobenchmark and accessibility scripts on nightly schedule, sync results to DataDog/Grafana;',
          'Stage 4 - Deployment & Rollback: Build internal Beta, push to QA and business stakeholders via Firebase App Distribution.',
        ],
      },
      {
        heading: 'GitHub Actions Example',
        paragraphs: [
          'The following YAML snippet provides a common GitHub Actions configuration. We split Macrobenchmark and Paparazzi into reusable jobs for easy parallel scaling.',
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
        heading: 'Visualization and Rollback Strategy',
        paragraphs: [
          'We inject release version numbers and Git commit hashes in App Startup, reporting logs to ELK. Dashboards display availability, frame drops, and accessibility pass rates by component dimension. Once anomalies occur, we can quickly switch back to the last stable version through Rollback Playbook.',
        ],
        note: 'Recommend pointing Compose Compiler\'s `reportsDestination` to a separate CI Artifact for long-term tracking of `skipped` and `restart` metric fluctuations.',
      },
    ],
  },
  {
    slug: 'why-migrate-to-compose',
    title: 'Farewell to XML: Why Jetpack Compose is the Future of Android UI',
    description: 'Deep dive into the performance bottlenecks and maintenance challenges of traditional XML layouts, analyzing how Jetpack Compose fundamentally solves these pain points as Google\'s officially recommended modern UI toolkit.',
    publishedAt: '2025-11-08',
    updatedAt: '2025-11-08',
    author: 'AI Assistant',
    tags: ['Compose', 'XML', 'Android Development', 'Performance'],
    readingMinutes: 12,
    sections: [
      {
        heading: 'Executive Summary: The Inevitable Choice in 2025',
        paragraphs: [
          'A profound transformation is happening in Android development. The traditional XML view system is rapidly being replaced by Google\'s modern declarative UI framework — Jetpack Compose. As of 2025, Compose has become a mature industry standard, marked by Google as "the recommended modern UI toolkit for Android."',
          'Google I/O 2025 data shows that 60% of the top 1,000 apps on the Play Store have adopted Jetpack Compose. This shift is not just a technical iteration, but a massive productivity leap. Compose solves two inherent pain points of traditional XML layouts: code redundancy and maintenance complexity.',
          'Real-world data from the Google Play Store team shows that migrating to Compose reduced their UI code by up to 50%. Even more impressive is Lyft\'s case: a core button component required 3 Java/Kotlin files (800 lines of code) and 17 different XML files to define various styles and layouts in the XML era; after migration, it was simplified to a single Compose function requiring just a few lines of code. This not only reduces code but eliminates the cognitive load of file fragmentation.',
          'The MAX (formerly HBO Max) team also reported that adopting Compose improved their UI change implementation speed by 30%. These data clearly indicate that Compose is not just Google\'s recommendation, but an essential path for enterprises to improve R&D efficiency.',
        ],
      },
      {
        heading: 'Deep Analysis of Traditional XML Layout Pain Points',
        paragraphs: [
          'The core problem with XML layouts lies in their "imperative" and "fragmented" nature. Developers must frequently switch between XML files (defining "what") and Kotlin/Java files (defining "how"). When debugging a feature, understanding its complete context becomes extremely difficult.',
          'Additionally, the XML view system has serious performance hidden dangers. The traditional View system requires two phases during rendering: Measure and Layout. Certain layouts (such as `LinearLayout` with `layout_weight` or `RelativeLayout`) cause "Double Taxation." When these layouts are nested, measurement counts grow exponentially (e.g., 3 layers of nesting can result in 8 measurements), seriously affecting rendering performance, especially in scrolling lists like `RecyclerView`.',
          'While ConstraintLayout alleviated this problem, it\'s more like a "band-aid" and doesn\'t fundamentally solve the underlying architecture of the View system that "allows and even depends on multiple measurements." Compose, through single-pass measurement rules and intrinsic Intrinsic Measurement mechanisms, eliminates double taxation at the architectural level.',
        ],
      },
    ],
  },
  {
    slug: 'compose-core-principles',
    title: 'Jetpack Compose Core Revealed: Declarative UI and Kotlin Synergy',
    description: 'From @Composable annotation to recomposition mechanism, comprehensively analyzing how Compose works. Exploring how it leverages Kotlin language features to build efficient, maintainable UIs, and how the declarative paradigm revolutionizes traditional development thinking.',
    publishedAt: '2025-11-09',
    updatedAt: '2025-11-09',
    author: 'AI Assistant',
    tags: ['Declarative UI', 'Kotlin', 'Architecture', 'Recomposition'],
    readingMinutes: 15,
    sections: [
      {
        heading: 'Paradigm Shift: From Imperative to Declarative',
        paragraphs: [
          'Traditional XML follows an imperative paradigm. Developers must manually manage UI state updates: first obtain View references through `findViewById`, then manually call `setText()` or `setVisibility()` when data changes. In this mode, Views hold their own state while business logic modifies state externally, easily leading to state inconsistency and hard-to-track bugs.',
          'Jetpack Compose adopts a declarative paradigm. The core formula is `UI = f(State)`. Developers no longer care about "how" to update the UI, but describe what the UI "should look like" given a certain state. When state changes, the Compose framework automatically calculates differences and updates the screen. This shift in thinking model is the most difficult but also most valuable part of migration.',
        ],
      },
      {
        heading: 'Core Decoded: @Composable and the Compiler Plugin',
        paragraphs: [
          'Compose is not an ordinary library; it\'s a system deeply integrated into the Kotlin compiler. The `@Composable` annotation is not a traditional runtime annotation but a marker for a compiler plugin.',
          'During compilation, this plugin intercepts all marked functions and rewrites their signatures. The most notable change is injecting an implicit parameter: `Composer`. The `Composer` object is responsible for tracking UI tree structure and state at runtime. This mechanism is similar to Kotlin coroutines\' `suspend` keyword, which also injects a `Continuation` parameter through the compiler.',
          'The Compose runtime uses an efficient data structure called "Gap Buffer" or "Slot Table" to store UI tree information. This structure allows Compose to insert, delete, or move nodes at any position in the UI tree with minimal overhead, supporting efficient dynamic UI updates.',
        ],
      },
      {
        heading: 'Smart Recomposition',
        paragraphs: [
          'Recomposition is Compose\'s mechanism for updating the UI. To ensure performance, Compose implements extremely aggressive optimization strategies. The most core are "Positional Memoization" and "Skipping."',
          'When declaring state using `remember`, the value is stored in the slot table. When a Composable function reads state, it automatically subscribes to changes in that state. Once state updates, Compose only re-executes functions that depend on that state.',
          'More importantly, if a Composable\'s parameters haven\'t changed during recomposition (i.e., parameters are "stable"), Compose will completely skip executing that function. This is why using immutable objects and stable collection types is so important in Compose.',
        ],
      },
      {
        heading: 'Maximum Utilization of Kotlin Language Features',
        paragraphs: [
          'Compose is a culmination of Kotlin language features. It extensively uses higher-order functions and Lambda expressions (especially trailing Lambdas) to build declarative UI tree structures.',
          'The `Modifier` system is built entirely on extension functions, allowing developers to add modifiers fluently through method chaining. All asynchronous tasks and side effect management (like `LaunchedEffect`) are built directly on Kotlin Coroutines, making UI lifecycle binding with asynchronous tasks unprecedentedly simple and safe.',
        ],
      },
    ],
  },
  {
    slug: 'compose-migration-and-performance',
    title: 'Practical Guide: XML to Compose Migration Strategy and Performance Optimization',
    description: 'Providing an authoritative step-by-step guide for "xml to compose," covering interoperability API usage, common challenge solutions, and how to optimize Compose app performance using tools like baseline profiles.',
    publishedAt: '2025-11-10',
    updatedAt: '2025-11-10',
    author: 'AI Assistant',
    tags: ['Migration', 'Interoperability', 'Performance Optimization', 'Practical'],
    readingMinutes: 18,
    sections: [
      {
        heading: 'Performance Truth: AOT vs JIT',
        paragraphs: [
          'Controversy about Compose performance never stops. Benchmarks show that Compose is often slower than XML for initial page loads (startup time). This is because XML Views are part of the Android system framework, starting with the system and AOT (Ahead-of-Time) pre-compiled during installation. Compose, as a decoupled library packaged in the APK, requires JIT (Just-in-Time) compilation and class loading on first run, bringing a "one-time cost."',
          'However, this doesn\'t mean Compose is slow. By introducing "Baseline Profiles," developers can instruct the system to AOT compile critical Compose paths during installation, almost completely eliminating startup performance gaps.',
          'In runtime performance (such as list scrolling, animation smoothness), thanks to smart recomposition mechanisms, Compose often outperforms traditional View systems, showing lower frame drop rates (Slow Frame %).',
        ],
      },
      {
        heading: 'Authoritative Migration Strategy: Step by Step',
        paragraphs: [
          'For large XML projects, "rewriting" is unacceptable. The officially recommended and only viable strategy is "incremental migration."',
          '1. **Use Compose for new features**: All new screens and feature modules should be 100% Compose.',
          '2. **Build a Design System**: Extract common UI components (buttons, inputs, cards) as Compose components to establish a unified design system.',
          '3. **Migrate screen by screen**: Start with simple pages and gradually replace existing Activities or Fragments.',
        ],
      },
      {
        heading: 'Interoperability Tactical Manual',
        paragraphs: [
          '**Using Compose in XML**: Use `ComposeView`. The key is setting `setViewCompositionStrategy(ViewCompositionStrategy.DisposeOnViewTreeLifecycleDestroyed)` to ensure Compose state is properly cleaned when Fragment views are destroyed, avoiding memory leaks and state loss.',
          '**Using XML in Compose**: Use `AndroidView`. This is the bridge for integrating maps, WebViews, or complex custom Views that haven\'t been migrated yet. Create Views through the `factory` lambda and respond to Compose state changes through the `update` lambda for a unidirectional data flow closed loop.',
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
            // When lat/lng changes, update MapView
            view.updateLocation(lat, lng)
        }
    )
}`,
      },
    ],
  },
  {
    slug: 'xml-performance-deep-dive',
    title: 'XML Layout System Performance Hazards: From LayoutInflater to Double Taxation',
    description: 'Deep analysis of Android traditional View system rendering mechanisms, revealing LayoutInflater reflection costs and "double taxation" issues from nested layouts, explaining from fundamental principles why Compose is the inevitable evolution.',
    publishedAt: '2025-11-20',
    updatedAt: '2025-11-20',
    author: 'Engineering Team',
    tags: ['Android', 'XML', 'Performance', 'Render'],
    readingMinutes: 12,
    sections: [
      {
        heading: 'LayoutInflater: The Expensive Process of XML to View',
        paragraphs: [
          'XML layout files are essentially just static text descriptions. To convert them into user-visible interfaces, the Android system must execute "Layout Inflation." This process is handled by the `LayoutInflater` class, comprising four steps: parsing, instantiation, attribute application, and view tree construction.',
          'The "instantiation" step is particularly expensive. For each tag in XML (like `<Button>`), the system needs to use Java Reflection to find and load the corresponding View class. Reflection operations are very time-consuming at runtime, especially in pages with complex layouts and numerous widgets, directly causing interface loading delays.',
          'Additionally, the system must traverse every attribute in XML and apply them again through reflection or setter method lookups. This means a complex XML layout might contain hundreds or thousands of reflection calls and method lookups, accumulating into significant performance overhead.',
        ],
      },
      {
        heading: 'Measure and Layout Process',
        paragraphs: [
          'After View objects are created, they must go through measure and layout phases before drawing. During measurement, parent containers ask child Views how much space they need; during layout, parent containers determine child Views\' specific positions.',
          'This is a top-down recursive process. The core performance issue is that certain commonly used layout containers (especially `LinearLayout` and `RelativeLayout`) often need to measure the same child View multiple times to determine its size.',
        ],
      },
      {
        heading: 'Double Taxation: Exponential Disaster',
        paragraphs: [
          'Take the most common `LinearLayout` with `layout_weight` as an example. To proportionally allocate remaining space, `LinearLayout` must perform two measurement passes: first measuring all non-weighted items to determine space used; second remeasuring weighted items based on remaining space and weight ratios.',
          'This is called "Double Taxation." If there\'s only one level, it\'s still acceptable. But modern UIs are often very complex, leading to layer upon layer of nesting. When a layout requiring double measurement is nested within another layout requiring double measurement, measurement counts explode exponentially.',
          'For example, a 3-layer nested weighted `LinearLayout` structure causes the innermost View to be measured $2^3 = 8$ times! This "exponential disaster" is particularly deadly in `RecyclerView` item layouts, as list scrolling frequently triggers binding and measurement, directly causing dropped frames and stuttering.',
          'Although `ConstraintLayout` mitigates nesting issues through its flattened characteristics, it cannot change the underlying architecture of the View system that "allows and even depends on multiple measurements." Jetpack Compose introduces "Intrinsic Measurement" and strict "single-pass measurement" rules, fundamentally eliminating double taxation at the architectural level, ensuring linear (rather than exponential) predictable performance as UI complexity increases.',
        ],
      },
    ],
  },
  {
    slug: 'compose-compiler-magic',
    title: 'Deconstructing the Compose Compiler: How @Composable Changes Android Development',
    description: 'Unveiling the mystery of @Composable annotation, deeply understanding how the Compose compiler plugin achieves efficient UI updates through "Slot Table" and "Positional Memoization," and its similarities and differences with Kotlin suspend functions.',
    publishedAt: '2025-11-21',
    updatedAt: '2025-11-21',
    author: 'Engineering Team',
    tags: ['Compiler', 'Kotlin', 'Internals', 'Composable'],
    readingMinutes: 14,
    sections: [
      {
        heading: '@Composable: More Than Just an Annotation',
        paragraphs: [
          'Many beginners think `@Composable` is similar to Dagger\'s `@Inject`, a runtime annotation. In fact, it\'s more like Kotlin\'s `suspend` keyword, a language-level feature that changes the function type.',
          '`@Composable` corresponds to a Kotlin compiler plugin (Compose Compiler Plugin). During compilation, this plugin intercepts all marked functions and rewrites their signatures. The most notable change is injecting an implicit parameter: `Composer`.',
          '`Composer` is the core context object of Compose runtime, running through the entire UI tree construction process, responsible for recording the position of executing nodes, storing state, and scheduling recomposition. This explains why Composable functions can only be called from other Composable functions — they need this implicitly passed `Composer` context.',
        ],
      },
      {
        heading: 'Slot Table and Gap Buffer',
        paragraphs: [
          'How does Compose store the UI tree? It doesn\'t use traditional object trees (like View Hierarchy) but an array-based linear data structure called "Slot Table."',
          'The Slot Table\'s design is inspired by "Gap Buffer" commonly used in text editors. It\'s an array containing data but keeps an empty "gap" at the current operation position. This allows Compose to move the cursor in O(1) time complexity and efficiently insert or delete data at the current position.',
          'This structure is extremely suitable for the dynamic nature of UI. When recomposition occurs, code generated by the Compose compiler accesses the slot table in execution order. If data (such as state or node structure) hasn\'t changed, it skips directly; if changed, it efficiently updates array content using the gap buffer.',
        ],
      },
      {
        heading: 'Positional Memoization',
        paragraphs: [
          'Understanding the slot table helps understand how `remember` works. `remember` isn\'t magic; it uses "Positional Memoization" technique.',
          'Because Composable function execution order is typically stable during recomposition, Compose can use the function\'s "position" in source code as a key to look up and store values in the slot table. When code executes `remember { ... }`, Composer checks if a cached value already exists at the current slot position. If yes and dependencies haven\'t changed, return directly; otherwise, execute the lambda to compute new value and store in slot.',
          'This mechanism allows functional UI to have "state," and this state can persist across multiple recompositions until that Composable is removed from the UI tree.',
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

