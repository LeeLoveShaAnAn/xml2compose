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
    author: 'Engineering Team',
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
    author: 'Engineering Team',
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
    author: 'Engineering Team',
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
  {
    slug: 'modifier-order-matters',
    title: 'The Hidden Trap: How Modifier Order Can Ruin Your Compose Layout',
    description: 'A simple padding vs background ordering mistake can cost you two hours of debugging. This article breaks down Modifier chain execution logic with real examples so you finally understand what goes where.',
    publishedAt: '2025-12-10',
    updatedAt: '2025-12-10',
    author: 'Engineering Team',
    tags: ['Compose', 'Modifier', 'Debug', 'Layout'],
    readingMinutes: 8,
    sections: [
      {
        heading: 'A Bug That Made Someone Rage-Quit',
        paragraphs: [
          'Last Friday at 5:30 PM, my colleague Jake slammed his desk. He spent two hours debugging a button where the background color was bleeding outside the rounded corners. The fix? He had put clip() after background(). That was it.',
          'This is not an isolated incident. Modifier ordering is the #1 gotcha for Compose newcomers. The worst part? No compile errors, no lint warnings — just a button that looks slightly off and you cannot figure out why.',
        ],
      },
      {
        heading: 'The Onion Model: Outer to Inner',
        paragraphs: [
          'The key to understanding Modifier order is to think of it as an onion. The first Modifier you write is the outermost layer, and the last one is innermost. Layout measures from outside-in, drawing renders from inside-out. Here is a classic example:',
        ],
        code: `// Version A: Red background covers the entire area INCLUDING padding
Box(
    modifier = Modifier
        .background(Color.Red)
        .padding(16.dp)
)

// Version B: Red background only fills INSIDE the padding, 16dp border is transparent
Box(
    modifier = Modifier
        .padding(16.dp)
        .background(Color.Red)
)`,
      },
      {
        heading: 'Real Fix: Rounded Button with Shadow',
        paragraphs: [
          'Jake made this exact mistake. He wanted a button with rounded corners and a shadow:',
        ],
        code: `// ❌ WRONG: Shadow gets clipped, background bleeds outside corners
Box(
    modifier = Modifier
        .shadow(4.dp, RoundedCornerShape(12.dp))
        .background(Color.Blue)
        .clip(RoundedCornerShape(12.dp))  // Too late!
        .padding(16.dp)
)

// ✅ CORRECT: Clip first, then fill
Box(
    modifier = Modifier
        .shadow(4.dp, RoundedCornerShape(12.dp))
        .clip(RoundedCornerShape(12.dp))  // Clip first
        .background(Color.Blue)            // Then fill color
        .padding(16.dp)
)`,
      },
      {
        paragraphs: [
          'Here is the order cheat sheet: shadow → clip → background → border → padding → clickable. Shadow must be outermost (so it draws outside the component), clip must come before background (otherwise the color is already painted outside before you clip).',
        ],
      },
      {
        heading: 'Where Should clickable() Go?',
        paragraphs: [
          'Another common issue is touch target size. If you want the padding area to respond to taps, clickable must come BEFORE padding:',
        ],
        code: `// Touch target INCLUDES padding
Modifier
    .clickable { onClick() }
    .padding(16.dp)

// Touch target EXCLUDES padding (users tap edges, nothing happens)
Modifier
    .padding(16.dp)
    .clickable { onClick() }`,
      },
      {
        paragraphs: [
          'This also explains why Material components have ripple effects that spread across the entire surface — internally, they place clickable before size modifiers.',
        ],
      },
      {
        heading: 'Debugging Tip: Layout Inspector',
        paragraphs: [
          'When you are unsure if Modifier order is correct, open Android Studio Layout Inspector. In Compose mode, you can see exactly how each Modifier affects the size — layer by layer.',
          'A dumber but effective trick: temporarily add a different background color to each layer and see where each boundary lands. Crude, but it works.',
        ],
      },
    ],
  },
  {
    slug: 'recomposition-debugging-guide',
    title: 'Why Is Your Composable Recomposing Like Crazy? A Debugging Guide',
    description: 'UI jank and list stuttering often come from unnecessary recompositions. This guide walks you through Compose Compiler Metrics and common code patterns to find and fix the culprits.',
    publishedAt: '2025-12-10',
    updatedAt: '2025-12-10',
    author: 'Engineering Team',
    tags: ['Compose', 'Performance', 'Recomposition', 'Debug'],
    readingMinutes: 11,
    sections: [
      {
        heading: 'The Symptom: List Scrolling Like a Slideshow',
        paragraphs: [
          'The story always starts the same way: PM says "why does this list scroll like a PowerPoint presentation?" You open Profiler and see recomposition count spiking at hundreds per second.',
          'The problem is often not the list itself, but some innocent-looking ViewModel or state update triggering recomposition across a huge subtree. Let us debug this systematically.',
        ],
      },
      {
        heading: 'Step 1: Enable Recomposition Highlighting',
        paragraphs: [
          'Since Android Studio Hedgehog, Layout Inspector can highlight Composables that are recomposing. Go to Layout Inspector settings and turn on "Show Recomposition Counts". Then interact with your UI and watch which areas are flashing like a disco.',
          'If a component that should not be changing keeps recomposing, that is your suspect.',
        ],
      },
      {
        heading: 'Step 2: Compose Compiler Metrics',
        paragraphs: [
          'Enable compiler metrics in your build.gradle:',
        ],
        code: `composeCompiler {
    reportsDestination = layout.buildDirectory.dir("compose_compiler")
    metricsDestination = layout.buildDirectory.dir("compose_compiler")
}`,
      },
      {
        paragraphs: [
          'After building, check the generated .txt files. Watch for two types of functions:',
        ],
        list: [
          'restartable but not skippable: These run every time their parent recomposes, even if their parameters have not changed',
          'unstable parameters: Parameter types that Compose cannot prove are stable, forcing recomposition',
        ],
      },
      {
        heading: 'Common Culprit #1: Lambda Captures',
        paragraphs: [
          'Problematic code looks like this:',
        ],
        code: `@Composable
fun UserCard(user: User, viewModel: UserViewModel) {
    Button(onClick = { viewModel.onUserClick(user.id) }) {
        Text(user.name)
    }
}`,
      },
      {
        paragraphs: [
          'Every time UserCard recomposes, the onClick lambda is a new instance (because it captures external variables), so Button cannot skip. Fix: wrap the lambda in remember:',
        ],
        code: `@Composable
fun UserCard(user: User, viewModel: UserViewModel) {
    val onClick = remember(user.id) { { viewModel.onUserClick(user.id) } }
    Button(onClick = onClick) {
        Text(user.name)
    }
}`,
      },
      {
        heading: 'Common Culprit #2: Unstable Data Classes',
        paragraphs: [
          'Compose determines if parameters changed by checking type "stability". List, Map, and other collection types are unstable by default — even if their contents have not changed, they trigger recomposition.',
        ],
        code: `// UNSTABLE — recomposes every time
data class ScreenState(
    val items: List<Item>  // List is unstable
)

// STABLE — can skip correctly
@Immutable
data class ScreenState(
    val items: ImmutableList<Item>  // from kotlinx.collections.immutable
)`,
      },
      {
        paragraphs: [
          'Add the kotlinx-collections-immutable library and swap List for ImmutableList, Map for ImmutableMap. Or annotate your data class with @Immutable (but you must guarantee it truly never mutates).',
        ],
      },
      {
        heading: 'Common Culprit #3: Uncached Derived State',
        paragraphs: [
          'If you compute something inside a Composable, it runs on every recomposition:',
        ],
        code: `// ❌ Filters on every recomposition
@Composable
fun FilteredList(items: List<Item>, filter: String) {
    val filtered = items.filter { it.name.contains(filter) }
    LazyColumn { items(filtered) { ... } }
}

// ✅ Cache with remember
@Composable
fun FilteredList(items: List<Item>, filter: String) {
    val filtered = remember(items, filter) {
        items.filter { it.name.contains(filter) }
    }
    LazyColumn { items(filtered) { ... } }
}`,
      },
      {
        heading: 'Last Resort: CompositionLocal Abuse Check',
        paragraphs: [
          'If a CompositionLocal value changes frequently, every Composable reading it will recompose. This often happens when you shove an entire ViewModel or large state object into CompositionLocal.',
          'Solution: Only pass truly global values (like theme or locale) through CompositionLocal. Everything else should use parameter passing or dependency injection.',
        ],
        note: 'Rule of thumb: If you find yourself "optimizing recomposition", first ask if your architecture is the real problem. Good state decomposition beats manual remember every time.',
      },
    ],
  },
  {
    slug: 'material3-theming-deep-dive',
    title: 'Material 3 Theming in Compose: Building Dynamic Color Systems',
    description: 'Master Material 3 dynamic color system in Jetpack Compose. Learn how to implement adaptive themes, custom color schemes, and dark mode support that delights users.',
    publishedAt: '2025-12-11',
    updatedAt: '2025-12-11',
    author: 'Engineering Team',
    tags: ['Material 3', 'Theming', 'Dynamic Color', 'Design System'],
    readingMinutes: 14,
    sections: [
      {
        heading: 'Why Material 3 Changes Everything',
        paragraphs: [
          'Material 3 (also known as Material You) represents a fundamental shift in how Android apps approach theming. Instead of static color palettes, M3 introduces dynamic color extraction from user wallpapers, creating a personalized experience for every user.',
          'For developers migrating from XML, this is a significant upgrade. Traditional theme.xml files with hardcoded colors are replaced by a flexible, programmatic color system that adapts to user preferences automatically.',
        ],
      },
      {
        heading: 'Setting Up Material 3 in Compose',
        paragraphs: [
          'The foundation of M3 theming is the MaterialTheme composable. Unlike M2, M3 uses a ColorScheme with expanded color roles:',
        ],
        code: `@Composable
fun MyAppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context)
            else dynamicLightColorScheme(context)
        }
        darkTheme -> DarkColorScheme
        else -> LightColorScheme
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}`,
      },
      {
        heading: 'Understanding Color Roles',
        paragraphs: [
          'M3 introduces semantic color roles that describe the purpose of colors rather than their appearance:',
        ],
        list: [
          'primary/onPrimary: Main brand color and text on top of it',
          'secondary/onSecondary: Supporting accent color for less prominent elements',
          'tertiary/onTertiary: Contrasting accent for visual interest',
          'surface/onSurface: Background colors and text for content areas',
          'error/onError: States indicating errors or destructive actions',
        ],
        note: 'Always use semantic color roles instead of hardcoded colors. This ensures your UI adapts correctly to light/dark themes and dynamic colors.',
      },
      {
        heading: 'Custom Color Schemes',
        paragraphs: [
          'For brand consistency, you can define custom color schemes while still supporting dynamic colors as a fallback:',
        ],
        code: `private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF6750A4),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFEADDFF),
    onPrimaryContainer = Color(0xFF21005D),
    secondary = Color(0xFF625B71),
    // ... other colors
)

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFFD0BCFF),
    onPrimary = Color(0xFF381E72),
    primaryContainer = Color(0xFF4F378B),
    onPrimaryContainer = Color(0xFFEADDFF),
    // ... other colors
)`,
      },
    ],
  },
  {
    slug: 'lazycolumn-performance-masterclass',
    title: 'LazyColumn Performance Masterclass: Handling 10,000+ Items Smoothly',
    description: 'Learn advanced techniques to optimize LazyColumn performance in Jetpack Compose. From key strategies to custom item providers, make your lists butter-smooth.',
    publishedAt: '2025-12-10',
    updatedAt: '2025-12-10',
    author: 'Engineering Team',
    tags: ['LazyColumn', 'Performance', 'Lists', 'Optimization'],
    readingMinutes: 16,
    sections: [
      {
        heading: 'The Foundation: Keys Are Non-Negotiable',
        paragraphs: [
          'The single most important optimization for LazyColumn is providing stable keys. Without keys, Compose cannot efficiently track item identity across data changes, leading to unnecessary recompositions and visual glitches.',
        ],
        code: `// ❌ BAD: No keys - Compose uses index by default
LazyColumn {
    items(users) { user ->
        UserCard(user)
    }
}

// ✅ GOOD: Stable keys based on unique identifier
LazyColumn {
    items(
        items = users,
        key = { user -> user.id }  // Must be unique and stable
    ) { user ->
        UserCard(user)
    }
}`,
      },
      {
        heading: 'Content Type Optimization',
        paragraphs: [
          'When your list contains different item types (headers, content, footers), use contentType to enable Compose to reuse compositions more efficiently:',
        ],
        code: `LazyColumn {
    items(
        items = feedItems,
        key = { it.id },
        contentType = { item ->
            when (item) {
                is FeedItem.Header -> "header"
                is FeedItem.Post -> "post"
                is FeedItem.Ad -> "ad"
            }
        }
    ) { item ->
        when (item) {
            is FeedItem.Header -> HeaderCard(item)
            is FeedItem.Post -> PostCard(item)
            is FeedItem.Ad -> AdCard(item)
        }
    }
}`,
      },
      {
        heading: 'Avoid Expensive Operations in Item Scope',
        paragraphs: [
          'Item composables should be as lightweight as possible. Move expensive calculations outside the LazyColumn scope:',
        ],
        list: [
          'Use remember with proper keys for computed values',
          'Avoid creating new objects (lambdas, data classes) inside items',
          'Pre-process data in ViewModel before passing to UI',
          'Use derivedStateOf for filtered/sorted lists',
        ],
      },
      {
        heading: 'Prefetch and Placeholder Strategies',
        paragraphs: [
          'For extremely large lists or network-loaded content, implement prefetching and placeholders:',
        ],
        code: `@Composable
fun InfiniteUserList(
    users: LazyPagingItems<User>
) {
    LazyColumn {
        items(
            count = users.itemCount,
            key = users.itemKey { it.id }
        ) { index ->
            val user = users[index]
            if (user != null) {
                UserCard(user)
            } else {
                UserCardPlaceholder()  // Shimmer loading state
            }
        }
    }
}`,
        note: 'Use Paging 3 library with Compose for automatic prefetching and memory management. It handles the complex logic of loading data in chunks.',
      },
    ],
  },
  {
    slug: 'custom-layouts-compose',
    title: 'Building Custom Layouts in Compose: Beyond Row and Column',
    description: 'Learn how to create custom layout components in Jetpack Compose. From basic Layout composables to complex multi-child layouts with intrinsic measurements.',
    publishedAt: '2025-12-09',
    updatedAt: '2025-12-09',
    author: 'Engineering Team',
    tags: ['Custom Layout', 'Architecture', 'Advanced', 'UI Components'],
    readingMinutes: 15,
    sections: [
      {
        heading: 'When Built-in Layouts Are Not Enough',
        paragraphs: [
          'Row, Column, and Box cover 90% of layout needs. But sometimes you need pixel-perfect control: overlapping elements with specific offsets, flow layouts that wrap content, or performance-critical layouts that minimize measurement passes.',
          'Custom layouts in Compose are surprisingly approachable. The Layout composable gives you direct access to measurement and placement, while maintaining the declarative paradigm.',
        ],
      },
      {
        heading: 'The Layout Composable Basics',
        paragraphs: [
          'Every custom layout starts with the Layout composable. It takes content and a MeasurePolicy:',
        ],
        code: `@Composable
fun SimpleCustomLayout(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit
) {
    Layout(
        content = content,
        modifier = modifier
    ) { measurables, constraints ->
        // 1. Measure children
        val placeables = measurables.map { measurable ->
            measurable.measure(constraints)
        }
        
        // 2. Decide layout size
        val width = placeables.maxOf { it.width }
        val height = placeables.sumOf { it.height }
        
        // 3. Place children
        layout(width, height) {
            var yPosition = 0
            placeables.forEach { placeable ->
                placeable.placeRelative(x = 0, y = yPosition)
                yPosition += placeable.height
            }
        }
    }
}`,
      },
      {
        heading: 'Real Example: Flow Layout',
        paragraphs: [
          'A flow layout wraps children to the next row when they exceed available width. This is perfect for tag clouds or chip groups:',
        ],
        code: `@Composable
fun FlowRow(
    modifier: Modifier = Modifier,
    horizontalSpacing: Dp = 8.dp,
    verticalSpacing: Dp = 8.dp,
    content: @Composable () -> Unit
) {
    Layout(content = content, modifier = modifier) { measurables, constraints ->
        val hSpacingPx = horizontalSpacing.roundToPx()
        val vSpacingPx = verticalSpacing.roundToPx()
        
        val placeables = measurables.map { it.measure(constraints) }
        
        var currentX = 0
        var currentY = 0
        var rowHeight = 0
        
        val positions = placeables.map { placeable ->
            if (currentX + placeable.width > constraints.maxWidth) {
                currentX = 0
                currentY += rowHeight + vSpacingPx
                rowHeight = 0
            }
            val position = IntOffset(currentX, currentY)
            currentX += placeable.width + hSpacingPx
            rowHeight = maxOf(rowHeight, placeable.height)
            position
        }
        
        layout(constraints.maxWidth, currentY + rowHeight) {
            placeables.forEachIndexed { index, placeable ->
                placeable.placeRelative(positions[index])
            }
        }
    }
}`,
      },
      {
        heading: 'Intrinsic Measurements',
        paragraphs: [
          'Sometimes parent layouts need to know child sizes before full measurement. Compose provides intrinsic measurements for this:',
        ],
        list: [
          'minIntrinsicWidth/Height: Minimum size needed to display content properly',
          'maxIntrinsicWidth/Height: Size needed to display content without constraints',
          'Use IntrinsicSize.Min or IntrinsicSize.Max modifiers to query these values',
        ],
        note: 'Intrinsic measurements add an extra measurement pass. Use sparingly and only when necessary for correct layout behavior.',
      },
    ],
  },
  {
    slug: 'compose-navigation-patterns',
    title: 'Navigation in Compose: From Basic Routes to Complex Flows',
    description: 'Master Jetpack Compose Navigation. Learn type-safe navigation, nested graphs, deep links, and how to handle complex multi-module navigation architectures.',
    publishedAt: '2025-12-08',
    updatedAt: '2025-12-08',
    author: 'Engineering Team',
    tags: ['Navigation', 'Architecture', 'Deep Links', 'Multi-module'],
    readingMinutes: 17,
    sections: [
      {
        heading: 'Navigation Compose Fundamentals',
        paragraphs: [
          'Compose Navigation moves away from fragment transactions to a declarative model where destinations are composables. The core components are NavHost, NavController, and NavGraph.',
        ],
        code: `@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    
    NavHost(
        navController = navController,
        startDestination = "home"
    ) {
        composable("home") {
            HomeScreen(
                onNavigateToDetail = { id ->
                    navController.navigate("detail/$id")
                }
            )
        }
        composable(
            route = "detail/{itemId}",
            arguments = listOf(
                navArgument("itemId") { type = NavType.StringType }
            )
        ) { backStackEntry ->
            val itemId = backStackEntry.arguments?.getString("itemId")
            DetailScreen(itemId = itemId)
        }
    }
}`,
      },
      {
        heading: 'Type-Safe Navigation with Kotlin Serialization',
        paragraphs: [
          'String-based routes are error-prone. Use sealed classes or data classes with Kotlin Serialization for type-safe navigation:',
        ],
        code: `@Serializable
sealed class Screen {
    @Serializable
    data object Home : Screen()
    
    @Serializable
    data class Detail(val itemId: String) : Screen()
    
    @Serializable
    data class Profile(val userId: String, val showEdit: Boolean = false) : Screen()
}

// Usage with type-safe navigation
navController.navigate(Screen.Detail(itemId = "123"))
navController.navigate(Screen.Profile(userId = "456", showEdit = true))`,
      },
      {
        heading: 'Nested Navigation Graphs',
        paragraphs: [
          'For complex apps, organize related destinations into nested graphs. This improves code organization and enables modular navigation:',
        ],
        code: `NavHost(navController = navController, startDestination = "main") {
    // Main flow
    navigation(startDestination = "home", route = "main") {
        composable("home") { HomeScreen() }
        composable("search") { SearchScreen() }
    }
    
    // Auth flow - separate graph
    navigation(startDestination = "login", route = "auth") {
        composable("login") { LoginScreen() }
        composable("register") { RegisterScreen() }
        composable("forgot_password") { ForgotPasswordScreen() }
    }
    
    // Settings flow
    navigation(startDestination = "settings_main", route = "settings") {
        composable("settings_main") { SettingsScreen() }
        composable("settings_account") { AccountSettingsScreen() }
    }
}`,
      },
      {
        heading: 'Deep Links Integration',
        paragraphs: [
          'Deep links allow external sources to navigate directly to specific screens. Configure them in your composable destinations:',
        ],
        code: `composable(
    route = "product/{productId}",
    arguments = listOf(navArgument("productId") { type = NavType.StringType }),
    deepLinks = listOf(
        navDeepLink { uriPattern = "https://myapp.com/product/{productId}" },
        navDeepLink { uriPattern = "myapp://product/{productId}" }
    )
) { backStackEntry ->
    ProductScreen(productId = backStackEntry.arguments?.getString("productId"))
}`,
        note: 'Remember to declare deep link intents in AndroidManifest.xml for the app to respond to external URLs.',
      },
    ],
  },
  {
    slug: 'testing-compose-ui',
    title: 'Testing Compose UI: A Comprehensive Guide to Reliable Tests',
    description: 'Learn how to write effective tests for Jetpack Compose UIs. From unit tests with ComposeContentTestRule to screenshot testing and accessibility validation.',
    publishedAt: '2025-12-07',
    updatedAt: '2025-12-07',
    author: 'Engineering Team',
    tags: ['Testing', 'UI Testing', 'Quality Assurance', 'Screenshot Testing'],
    readingMinutes: 13,
    sections: [
      {
        heading: 'The Compose Testing Philosophy',
        paragraphs: [
          'Compose testing differs fundamentally from View testing. Instead of finding views by ID and simulating touches, you interact with the semantic tree that Compose uses for accessibility. This makes tests more resilient and closer to how users actually interact with your app.',
        ],
      },
      {
        heading: 'Setting Up Compose Tests',
        paragraphs: [
          'Add the testing dependencies and create your first test:',
        ],
        code: `// build.gradle.kts
dependencies {
    androidTestImplementation("androidx.compose.ui:ui-test-junit4")
    debugImplementation("androidx.compose.ui:ui-test-manifest")
}

// LoginScreenTest.kt
class LoginScreenTest {
    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun loginButton_isDisabled_whenEmailIsEmpty() {
        composeTestRule.setContent {
            LoginScreen()
        }
        
        composeTestRule
            .onNodeWithText("Log In")
            .assertIsNotEnabled()
    }
}`,
      },
      {
        heading: 'Finding and Interacting with Nodes',
        paragraphs: [
          'Compose provides powerful matchers to find nodes in the semantic tree:',
        ],
        code: `// Find by text
composeTestRule.onNodeWithText("Submit")

// Find by content description (accessibility)
composeTestRule.onNodeWithContentDescription("Close button")

// Find by test tag
composeTestRule.onNodeWithTag("email_input")

// Combine matchers
composeTestRule.onNode(
    hasText("Submit") and hasClickAction() and isEnabled()
)

// Perform actions
composeTestRule.onNodeWithTag("email_input")
    .performTextInput("user@example.com")
    
composeTestRule.onNodeWithText("Submit")
    .performClick()`,
      },
      {
        heading: 'Testing State and Recomposition',
        paragraphs: [
          'For testing state changes and async operations, use waitUntil and other synchronization utilities:',
        ],
        code: `@Test
fun loadingIndicator_disappears_afterDataLoads() {
    composeTestRule.setContent {
        MyScreenWithLoading()
    }
    
    // Initially shows loading
    composeTestRule.onNodeWithTag("loading").assertIsDisplayed()
    
    // Wait for loading to complete
    composeTestRule.waitUntil(timeoutMillis = 5000) {
        composeTestRule
            .onAllNodesWithTag("loading")
            .fetchSemanticsNodes().isEmpty()
    }
    
    // Content is now visible
    composeTestRule.onNodeWithTag("content").assertIsDisplayed()
}`,
      },
      {
        heading: 'Screenshot Testing with Paparazzi',
        paragraphs: [
          'Screenshot tests catch visual regressions that functional tests miss. Paparazzi runs on JVM without an emulator:',
        ],
        code: `class ButtonScreenshotTest {
    @get:Rule
    val paparazzi = Paparazzi(
        theme = "android:Theme.Material3.Light"
    )

    @Test
    fun primaryButton_default() {
        paparazzi.snapshot {
            PrimaryButton(text = "Click Me", onClick = {})
        }
    }
    
    @Test
    fun primaryButton_disabled() {
        paparazzi.snapshot {
            PrimaryButton(text = "Click Me", enabled = false, onClick = {})
        }
    }
}`,
        note: 'Run screenshot tests on CI with consistent environment settings. Small differences in font rendering or density can cause false failures across different machines.',
      },
    ],
  },
  {
    slug: 'compose-side-effects-explained',
    title: 'Side Effects in Compose: LaunchedEffect, DisposableEffect, and Friends',
    description: 'Demystify Compose side effect APIs. Learn when to use LaunchedEffect, DisposableEffect, SideEffect, and rememberCoroutineScope for clean, lifecycle-aware code.',
    publishedAt: '2025-12-14',
    updatedAt: '2025-12-14',
    author: 'Engineering Team',
    tags: ['Side Effects', 'Lifecycle', 'Coroutines', 'Best Practices'],
    readingMinutes: 12,
    sections: [
      {
        heading: 'What Are Side Effects in Compose?',
        paragraphs: [
          'In Compose, a side effect is any operation that escapes the scope of a composable function — network calls, database writes, analytics events, or anything that should persist beyond recomposition. Since composables can recompose frequently and unpredictably, uncontrolled side effects lead to bugs.',
          'Compose provides dedicated APIs to manage side effects safely. Each has a specific use case, and choosing the wrong one is a common source of subtle bugs.',
        ],
      },
      {
        heading: 'LaunchedEffect: One-Shot Coroutines',
        paragraphs: [
          'LaunchedEffect launches a coroutine when it enters composition and cancels it when leaving. Use it for one-shot operations triggered by key changes:',
        ],
        code: `@Composable
fun UserProfile(userId: String) {
    var user by remember { mutableStateOf<User?>(null) }
    
    // Launches when userId changes, cancels previous if still running
    LaunchedEffect(userId) {
        user = repository.fetchUser(userId)
    }
    
    user?.let { ProfileContent(it) } ?: LoadingSpinner()
}`,
        note: 'Always provide meaningful keys to LaunchedEffect. Using Unit as key means it runs once on first composition only.',
      },
      {
        heading: 'DisposableEffect: Setup and Cleanup',
        paragraphs: [
          'DisposableEffect is for operations that require cleanup — listeners, callbacks, or resources that must be released:',
        ],
        code: `@Composable
fun LocationTracker(onLocationChanged: (Location) -> Unit) {
    val context = LocalContext.current
    
    DisposableEffect(Unit) {
        val locationManager = context.getSystemService<LocationManager>()
        val listener = LocationListener { location ->
            onLocationChanged(location)
        }
        
        locationManager?.requestLocationUpdates(
            LocationManager.GPS_PROVIDER,
            1000L,
            10f,
            listener
        )
        
        onDispose {
            locationManager?.removeUpdates(listener)
        }
    }
}`,
      },
      {
        heading: 'rememberCoroutineScope: User-Triggered Actions',
        paragraphs: [
          'For coroutines triggered by user actions (not composition), use rememberCoroutineScope. Unlike LaunchedEffect, it survives recomposition:',
        ],
        code: `@Composable
fun SubmitButton(onSubmit: suspend () -> Result<Unit>) {
    val scope = rememberCoroutineScope()
    var isLoading by remember { mutableStateOf(false) }
    
    Button(
        onClick = {
            scope.launch {
                isLoading = true
                onSubmit()
                isLoading = false
            }
        },
        enabled = !isLoading
    ) {
        if (isLoading) CircularProgressIndicator() else Text("Submit")
    }
}`,
      },
      {
        heading: 'SideEffect: Sync with Non-Compose Code',
        paragraphs: [
          'SideEffect runs on every successful recomposition. Use it to sync Compose state with non-Compose systems like analytics or logging:',
        ],
        code: `@Composable
fun AnalyticsScreen(screenName: String, content: @Composable () -> Unit) {
    SideEffect {
        // Runs on every successful recomposition
        analytics.trackScreenView(screenName)
    }
    content()
}`,
        note: 'SideEffect should never trigger recomposition or modify state. It is purely for syncing with external systems.',
      },
    ],
  },
  {
    slug: 'compose-accessibility-guide',
    title: 'Building Accessible Apps with Compose: A Complete Guide',
    description: 'Make your Compose apps accessible to everyone. Learn semantics, content descriptions, touch targets, and how to test with TalkBack and accessibility scanners.',
    publishedAt: '2025-12-13',
    updatedAt: '2025-12-13',
    author: 'Engineering Team',
    tags: ['Accessibility', 'Semantics', 'TalkBack', 'Inclusive Design'],
    readingMinutes: 14,
    sections: [
      {
        heading: 'Why Accessibility Matters',
        paragraphs: [
          'Over 1 billion people worldwide have disabilities. Building accessible apps is not just ethical — it is often legally required and expands your user base. Compose makes accessibility easier than ever with its semantic tree approach.',
          'The semantic tree is a parallel structure to the UI tree that accessibility services like TalkBack use to understand your app. Every composable can contribute to this tree.',
        ],
      },
      {
        heading: 'Content Descriptions for Images',
        paragraphs: [
          'Screen readers cannot see images. Always provide meaningful descriptions:',
        ],
        code: `// Informative image - describe what it shows
Image(
    painter = painterResource(R.drawable.product_photo),
    contentDescription = "Red running shoes, side view"
)

// Decorative image - hide from accessibility tree
Image(
    painter = painterResource(R.drawable.decorative_divider),
    contentDescription = null  // Explicitly null for decorative
)

// Icon button - describe the action, not the icon
IconButton(onClick = { /* delete */ }) {
    Icon(
        Icons.Default.Delete,
        contentDescription = "Delete item"  // Not "trash can icon"
    )
}`,
      },
      {
        heading: 'Semantic Merging and Grouping',
        paragraphs: [
          'By default, every Text and clickable element is a separate node. Merge related content for better screen reader experience:',
        ],
        code: `// Before: TalkBack reads "John Doe" then "Senior Engineer" separately
Row {
    Text("John Doe")
    Text("Senior Engineer")
}

// After: TalkBack reads "John Doe, Senior Engineer" as one item
Row(modifier = Modifier.semantics(mergeDescendants = true) {}) {
    Text("John Doe")
    Text("Senior Engineer")
}

// For interactive items with multiple text elements
Card(
    modifier = Modifier
        .clickable { openProfile() }
        .semantics(mergeDescendants = true) {}
) {
    Text("John Doe")
    Text("Senior Engineer")
    Text("View Profile")
}`,
      },
      {
        heading: 'Touch Target Size',
        paragraphs: [
          'Small touch targets are hard for users with motor impairments. Material 3 enforces minimum 48dp targets automatically, but custom components need manual handling:',
        ],
        code: `// Ensure minimum touch target regardless of visual size
Box(
    modifier = Modifier
        .size(24.dp)  // Visual size
        .sizeIn(minWidth = 48.dp, minHeight = 48.dp)  // Touch target
        .clickable { /* action */ },
    contentAlignment = Alignment.Center
) {
    Icon(Icons.Default.Add, contentDescription = "Add item")
}`,
      },
      {
        heading: 'Testing Accessibility',
        paragraphs: [
          'Always test with real accessibility tools:',
        ],
        list: [
          'Enable TalkBack and navigate your app using only gestures',
          'Run Accessibility Scanner from Play Store to find issues',
          'Use Layout Inspector to view the semantic tree',
          'Write accessibility tests with composeTestRule.onNode(hasContentDescription(...))',
        ],
        note: 'Accessibility testing should be part of your regular QA process, not an afterthought. Include it in your PR checklist.',
      },
    ],
  },
  {
    slug: 'compose-animations-deep-dive',
    title: 'Mastering Animations in Compose: From Simple to Complex',
    description: 'Create delightful animations in Jetpack Compose. Master animate*AsState, Transition, AnimatedVisibility, and physics-based animations for professional UIs.',
    publishedAt: '2025-12-12',
    updatedAt: '2025-12-12',
    author: 'Engineering Team',
    tags: ['Animation', 'Motion', 'UI Polish', 'User Experience'],
    readingMinutes: 16,
    sections: [
      {
        heading: 'Animation Philosophy in Compose',
        paragraphs: [
          'Compose animations are state-driven. You change state, and the framework animates between old and new values. This declarative approach eliminates the imperative animation code that was error-prone in Views.',
          'The key insight: you do not tell Compose HOW to animate, you tell it WHAT values to animate between, and it figures out the rest.',
        ],
      },
      {
        heading: 'animate*AsState: The Simplest Animation',
        paragraphs: [
          'For animating single values, animate*AsState is your go-to. It creates a smooth transition whenever the target value changes:',
        ],
        code: `@Composable
fun ExpandableCard(isExpanded: Boolean, content: @Composable () -> Unit) {
    // Animates smoothly between 100dp and 300dp
    val height by animateDpAsState(
        targetValue = if (isExpanded) 300.dp else 100.dp,
        animationSpec = spring(
            dampingRatio = Spring.DampingRatioMediumBouncy,
            stiffness = Spring.StiffnessLow
        ),
        label = "card height"
    )
    
    Card(modifier = Modifier.height(height)) {
        content()
    }
}`,
      },
      {
        heading: 'AnimatedVisibility: Enter and Exit',
        paragraphs: [
          'AnimatedVisibility handles appearing and disappearing content with customizable transitions:',
        ],
        code: `@Composable
fun NotificationBanner(message: String?, onDismiss: () -> Unit) {
    AnimatedVisibility(
        visible = message != null,
        enter = slideInVertically(initialOffsetY = { -it }) + fadeIn(),
        exit = slideOutVertically(targetOffsetY = { -it }) + fadeOut()
    ) {
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier.padding(16.dp),
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Text(message ?: "")
                IconButton(onClick = onDismiss) {
                    Icon(Icons.Default.Close, contentDescription = "Dismiss")
                }
            }
        }
    }
}`,
      },
      {
        heading: 'Transition: Coordinating Multiple Animations',
        paragraphs: [
          'When multiple values need to animate together, use updateTransition. It ensures all animations start and end at the same time:',
        ],
        code: `enum class CardState { Collapsed, Expanded }

@Composable
fun CoordinatedCard(state: CardState) {
    val transition = updateTransition(state, label = "card transition")
    
    val height by transition.animateDp(label = "height") { cardState ->
        when (cardState) {
            CardState.Collapsed -> 100.dp
            CardState.Expanded -> 300.dp
        }
    }
    
    val cornerRadius by transition.animateDp(label = "corner") { cardState ->
        when (cardState) {
            CardState.Collapsed -> 16.dp
            CardState.Expanded -> 8.dp
        }
    }
    
    val backgroundColor by transition.animateColor(label = "color") { cardState ->
        when (cardState) {
            CardState.Collapsed -> Color.LightGray
            CardState.Expanded -> Color.White
        }
    }
    
    Card(
        modifier = Modifier.height(height),
        shape = RoundedCornerShape(cornerRadius),
        colors = CardDefaults.cardColors(containerColor = backgroundColor)
    ) {
        // Content
    }
}`,
      },
      {
        heading: 'Performance Tips',
        paragraphs: [
          'Animations can be performance-intensive. Follow these guidelines:',
        ],
        list: [
          'Prefer graphicsLayer modifiers for translation, rotation, scale, and alpha — they avoid recomposition',
          'Use derivedStateOf to debounce rapid state changes',
          'Provide meaningful labels to all animations for debugging in Layout Inspector',
          'Test on low-end devices to catch performance issues early',
        ],
        note: 'Always respect user preferences. Check LocalAccessibilityManager for users who have enabled "reduce motion" in system settings.',
      },
    ],
  },
  {
    slug: 'state-hoisting-patterns',
    title: 'State Hoisting Patterns in Compose: When, Why, and How',
    description: 'Master the art of state hoisting in Jetpack Compose. Learn when to hoist state, how to design stateless components, and patterns for complex state management.',
    publishedAt: '2025-12-11',
    updatedAt: '2025-12-11',
    author: 'Engineering Team',
    tags: ['State Management', 'Architecture', 'Best Practices', 'Reusability'],
    readingMinutes: 11,
    sections: [
      {
        heading: 'What Is State Hoisting?',
        paragraphs: [
          'State hoisting is a pattern where you move state up from a composable to its caller, making the composable stateless. The composable receives state as parameters and notifies the caller of changes via callbacks.',
          'This pattern is fundamental to Compose. It makes components reusable, testable, and previewable. Material components like TextField are designed this way.',
        ],
      },
      {
        heading: 'The Basic Pattern',
        paragraphs: [
          'A stateless composable receives two things: the current value and an onValueChange callback:',
        ],
        code: `// Stateful version - owns its state, less reusable
@Composable
fun StatefulCounter() {
    var count by remember { mutableStateOf(0) }
    Button(onClick = { count++ }) {
        Text("Count: $count")
    }
}

// Stateless version - state is hoisted, fully reusable
@Composable
fun StatelessCounter(
    count: Int,
    onIncrement: () -> Unit
) {
    Button(onClick = onIncrement) {
        Text("Count: $count")
    }
}

// Usage - caller owns the state
@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }
    StatelessCounter(
        count = count,
        onIncrement = { count++ }
    )
}`,
      },
      {
        heading: 'When to Hoist State',
        paragraphs: [
          'Not all state needs hoisting. Use this decision tree:',
        ],
        list: [
          'Hoist if multiple composables need to read or write the state',
          'Hoist if a parent needs to control or observe the state',
          'Hoist if the state affects business logic or needs persistence',
          'Keep local if it is purely UI-internal (like scroll position or hover state)',
        ],
      },
      {
        heading: 'State Holder Pattern',
        paragraphs: [
          'For complex state with multiple related values, create a state holder class:',
        ],
        code: `// State holder for a search feature
class SearchState(
    initialQuery: String = "",
    initialFilters: Set<Filter> = emptySet()
) {
    var query by mutableStateOf(initialQuery)
        private set
    var filters by mutableStateOf(initialFilters)
        private set
    var isSearching by mutableStateOf(false)
        private set
    
    val hasActiveFilters: Boolean
        get() = filters.isNotEmpty()
    
    fun updateQuery(newQuery: String) {
        query = newQuery
    }
    
    fun toggleFilter(filter: Filter) {
        filters = if (filter in filters) {
            filters - filter
        } else {
            filters + filter
        }
    }
}

@Composable
fun rememberSearchState(): SearchState {
    return remember { SearchState() }
}

// Usage
@Composable
fun SearchScreen() {
    val searchState = rememberSearchState()
    
    SearchBar(
        query = searchState.query,
        onQueryChange = searchState::updateQuery,
        hasFilters = searchState.hasActiveFilters
    )
}`,
      },
      {
        heading: 'Hoisting to ViewModel',
        paragraphs: [
          'For state that survives configuration changes or needs to trigger business logic, hoist to ViewModel:',
        ],
        code: `class CartViewModel : ViewModel() {
    private val _items = MutableStateFlow<List<CartItem>>(emptyList())
    val items: StateFlow<List<CartItem>> = _items.asStateFlow()
    
    val totalPrice: StateFlow<BigDecimal> = _items
        .map { items -> items.sumOf { it.price * it.quantity } }
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(), BigDecimal.ZERO)
    
    fun addItem(item: CartItem) {
        _items.update { current -> current + item }
    }
}

@Composable
fun CartScreen(viewModel: CartViewModel = viewModel()) {
    val items by viewModel.items.collectAsStateWithLifecycle()
    val total by viewModel.totalPrice.collectAsStateWithLifecycle()
    
    CartContent(
        items = items,
        total = total,
        onAddItem = viewModel::addItem
    )
}`,
        note: 'The rule of thumb: UI state lives in composables, business state lives in ViewModels. State hoisting connects them cleanly.',
      },
    ],
  },
  {
    slug: 'compose-for-wear-os',
    title: 'Compose for Wear OS: Building Watch Apps That Shine',
    description: 'Create beautiful Wear OS apps with Compose. Learn about the unique constraints, Wear-specific components, and how to design for the wrist.',
    publishedAt: '2025-12-06',
    updatedAt: '2025-12-06',
    author: 'Engineering Team',
    tags: ['Wear OS', 'Wearables', 'Mobile', 'Cross-platform'],
    readingMinutes: 13,
    sections: [
      {
        heading: 'Wear OS: A Different Canvas',
        paragraphs: [
          'Watches are not tiny phones. They have round or square screens as small as 1.2 inches, limited battery, no keyboard, and are glanced at for seconds. Compose for Wear OS is built specifically for these constraints.',
          'The good news: if you know Compose, you already know 80% of Wear OS development. The APIs are intentionally similar, with Wear-specific additions for watch interactions.',
        ],
      },
      {
        heading: 'Setting Up a Wear Project',
        paragraphs: [
          'Wear OS uses different dependencies than mobile Compose. Your build.gradle needs:',
        ],
        code: `dependencies {
    // Wear Compose foundation and material
    implementation("androidx.wear.compose:compose-foundation:1.3.0")
    implementation("androidx.wear.compose:compose-material:1.3.0")
    implementation("androidx.wear.compose:compose-navigation:1.3.0")
    
    // Horologist for advanced features
    implementation("com.google.android.horologist:horologist-compose-layout:0.5.0")
}`,
      },
      {
        heading: 'Wear-Specific Components',
        paragraphs: [
          'Wear Compose provides components designed for watch interactions:',
        ],
        code: `@Composable
fun WearSampleApp() {
    // ScalingLazyColumn - the primary scrollable container for Wear
    ScalingLazyColumn(
        modifier = Modifier.fillMaxSize(),
        autoCentering = AutoCenteringParams(itemIndex = 0)
    ) {
        // Chip - the main interactive element (like Button)
        item {
            Chip(
                onClick = { /* action */ },
                label = { Text("Start Workout") },
                icon = {
                    Icon(
                        Icons.Default.PlayArrow,
                        contentDescription = null
                    )
                }
            )
        }
        
        // ToggleChip - for on/off settings
        item {
            ToggleChip(
                checked = true,
                onCheckedChange = { /* toggle */ },
                label = { Text("Heart Rate Monitoring") },
                toggleControl = {
                    Switch(checked = true, onCheckedChange = null)
                }
            )
        }
    }
}`,
      },
      {
        heading: 'Handling Round Screens',
        paragraphs: [
          'Content near the edges of round screens gets clipped. Use proper insets and padding:',
        ],
        code: `@Composable
fun RoundAwareScreen() {
    // Scaffold handles curved edges automatically
    Scaffold(
        timeText = { TimeText() },
        vignette = { Vignette(vignettePosition = VignettePosition.TopAndBottom) },
        positionIndicator = {
            PositionIndicator(scalingLazyListState = listState)
        }
    ) {
        ScalingLazyColumn(
            state = listState,
            contentPadding = PaddingValues(
                horizontal = 10.dp  // Extra padding for round corners
            )
        ) {
            // Content
        }
    }
}`,
      },
      {
        heading: 'Design Guidelines',
        paragraphs: [
          'Follow these principles for successful watch apps:',
        ],
        list: [
          'Keep interactions under 5 seconds — users glance, not stare',
          'Use large touch targets (minimum 48dp, prefer 52dp)',
          'Limit text to essential information',
          'Use high contrast colors for outdoor visibility',
          'Support both round and square screens',
          'Provide haptic feedback for confirmations',
        ],
        note: 'Test on real hardware. Emulators cannot replicate the small screen experience or battery constraints accurately.',
      },
    ],
  },
  {
    slug: 'compose-fundamentals-part1',
    title: 'Compose Fundamentals Part 1: Your First Composable Function',
    description: 'Start your Jetpack Compose journey here. Learn what Composables are, how @Composable annotation works, and build your first UI component step by step.',
    publishedAt: '2025-12-15',
    updatedAt: '2025-12-15',
    author: 'Engineering Team',
    tags: ['Beginner', 'Fundamentals', 'Tutorial', 'Getting Started'],
    readingMinutes: 10,
    sections: [
      {
        heading: 'Welcome to Compose',
        paragraphs: [
          'If you are reading this, you have probably heard that Jetpack Compose is the future of Android UI development. You might feel overwhelmed by all the new concepts. Do not worry — this series will guide you from zero to confident Compose developer.',
          'By the end of this article, you will understand what Composables are and build your first real UI component. No prior Compose experience required, but basic Kotlin knowledge is assumed.',
        ],
      },
      {
        heading: 'What Is a Composable Function?',
        paragraphs: [
          'In Compose, UI is built using functions marked with @Composable. These are not regular functions — they can remember state, subscribe to data changes, and automatically update when that data changes.',
          'Think of a Composable as a recipe that describes what your UI should look like. When ingredients (state) change, Compose re-runs the recipe and updates only what changed.',
        ],
        code: `// Your first Composable!
@Composable
fun Greeting(name: String) {
    Text(text = "Hello, $name!")
}

// Using it in your app
@Composable
fun MyApp() {
    Greeting(name = "Android Developer")
}`,
      },
      {
        heading: 'The Three Golden Rules',
        paragraphs: [
          'Before we go further, memorize these three rules:',
        ],
        list: [
          'Composables can only be called from other Composables (or setContent{})',
          'Composables should be side-effect free — they just describe the UI',
          'Composables can be called many times (recomposition), so do not do expensive work inside them',
        ],
      },
      {
        heading: 'Building Your First Component',
        paragraphs: [
          'Let us build a simple user profile card. We will combine multiple Composables:',
        ],
        code: `@Composable
fun UserProfileCard(
    name: String,
    email: String,
    avatarUrl: String
) {
    // Card is a Material container with elevation
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        // Row arranges children horizontally
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Placeholder for avatar (we'll learn images later)
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .background(Color.Gray, CircleShape)
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            // Column arranges children vertically
            Column {
                Text(
                    text = name,
                    style = MaterialTheme.typography.titleMedium
                )
                Text(
                    text = email,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}`,
      },
      {
        heading: 'Preview Your Work',
        paragraphs: [
          'One of the best features of Compose is instant previews in Android Studio. Add @Preview to see your component without running the app:',
        ],
        code: `@Preview(showBackground = true)
@Composable
fun UserProfileCardPreview() {
    MyAppTheme {
        UserProfileCard(
            name = "Jane Developer",
            email = "jane@example.com",
            avatarUrl = ""
        )
    }
}`,
        note: 'Press the \"Split\" or \"Design\" button in Android Studio to see the preview. You can have multiple @Preview functions with different configurations!',
      },
      {
        heading: 'Next Steps',
        paragraphs: [
          'Congratulations! You have written your first Composable function. In Part 2, we will explore Modifiers — the powerful system for customizing layout, appearance, and behavior.',
        ],
      },
    ],
  },
  {
    slug: 'compose-fundamentals-part2',
    title: 'Compose Fundamentals Part 2: Mastering Modifiers',
    description: 'Learn how Modifiers work in Jetpack Compose. Understand modifier chaining, common modifiers for layout and styling, and avoid the most common ordering mistakes.',
    publishedAt: '2025-12-15',
    updatedAt: '2025-12-15',
    author: 'Engineering Team',
    tags: ['Beginner', 'Fundamentals', 'Modifier', 'Tutorial'],
    readingMinutes: 12,
    sections: [
      {
        heading: 'What Are Modifiers?',
        paragraphs: [
          'In XML, you set properties like width, height, margin, and background directly on Views. In Compose, all of this is done through Modifiers.',
          'Modifiers are the Swiss Army knife of Compose. They can: set size and position, add padding and margins, apply backgrounds and borders, handle clicks and gestures, and much more.',
        ],
      },
      {
        heading: 'Modifier Chaining',
        paragraphs: [
          'Modifiers are chained together using the dot notation. Each modifier wraps the previous one, like layers of an onion:',
        ],
        code: `@Composable
fun StyledBox() {
    Box(
        modifier = Modifier
            .size(200.dp)           // Size: 200x200dp
            .background(Color.Blue) // Fill with blue
            .padding(16.dp)         // Inner padding
            .background(Color.Red)  // Inner red box
    ) {
        Text("Hello!", color = Color.White)
    }
}`,
        note: 'The blue background covers the full 200dp, but the red background only covers the area inside the 16dp padding. Order matters!',
      },
      {
        heading: 'Essential Layout Modifiers',
        paragraphs: [
          'Here are the modifiers you will use in almost every Composable:',
        ],
        code: `Modifier
    // Size
    .size(100.dp)              // Fixed width and height
    .width(200.dp)             // Fixed width only
    .height(50.dp)             // Fixed height only
    .fillMaxWidth()            // Match parent width
    .fillMaxHeight()           // Match parent height
    .fillMaxSize()             // Match both
    .wrapContentSize()         // Wrap content
    
    // Spacing
    .padding(16.dp)            // Padding on all sides
    .padding(horizontal = 8.dp, vertical = 16.dp)
    .padding(start = 8.dp, top = 4.dp, end = 8.dp, bottom = 4.dp)
    
    // Alignment (in Box)
    .align(Alignment.Center)   // Center in parent Box`,
      },
      {
        heading: 'Styling Modifiers',
        paragraphs: [
          'Modifiers also handle visual styling:',
        ],
        code: `Modifier
    // Background
    .background(Color.Blue)
    .background(Color.Blue, RoundedCornerShape(8.dp))
    .background(brush = Brush.verticalGradient(listOf(Color.Blue, Color.Cyan)))
    
    // Border
    .border(2.dp, Color.Black)
    .border(2.dp, Color.Black, RoundedCornerShape(8.dp))
    
    // Shape clipping
    .clip(RoundedCornerShape(8.dp))
    .clip(CircleShape)
    
    // Shadow (must come before clip/background)
    .shadow(4.dp, RoundedCornerShape(8.dp))`,
      },
      {
        heading: 'Interaction Modifiers',
        paragraphs: [
          'Making things interactive is also done through modifiers:',
        ],
        code: `Modifier
    // Click handling
    .clickable { onClick() }
    .clickable(
        interactionSource = remember { MutableInteractionSource() },
        indication = rememberRipple()  // Ripple effect
    ) { onClick() }
    
    // Scroll
    .verticalScroll(rememberScrollState())
    .horizontalScroll(rememberScrollState())`,
      },
      {
        heading: 'The Order Rule',
        paragraphs: [
          'Modifier order is crucial. The rule is: \"Outer modifiers apply first, inner modifiers apply last.\" This catches many beginners:',
        ],
        code: `// ❌ WRONG: Padding is outside clickable, so edges don't respond to taps
Modifier
    .padding(16.dp)
    .clickable { }

// ✅ RIGHT: Clickable area includes the padding
Modifier
    .clickable { }
    .padding(16.dp)`,
        note: 'When debugging layout issues, try reordering your modifiers. The visual result can change dramatically.',
      },
    ],
  },
  {
    slug: 'compose-fundamentals-part3',
    title: 'Compose Fundamentals Part 3: State and Recomposition',
    description: 'Understand the heart of Compose: state management and recomposition. Learn remember, mutableStateOf, and how Compose efficiently updates your UI.',
    publishedAt: '2025-12-15',
    updatedAt: '2025-12-15',
    author: 'Engineering Team',
    tags: ['Beginner', 'Fundamentals', 'State', 'Recomposition'],
    readingMinutes: 14,
    sections: [
      {
        heading: 'The Heart of Compose: State',
        paragraphs: [
          'So far, our Composables have been static — they display data but cannot change. Real apps need interactive UIs: buttons that respond, counters that increment, forms that update. This requires state.',
          'State is any value that changes over time. In Compose, when state changes, the framework automatically updates the UI. This is called recomposition.',
        ],
      },
      {
        heading: 'Your First Stateful Component',
        paragraphs: [
          'Let us build a simple counter. We need two things: a variable to hold the count, and a way to tell Compose when it changes:',
        ],
        code: `@Composable
fun Counter() {
    // remember: Keep this value across recompositions
    // mutableStateOf: When this changes, trigger recomposition
    var count by remember { mutableStateOf(0) }
    
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = Modifier.padding(16.dp)
    ) {
        Text(
            text = "Count: $count",
            style = MaterialTheme.typography.headlineMedium
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Row {
            Button(onClick = { count-- }) {
                Text("-")
            }
            Spacer(modifier = Modifier.width(16.dp))
            Button(onClick = { count++ }) {
                Text("+")
            }
        }
    }
}`,
      },
      {
        heading: 'Breaking Down remember and mutableStateOf',
        paragraphs: [
          'These two functions are the foundation of Compose state:',
        ],
        list: [
          'mutableStateOf(value): Creates an observable state holder. When you change it, Compose knows to update the UI.',
          'remember { }: Saves a value across recompositions. Without it, your state would reset every time the function runs.',
          'Together, they create persistent, observable state that survives UI updates.',
        ],
      },
      {
        heading: 'What Is Recomposition?',
        paragraphs: [
          'Recomposition is Compose re-running your Composable functions when state changes. But here is the genius: Compose is smart about it.',
        ],
        code: `@Composable
fun ParentScreen() {
    var name by remember { mutableStateOf("") }
    
    Column {
        // This recomposes when name changes
        NameInput(
            name = name,
            onNameChange = { name = it }
        )
        
        // This does NOT recompose - it doesn't read "name"
        StaticHeader()
        
        // This recomposes when name changes
        Greeting(name = name)
    }
}`,
        note: 'Compose only re-runs Composables that read the changed state. Unrelated parts of your UI stay untouched. This is why Compose can be efficient even with complex UIs.',
      },
      {
        heading: 'Common State Patterns',
        paragraphs: [
          'Here are patterns you will use frequently:',
        ],
        code: `// Text input
var text by remember { mutableStateOf("") }
TextField(
    value = text,
    onValueChange = { text = it }
)

// Toggle/checkbox
var isChecked by remember { mutableStateOf(false) }
Checkbox(
    checked = isChecked,
    onCheckedChange = { isChecked = it }
)

// List of items
var items by remember { mutableStateOf(listOf("A", "B", "C")) }
items = items + "D"  // Add item
items = items.filter { it != "B" }  // Remove item`,
      },
      {
        heading: 'State vs Stateless Composables',
        paragraphs: [
          'As you gain experience, you will learn to separate stateful and stateless Composables. Stateless Composables are easier to test, preview, and reuse:',
        ],
        code: `// Stateless: receives state as parameter
@Composable
fun CounterDisplay(
    count: Int,
    onIncrement: () -> Unit,
    onDecrement: () -> Unit
) {
    // Just displays, doesn't own state
}

// Stateful: manages its own state
@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }
    CounterDisplay(
        count = count,
        onIncrement = { count++ },
        onDecrement = { count-- }
    )
}`,
        note: 'This pattern is called \"state hoisting.\" Push state up to the caller, making your Composables more reusable. We cover this in depth in our State Hoisting Patterns article.',
      },
    ],
  },
  {
    slug: 'compose-real-world-migrations',
    title: 'Real-World Compose Migrations: Lessons from Twitter, Airbnb, and Spotify',
    description: 'Deep dive into how major companies migrated to Jetpack Compose. Learn from their strategies, challenges, and measured outcomes with concrete data.',
    publishedAt: '2025-12-14',
    updatedAt: '2025-12-14',
    author: 'Engineering Team',
    tags: ['Case Study', 'Migration', 'Enterprise', 'Real World'],
    readingMinutes: 18,
    sections: [
      {
        heading: 'Why Study Real Migrations?',
        paragraphs: [
          'Blog tutorials show ideal scenarios. Reality is messier. Large codebases have legacy constraints, team dynamics, and business pressures. By studying how major companies migrated to Compose, you can learn lessons that apply to your own projects.',
          'This article compiles publicly shared data from Twitter (now X), Airbnb, Spotify, and others. All information comes from official tech blogs, conference talks, and published case studies.',
        ],
      },
      {
        heading: 'Twitter/X: Incremental Migration at Scale',
        paragraphs: [
          'Twitter\'s Android app has over 1 million lines of Kotlin code. A full rewrite was impossible. Instead, they adopted an incremental approach that took over two years.',
        ],
        list: [
          'Strategy: Started with new features only, then gradually migrated existing screens',
          'Key decision: Built a Design System in Compose first (Twitter UI Kit)',
          'Challenge: Existing custom Views with complex accessibility requirements',
          'Result: 50% of new feature code shipped in Compose by end of 2023',
        ],
        note: 'Twitter\'s key insight: "Don\'t migrate screens, migrate components." They focused on building a comprehensive component library first.',
      },
      {
        heading: 'Airbnb: Design System as Foundation',
        paragraphs: [
          'Airbnb\'s approach centered on their Lottie design system. Before touching product code, they rebuilt their entire design system in Compose. This took 6 months but paid dividends afterward.',
        ],
        code: `// Airbnb's component abstraction pattern
// All product code uses these, not raw Compose
@Composable
fun AirbnbCard(
    title: String,
    subtitle: String,
    imageUrl: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    // Internal implementation can change
    // without affecting product teams
}`,
      },
      {
        paragraphs: [
          'By abstracting Compose behind their design system, Airbnb achieved: consistent UI across 20+ product teams, easy updates when Compose APIs changed, reduced onboarding time for new developers (they learn Airbnb components, not raw Compose).',
        ],
      },
      {
        heading: 'Spotify: Performance-First Migration',
        paragraphs: [
          'Spotify\'s primary concern was performance. Music playback is sensitive to UI jank — any frame drops are immediately noticeable.',
        ],
        list: [
          'Benchmark requirement: New Compose screens must match or beat XML performance',
          'Tool: Custom Macrobenchmark suite run on every PR',
          'Discovery: Initial Compose code was 15% slower; after optimization, 10% faster',
          'Key optimization: Aggressive use of derivedStateOf and remember with stable keys',
        ],
      },
      {
        heading: 'Common Patterns Across Companies',
        paragraphs: [
          'Despite different approaches, successful migrations share common patterns:',
        ],
        list: [
          'Investment in tooling: All companies built custom lint rules, preview tools, and benchmarks',
          'Design system first: Abstract Compose behind company-specific components',
          'Gradual rollout: Use feature flags for A/B testing Compose vs View implementations',
          'Dedicated migration team: 2-5 engineers focused full-time on infrastructure',
          'Documentation culture: Internal wikis with patterns, anti-patterns, and migration guides',
        ],
      },
      {
        heading: 'Measured Outcomes',
        paragraphs: [
          'Here is aggregated data from public sources:',
        ],
        code: `// Industry-reported metrics (2024-2025)
{
  "code_reduction": "40-60% fewer lines for UI code",
  "development_velocity": "20-40% faster feature delivery",
  "crash_reduction": "30-50% fewer UI-related crashes",
  "build_time_impact": "5-15% increase in build times (Compose compiler)",
  "onboarding": "2-4 weeks for View developers to become productive"
}`,
        note: 'These are averages from multiple companies. Your results will vary based on codebase complexity, team experience, and migration scope.',
      },
      {
        heading: 'Lessons for Your Migration',
        paragraphs: [
          'Based on these case studies, here is actionable advice:',
        ],
        list: [
          'Start small: Pick a low-risk screen with clear success metrics',
          'Measure everything: Establish baseline performance before migrating',
          'Build infrastructure: Invest in preview tooling and lint rules early',
          'Train the team: Formal training reduces "Compose gotcha" bugs',
          'Communicate timeline: Set realistic expectations — major migrations take 12-24 months',
        ],
      },
    ],
  },
  {
    slug: 'viewmodel-compose-integration',
    title: 'ViewModel and Compose: The Perfect Architecture Partnership',
    description: 'Master the integration of ViewModel with Jetpack Compose. Learn StateFlow patterns, lifecycle handling, and architecture best practices for production apps.',
    publishedAt: '2025-12-15',
    updatedAt: '2025-12-15',
    author: 'Engineering Team',
    tags: ['ViewModel', 'Architecture', 'StateFlow', 'MVVM'],
    readingMinutes: 15,
    sections: [
      {
        heading: 'Why ViewModel Still Matters in Compose',
        paragraphs: [
          'Some developers new to Compose wonder if ViewModel is still necessary. The answer is absolutely yes. While Compose manages UI state excellently, ViewModel serves a different purpose: surviving configuration changes (like screen rotation), hosting business logic, and serving as the single source of truth for screen-level state.',
          'The combination of ViewModel + Compose creates a clean separation: ViewModel owns and manages state, Compose observes and renders it.',
        ],
      },
      {
        heading: 'StateFlow: The Bridge Between ViewModel and Compose',
        paragraphs: [
          'StateFlow is the recommended way to expose state from ViewModel to Compose. It is hot, always has a value, and integrates seamlessly with Compose:',
        ],
        code: `class ProfileViewModel : ViewModel() {
    // Private mutable state
    private val _uiState = MutableStateFlow(ProfileUiState())
    // Public immutable state exposed to UI
    val uiState: StateFlow<ProfileUiState> = _uiState.asStateFlow()
    
    fun updateName(name: String) {
        _uiState.update { current ->
            current.copy(name = name)
        }
    }
    
    fun loadProfile(userId: String) {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true) }
            try {
                val profile = repository.getProfile(userId)
                _uiState.update { 
                    it.copy(
                        name = profile.name,
                        email = profile.email,
                        isLoading = false
                    )
                }
            } catch (e: Exception) {
                _uiState.update { 
                    it.copy(error = e.message, isLoading = false) 
                }
            }
        }
    }
}

data class ProfileUiState(
    val name: String = "",
    val email: String = "",
    val isLoading: Boolean = false,
    val error: String? = null
)`,
      },
      {
        heading: 'Collecting State in Compose',
        paragraphs: [
          'Use collectAsStateWithLifecycle to safely collect StateFlow in Compose. It automatically stops collection when the lifecycle is below a certain state:',
        ],
        code: `@Composable
fun ProfileScreen(
    viewModel: ProfileViewModel = viewModel()
) {
    // Lifecycle-aware collection - stops when app goes to background
    val uiState by viewModel.uiState.collectAsStateWithLifecycle()
    
    ProfileContent(
        uiState = uiState,
        onNameChange = viewModel::updateName,
        onRetry = { viewModel.loadProfile(userId) }
    )
}

@Composable
fun ProfileContent(
    uiState: ProfileUiState,
    onNameChange: (String) -> Unit,
    onRetry: () -> Unit
) {
    when {
        uiState.isLoading -> LoadingScreen()
        uiState.error != null -> ErrorScreen(uiState.error, onRetry)
        else -> ProfileForm(uiState, onNameChange)
    }
}`,
        note: 'Always use collectAsStateWithLifecycle() instead of collectAsState(). The lifecycle-aware version prevents unnecessary work when your app is in the background.',
      },
      {
        heading: 'One-Time Events: The Event Pattern',
        paragraphs: [
          'Navigation, snackbars, and other one-time events need special handling. Use a Channel or SharedFlow:',
        ],
        code: `class CheckoutViewModel : ViewModel() {
    private val _events = Channel<CheckoutEvent>()
    val events = _events.receiveAsFlow()
    
    fun checkout() {
        viewModelScope.launch {
            try {
                val orderId = repository.placeOrder()
                _events.send(CheckoutEvent.NavigateToConfirmation(orderId))
            } catch (e: Exception) {
                _events.send(CheckoutEvent.ShowError(e.message ?: "Unknown error"))
            }
        }
    }
}

sealed class CheckoutEvent {
    data class NavigateToConfirmation(val orderId: String) : CheckoutEvent()
    data class ShowError(val message: String) : CheckoutEvent()
}

// In Compose
@Composable
fun CheckoutScreen(viewModel: CheckoutViewModel, navController: NavController) {
    val context = LocalContext.current
    
    LaunchedEffect(Unit) {
        viewModel.events.collect { event ->
            when (event) {
                is CheckoutEvent.NavigateToConfirmation -> {
                    navController.navigate("confirmation/\${event.orderId}")
                }
                is CheckoutEvent.ShowError -> {
                    Toast.makeText(context, event.message, Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
    // ... rest of UI
}`,
      },
      {
        heading: 'Testing ViewModel with Compose',
        paragraphs: [
          'ViewModels can be tested independently of Compose, making your architecture more testable:',
        ],
        code: `class ProfileViewModelTest {
    private lateinit var viewModel: ProfileViewModel
    private lateinit var fakeRepository: FakeProfileRepository
    
    @Before
    fun setup() {
        fakeRepository = FakeProfileRepository()
        viewModel = ProfileViewModel(fakeRepository)
    }
    
    @Test
    fun loadProfile_success_updatesState() = runTest {
        // Given
        fakeRepository.setProfile(Profile("John", "john@example.com"))
        
        // When
        viewModel.loadProfile("123")
        
        // Then
        val state = viewModel.uiState.value
        assertEquals("John", state.name)
        assertEquals("john@example.com", state.email)
        assertFalse(state.isLoading)
        assertNull(state.error)
    }
}`,
        note: 'Keep your Composables as dumb as possible - they should only render UI based on state. All logic belongs in ViewModel, where it can be easily tested.',
      },
    ],
  },
  {
    slug: 'hilt-compose-dependency-injection',
    title: 'Dependency Injection with Hilt and Compose: A Complete Guide',
    description: 'Learn how to integrate Hilt with Jetpack Compose for clean, testable architecture. From basic setup to advanced scoping and testing strategies.',
    publishedAt: '2025-12-14',
    updatedAt: '2025-12-14',
    author: 'Engineering Team',
    tags: ['Hilt', 'Dependency Injection', 'Architecture', 'Testing'],
    readingMinutes: 14,
    sections: [
      {
        heading: 'Why Hilt for Compose?',
        paragraphs: [
          'Dependency Injection (DI) is essential for maintainable, testable code. Hilt is Google\'s recommended DI framework for Android, and it integrates seamlessly with Compose.',
          'With Hilt, you can inject ViewModels, repositories, and other dependencies without manual factory creation. This reduces boilerplate and makes testing trivial.',
        ],
      },
      {
        heading: 'Basic Setup',
        paragraphs: [
          'First, add Hilt dependencies and set up your Application class:',
        ],
        code: `// build.gradle.kts
plugins {
    id("com.google.dagger.hilt.android")
    id("com.google.devtools.ksp")
}

dependencies {
    implementation("com.google.dagger:hilt-android:2.50")
    ksp("com.google.dagger:hilt-compiler:2.50")
    implementation("androidx.hilt:hilt-navigation-compose:1.2.0")
}

// Application class
@HiltAndroidApp
class MyApplication : Application()

// MainActivity
@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MyAppTheme {
                AppNavigation()
            }
        }
    }
}`,
      },
      {
        heading: 'Injecting ViewModels',
        paragraphs: [
          'Use @HiltViewModel and hiltViewModel() for clean ViewModel injection:',
        ],
        code: `@HiltViewModel
class ProductListViewModel @Inject constructor(
    private val productRepository: ProductRepository,
    private val analyticsTracker: AnalyticsTracker
) : ViewModel() {
    
    private val _products = MutableStateFlow<List<Product>>(emptyList())
    val products: StateFlow<List<Product>> = _products.asStateFlow()
    
    init {
        loadProducts()
    }
    
    private fun loadProducts() {
        viewModelScope.launch {
            _products.value = productRepository.getProducts()
            analyticsTracker.trackScreenView("product_list")
        }
    }
}

// In Compose - hiltViewModel() handles creation and scoping
@Composable
fun ProductListScreen(
    viewModel: ProductListViewModel = hiltViewModel(),
    onProductClick: (String) -> Unit
) {
    val products by viewModel.products.collectAsStateWithLifecycle()
    ProductList(products = products, onProductClick = onProductClick)
}`,
      },
      {
        heading: 'Providing Dependencies with Modules',
        paragraphs: [
          'Define Hilt modules to provide dependencies that cannot be constructor-injected:',
        ],
        code: `@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {
    
    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor())
            .connectTimeout(30, TimeUnit.SECONDS)
            .build()
    }
    
    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl("https://api.example.com/")
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }
    
    @Provides
    @Singleton
    fun provideProductApi(retrofit: Retrofit): ProductApi {
        return retrofit.create(ProductApi::class.java)
    }
}

@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {
    
    @Binds
    @Singleton
    abstract fun bindProductRepository(
        impl: ProductRepositoryImpl
    ): ProductRepository
}`,
      },
      {
        heading: 'Testing with Hilt',
        paragraphs: [
          'Hilt makes testing easy by allowing you to replace dependencies:',
        ],
        code: `@HiltAndroidTest
class ProductListScreenTest {
    
    @get:Rule(order = 0)
    val hiltRule = HiltAndroidRule(this)
    
    @get:Rule(order = 1)
    val composeRule = createAndroidComposeRule<MainActivity>()
    
    @BindValue
    val fakeRepository: ProductRepository = FakeProductRepository()
    
    @Before
    fun setup() {
        hiltRule.inject()
        (fakeRepository as FakeProductRepository).setProducts(
            listOf(Product("1", "Test Product", 9.99))
        )
    }
    
    @Test
    fun productList_displaysProducts() {
        composeRule.onNodeWithText("Test Product").assertIsDisplayed()
        composeRule.onNodeWithText("$9.99").assertIsDisplayed()
    }
}`,
        note: 'Use @BindValue to replace real dependencies with fakes in tests. This is cleaner than creating separate test modules.',
      },
    ],
  },
  {
    slug: 'compose-performance-profiling',
    title: 'Compose Performance Profiling: Tools and Techniques',
    description: 'Master Compose performance analysis with Layout Inspector, Composition Tracing, and Macrobenchmark. Find and fix performance bottlenecks like a pro.',
    publishedAt: '2025-12-13',
    updatedAt: '2025-12-13',
    author: 'Engineering Team',
    tags: ['Performance', 'Profiling', 'Optimization', 'Debugging'],
    readingMinutes: 16,
    sections: [
      {
        heading: 'Why Performance Profiling Matters',
        paragraphs: [
          'Compose is fast by default, but it is easy to introduce performance problems accidentally. Excessive recompositions, heavy computations during composition, and inefficient state reads can all cause jank.',
          'The good news: Android Studio provides excellent tooling for diagnosing Compose performance issues. Let\'s explore each tool and when to use it.',
        ],
      },
      {
        heading: 'Layout Inspector: Visualizing Recomposition',
        paragraphs: [
          'Layout Inspector is your first stop for Compose debugging. Enable recomposition highlighting to see which components update:',
        ],
        list: [
          'Open Layout Inspector: View > Tool Windows > Layout Inspector',
          'Enable "Show Recomposition Counts" in the toolbar',
          'Blue highlights show recomposition count; red shows skipped count',
          'Components recomposing excessively appear with high blue counts',
        ],
        note: 'A well-optimized Compose UI should show mostly "skipped" (red) counts. High blue counts indicate components that recompose too often.',
      },
      {
        heading: 'Composition Tracing with System Trace',
        paragraphs: [
          'For deeper analysis, enable Composition Tracing to see exactly what happens during each frame:',
        ],
        code: `// Add to build.gradle.kts
android {
    buildTypes {
        debug {
            // Enable composition tracing
            manifestPlaceholders["enableComposeCompilerReports"] = true
        }
    }
}

// In code, you can add custom trace sections
@Composable
fun ExpensiveList(items: List<Item>) {
    trace("ExpensiveList") {
        LazyColumn {
            items(items, key = { it.id }) { item ->
                trace("ItemRow-\${item.id}") {
                    ItemRow(item)
                }
            }
        }
    }
}`,
      },
      {
        heading: 'Macrobenchmark: Measuring Real Performance',
        paragraphs: [
          'For production-grade performance testing, use Macrobenchmark. It measures startup time, frame timing, and scrolling performance:',
        ],
        code: `@LargeTest
@RunWith(AndroidJUnit4::class)
class ScrollBenchmark {
    @get:Rule
    val benchmarkRule = MacrobenchmarkRule()

    @Test
    fun scrollProductList() {
        benchmarkRule.measureRepeated(
            packageName = "com.example.app",
            metrics = listOf(FrameTimingMetric()),
            iterations = 5,
            startupMode = StartupMode.COLD,
            setupBlock = {
                startActivityAndWait()
            }
        ) {
            // Scroll the product list
            val list = device.findObject(By.res("product_list"))
            list.setGestureMargin(device.displayWidth / 5)
            
            repeat(3) {
                list.fling(Direction.DOWN)
                device.waitForIdle()
            }
        }
    }
}`,
      },
      {
        heading: 'Common Performance Anti-Patterns',
        paragraphs: [
          'Here are the most frequent causes of Compose performance issues:',
        ],
        code: `// ❌ Anti-pattern 1: Creating objects during composition
@Composable
fun BadExample() {
    val items = listOf(1, 2, 3) // New list every recomposition!
    val onClick = { doSomething() } // New lambda every recomposition!
}

// ✅ Fix: Use remember
@Composable
fun GoodExample() {
    val items = remember { listOf(1, 2, 3) }
    val onClick = remember { { doSomething() } }
}

// ❌ Anti-pattern 2: Reading state too high
@Composable
fun BadScreen(viewModel: MyViewModel) {
    val scrollState = viewModel.scrollState.collectAsState() // Read at top
    Column {
        Header() // Recomposes even though it doesn't use scrollState
        Content(scrollState) // Only this needs scrollState
    }
}

// ✅ Fix: Read state where it's used (defer reads)
@Composable
fun GoodScreen(viewModel: MyViewModel) {
    Column {
        Header() // Won't recompose when scrollState changes
        Content(viewModel) // Read scrollState inside Content
    }
}`,
        note: 'Profile before optimizing. Premature optimization often makes code harder to read without meaningful performance gains.',
      },
    ],
  },
  {
    slug: 'compose-error-handling-patterns',
    title: 'Error Handling Patterns in Compose: From Try-Catch to Graceful UX',
    description: 'Build resilient Compose applications with proper error handling. Learn patterns for network errors, validation, loading states, and user-friendly error messages.',
    publishedAt: '2025-12-12',
    updatedAt: '2025-12-12',
    author: 'Engineering Team',
    tags: ['Error Handling', 'UX', 'Best Practices', 'Architecture'],
    readingMinutes: 13,
    sections: [
      {
        heading: 'Errors Are Inevitable',
        paragraphs: [
          'Network requests fail. Users enter invalid data. APIs return unexpected responses. A production-quality app handles all these gracefully, turning potential crashes into helpful user experiences.',
          'Compose makes error handling elegant when you model errors as state. Instead of try-catch scattered everywhere, errors become first-class citizens in your UI state.',
        ],
      },
      {
        heading: 'The Sealed Result Pattern',
        paragraphs: [
          'Model operation outcomes with a sealed class that captures success, loading, and error states:',
        ],
        code: `sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

// In ViewModel
class UserViewModel @Inject constructor(
    private val userRepository: UserRepository
) : ViewModel() {
    
    private val _userState = MutableStateFlow<Result<User>>(Result.Loading)
    val userState: StateFlow<Result<User>> = _userState.asStateFlow()
    
    fun loadUser(userId: String) {
        viewModelScope.launch {
            _userState.value = Result.Loading
            _userState.value = try {
                Result.Success(userRepository.getUser(userId))
            } catch (e: Exception) {
                Result.Error(e)
            }
        }
    }
}`,
      },
      {
        heading: 'Rendering Error States',
        paragraphs: [
          'Create reusable components for different result states:',
        ],
        code: `@Composable
fun <T> ResultHandler(
    result: Result<T>,
    onRetry: () -> Unit,
    content: @Composable (T) -> Unit
) {
    when (result) {
        is Result.Loading -> {
            Box(
                modifier = Modifier.fillMaxSize(),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        }
        is Result.Error -> {
            ErrorScreen(
                message = result.exception.toUserMessage(),
                onRetry = onRetry
            )
        }
        is Result.Success -> {
            content(result.data)
        }
    }
}

// Extension function for user-friendly messages
fun Throwable.toUserMessage(): String = when (this) {
    is java.net.UnknownHostException -> "No internet connection"
    is java.net.SocketTimeoutException -> "Request timed out"
    is HttpException -> when (code()) {
        401 -> "Please log in again"
        403 -> "Access denied"
        404 -> "Content not found"
        in 500..599 -> "Server error. Please try later."
        else -> "Something went wrong"
    }
    else -> "An unexpected error occurred"
}`,
      },
      {
        heading: 'Form Validation Errors',
        paragraphs: [
          'For form inputs, model validation errors alongside the data:',
        ],
        code: `data class FormField(
    val value: String = "",
    val error: String? = null
)

data class LoginFormState(
    val email: FormField = FormField(),
    val password: FormField = FormField(),
    val isSubmitting: Boolean = false
)

class LoginViewModel : ViewModel() {
    private val _formState = MutableStateFlow(LoginFormState())
    val formState: StateFlow<LoginFormState> = _formState.asStateFlow()
    
    fun updateEmail(email: String) {
        _formState.update { 
            it.copy(email = FormField(value = email, error = validateEmail(email)))
        }
    }
    
    private fun validateEmail(email: String): String? {
        return when {
            email.isBlank() -> "Email is required"
            !email.contains("@") -> "Invalid email format"
            else -> null
        }
    }
}

// In Compose
@Composable
fun EmailField(field: FormField, onValueChange: (String) -> Unit) {
    Column {
        OutlinedTextField(
            value = field.value,
            onValueChange = onValueChange,
            isError = field.error != null,
            label = { Text("Email") }
        )
        if (field.error != null) {
            Text(
                text = field.error,
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall,
                modifier = Modifier.padding(start = 16.dp, top = 4.dp)
            )
        }
    }
}`,
      },
      {
        heading: 'Snackbars for Transient Errors',
        paragraphs: [
          'Some errors are best shown briefly and dismissed automatically:',
        ],
        code: `@Composable
fun AppScaffold(viewModel: AppViewModel) {
    val snackbarHostState = remember { SnackbarHostState() }
    
    // Collect error events
    LaunchedEffect(Unit) {
        viewModel.errorEvents.collect { error ->
            val result = snackbarHostState.showSnackbar(
                message = error.message,
                actionLabel = if (error.isRetryable) "Retry" else null,
                duration = SnackbarDuration.Short
            )
            if (result == SnackbarResult.ActionPerformed) {
                error.onRetry?.invoke()
            }
        }
    }
    
    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        AppContent(Modifier.padding(padding))
    }
}`,
        note: 'Match error severity to UI treatment: blocking errors get full-screen treatment, recoverable errors get snackbars, field errors appear inline.',
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

