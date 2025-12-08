/**
 * 属性验证和建议模块
 * 负责验证XML属性的兼容性并提供最佳实践建议
 */

/**
 * 验证组件属性
 * @param {string} tagName - 标签名
 * @param {Object} attributes - 属性对象
 * @returns {Object} 包含警告和建议的对象
 */
export const validateAttributes = (tagName, attributes) => {
    const warnings = [];
    const suggestions = [];

    // 检查不支持的属性
    const unsupportedAttrs = {
        'android:layout_alignParentTop': 'Use Box with Alignment.TopStart',
        'android:layout_alignParentBottom': 'Use Box with Alignment.BottomStart',
        'android:layout_centerInParent': 'Use Box with Alignment.Center',
        'android:layout_toRightOf': 'Use ConstraintLayout or Row arrangement',
        'android:layout_below': 'Use ConstraintLayout or Column arrangement',
        'android:drawableLeft': 'Use Row with Icon and Text',
        'android:drawableRight': 'Use Row with Text and Icon',
        'android:drawableTop': 'Use Column with Icon and Text',
        'android:drawableBottom': 'Use Column with Text and Icon',
        'android:layout_behavior': 'Use Scaffold with appropriate parameters',
        'android:fitsSystemWindows': 'Use WindowInsets in Compose',
        'app:layout_collapseMode': 'Use LargeTopAppBar with scrollBehavior',
        'app:layout_scrollFlags': 'Use TopAppBarScrollBehavior'
    };

    Object.keys(attributes).forEach(attr => {
        if (unsupportedAttrs[attr]) {
            warnings.push({
                type: 'unsupported',
                message: `属性 ${attr} 不直接支持`,
                suggestion: unsupportedAttrs[attr]
            });
        }
    });

    // 最佳实践检查
    if (tagName === 'ScrollView' && attributes['android:orientation'] === 'vertical') {
        suggestions.push({
            type: 'best_practice',
            message: '建议使用 LazyColumn 替代 ScrollView + LinearLayout 以获得更好的性能'
        });
    }

    if (tagName === 'LinearLayout' && attributes['android:layout_weight']) {
        suggestions.push({
            type: 'best_practice',
            message: 'layout_weight 在 Compose 中使用 Modifier.weight() 实现'
        });
    }

    // RecyclerView 最佳实践
    if (tagName === 'RecyclerView' || tagName === 'androidx.recyclerview.widget.RecyclerView') {
        suggestions.push({
            type: 'best_practice',
            message: 'RecyclerView 已转换为 LazyColumn/LazyRow，请使用 items() 或 itemsIndexed() 添加列表项'
        });
        if (attributes['app:layoutManager']?.includes('GridLayoutManager')) {
            suggestions.push({
                type: 'best_practice',
                message: '使用 LazyVerticalGrid 时，考虑使用 GridCells.Adaptive() 实现自适应列数'
            });
        }
    }

    // CoordinatorLayout 建议
    if (tagName === 'CoordinatorLayout' || tagName === 'androidx.coordinatorlayout.widget.CoordinatorLayout') {
        suggestions.push({
            type: 'best_practice',
            message: 'Scaffold 是 CoordinatorLayout 的 Compose 替代品，将 AppBarLayout 移至 topBar 参数，FAB 移至 floatingActionButton 参数'
        });
    }

    // DrawerLayout 建议
    if (tagName === 'DrawerLayout' || tagName === 'androidx.drawerlayout.widget.DrawerLayout') {
        suggestions.push({
            type: 'best_practice',
            message: '使用 ModalNavigationDrawer 时，将 NavigationView 内容移至 drawerContent 参数'
        });
    }

    // ViewPager 建议
    if (tagName.includes('ViewPager')) {
        suggestions.push({
            type: 'best_practice',
            message: 'HorizontalPager 需要配合 rememberPagerState 使用，可与 TabRow 联动实现 Tab+ViewPager 效果'
        });
    }

    // Data Binding 检查
    Object.values(attributes).forEach(value => {
        if (typeof value === 'string' && value.startsWith('@{')) {
            suggestions.push({
                type: 'migration',
                message: '检测到 Data Binding 表达式，在 Compose 中请使用 State 和 ViewModel 实现数据绑定'
            });
        }
    });

    // 版本兼容性检查
    const material3Components = ['TextField', 'Button', 'Checkbox', 'Switch',
        'TopAppBar', 'NavigationBar', 'FloatingActionButton', 'Card', 'FilterChip'];
    if (material3Components.includes(tagName)) {
        suggestions.push({
            type: 'version',
            message: `${tagName} 使用 Material3 组件，确保项目使用 Compose BOM 2023.03.00 或更高版本`
        });
    }

    // Pager 版本检查
    if (tagName.includes('ViewPager')) {
        suggestions.push({
            type: 'version',
            message: 'HorizontalPager 需要 accompanist-pager 或 Compose 1.4.0+ 的 foundation-pager'
        });
    }

    return { warnings, suggestions };
};

/**
 * 生成性能优化建议
 * @param {Element} rootElement - 根元素
 * @returns {Array} 性能建议数组
 */
export const generatePerformanceTips = (rootElement) => {
    const tips = [];

    // 检查深度嵌套
    const checkNestingDepth = (node, depth = 0) => {
        if (depth > 5) {
            tips.push('检测到深度嵌套布局，考虑使用 ConstraintLayout 减少嵌套层级');
            return;
        }
        Array.from(node.children).forEach(child => {
            checkNestingDepth(child, depth + 1);
        });
    };

    checkNestingDepth(rootElement);

    // 检查大量子元素
    const checkLargeList = (node) => {
        if (node.children.length > 10 && node.tagName === 'LinearLayout') {
            tips.push('检测到大量子元素，建议使用 LazyColumn/LazyRow 提升性能');
        }
        Array.from(node.children).forEach(child => checkLargeList(child));
    };

    checkLargeList(rootElement);

    return tips;
};

