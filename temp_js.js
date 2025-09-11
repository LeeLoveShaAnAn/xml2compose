      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-F2G7TSB6Q6');
    </script>
    <script>
        // Sample XML and Compose code
        const sampleXML = `<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp"
    android:background="#FFFFFF">
    
    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome to Jetpack Compose!"
        android:textSize="24sp"
        android:textColor="#000000"
        android:layout_marginBottom="16dp" />
    
    <EditText
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:hint="Enter your name"
        android:layout_marginBottom="16dp" />
    
    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Click Me"
        android:background="#007AFF" />
        
</LinearLayout>`;

        const sampleCompose = `Column(
    modifier = Modifier
        .fillMaxSize()
        .padding(16.dp)
        .background(Color.White)
) {
    Text(
        text = "Welcome to Jetpack Compose!",
        fontSize = 24.sp,
        color = Color.Black,
        modifier = Modifier.padding(bottom = 16.dp)
    )
    
    OutlinedTextField(
        value = "",
        onValueChange = { },
        placeholder = { Text("Enter your name") },
        modifier = Modifier
            .fillMaxWidth()
            .padding(bottom = 16.dp)
    )
    
    Button(
        onClick = { },
        colors = ButtonDefaults.buttonColors(
            backgroundColor = Color(0xFF007AFF)
        ),
        modifier = Modifier.fillMaxWidth()
    ) {
        Text("Click Me")
    }
}`;

        // DOM elements
        const xmlInput = document.getElementById('xml-input');
        const composeOutput = document.getElementById('compose-output');
        const emptyState = document.getElementById('empty-state');
        const convertBtn = document.getElementById('convert-btn');
        const copyBtn = document.getElementById('copy-btn');
        const loadSampleBtn = document.getElementById('load-sample-btn');
        const clearInputBtn = document.getElementById('clear-input-btn');
        const downloadBtn = document.getElementById('download-btn');
        const copyNotification = document.getElementById('copy-notification');
        const inputStatus = document.getElementById('input-status');
        const inputStatusText = document.getElementById('input-status-text');
        const outputStatus = document.getElementById('output-status');
        const outputStatusText = document.getElementById('output-status-text');
        const inputLines = document.getElementById('input-lines');
        const outputLines = document.getElementById('output-lines');

        // Update status indicators
        function updateInputStatus() {
            const lines = xmlInput.value.split('\n').length;
            inputLines.textContent = `${lines} lines`;
            
            if (xmlInput.value.trim()) {
                inputStatus.className = 'status-dot success';
                inputStatusText.textContent = 'XML ready';
            } else {
                inputStatus.className = 'status-dot';
                inputStatusText.textContent = 'Ready for input';
            }
        }

        function updateOutputStatus(hasContent) {
            if (hasContent) {
                const lines = composeOutput.textContent.split('\n').length;
                outputLines.textContent = `${lines} lines`;
                outputStatus.className = 'status-dot success';
                outputStatusText.textContent = 'Conversion complete';
            } else {
                outputLines.textContent = '0 lines';
                outputStatus.className = 'status-dot';
                outputStatusText.textContent = 'Waiting for conversion';
            }
        }

        // Show copy notification
        function showCopyNotification() {
            copyNotification.classList.add('show');
            setTimeout(() => {
                copyNotification.classList.remove('show');
            }, 3000);
        }

        // Convert XML to Compose
        function convertXMLToCompose() {
            const xmlContent = xmlInput.value.trim();
            if (!xmlContent) {
                alert('Please enter some XML code first!');
                return;
            }

            // Simple conversion logic (in real app, this would be more sophisticated)
            // Enhanced XML to Compose conversion\n            const result = parseXMLToComposeEnhanced(xmlContent);\n            const composeCode = result.code || result;\n            composeOutput.textContent = composeCode;
            emptyState.style.display = 'none';
            composeOutput.style.display = 'block';
            
            // Highlight code
            hljs.highlightElement(composeOutput);
            
            updateOutputStatus(true);
        }

        // Copy code to clipboard
        async function copyToClipboard() {
            const code = composeOutput.textContent;
            if (!code.trim()) {
                alert('No code to copy!');
                return;
            }

            try {
                await navigator.clipboard.writeText(code);
                showCopyNotification();
            } catch (err) {
                console.error('Failed to copy code:', err);
                alert('Failed to copy code to clipboard');
            }
        }

        // Load sample XML
        function loadSample() {
            xmlInput.value = sampleXML;
            updateInputStatus();
        }

        // Clear input
        function clearInput() {
            xmlInput.value = '';
            composeOutput.textContent = '';
            emptyState.style.display = 'flex';
            composeOutput.style.display = 'none';
            updateInputStatus();
            updateOutputStatus(false);
        }

        // Download code
        function downloadCode() {
            const code = composeOutput.textContent;
            if (!code.trim()) {
                alert('No code to download!');
                return;
            }

            const blob = new Blob([code], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'compose_code.kt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        // Enhanced XML to Compose conversion\n        function parseXMLToComposeEnhanced(xmlString) {\n            console.log('开始增强解析:', xmlString.substring(0, 100) + '...');\n            \n            const result = {\n                code: '',\n                imports: new Set(),\n                warnings: []\n            };\n            \n            try {\n                const parser = new DOMParser();\n                const xmlDoc = parser.parseFromString(xmlString, 'text/xml');\n                \n                if (xmlDoc.getElementsByTagName('parsererror').length > 0) {\n                    throw new Error('XML格式错误');\n                }\n\n                const rootElement = xmlDoc.documentElement;\n                if (!rootElement) {\n                    throw new Error('未找到根元素');\n                }\n                \n                result.code = convertElementToComposeEnhanced(rootElement, result);\n                addEssentialImports(result.imports, result.code);\n                \n                return result;\n                \n            } catch (parseError) {\n                console.log('DOMParser失败，尝试备用解析...', parseError.message);\n                result.warnings.push(`解析警告: ${parseError.message}`);\n                result.code = generateFallbackCompose(xmlString);\n                return result;\n            }\n        }\n        \n        function convertElementToComposeEnhanced(element, result) {\n            if (!element) return '';\n            \n            let tagName = element.tagName;\n            const children = Array.from(element.children);\n            \n            if (tagName.includes('.')) {\n                const parts = tagName.split('.');\n                tagName = parts[parts.length - 1];\n                result.warnings.push(`检测到命名空间标签: ${element.tagName} -> ${tagName}`);\n            }\n            \n            switch (tagName) {\n                case 'LinearLayout':\n                    return convertLinearLayoutEnhanced(element, children, result);\n                case 'ConstraintLayout':\n                    return convertConstraintLayoutEnhanced(element, children, result);\n                case 'TextView':\n                    return convertTextViewEnhanced(element, result);\n                case 'EditText':\n                    return convertEditTextEnhanced(element, result);\n                case 'Button':\n                    return convertButtonEnhanced(element, result);\n                case 'ImageView':\n                    return convertImageViewEnhanced(element, result);\n                case 'RecyclerView':\n                    return convertRecyclerViewEnhanced(element, result);\n                case 'CardView':\n                    return convertCardViewEnhanced(element, children, result);\n                case 'CoordinatorLayout':\n                case 'NestedScrollView':\n                case 'ScrollView':\n                    return convertScrollViewEnhanced(element, children, result);\n                default:\n                    result.warnings.push(`未识别的组件类型: ${tagName}`);\n                    return `// ${element.tagName} - 未识别的组件\\nText(\"${element.tagName} Content\")`;\n            }\n        }\n        \n        function convertLinearLayoutEnhanced(element, children, result) {\n            const orientation = element.getAttribute('android:orientation') || 'vertical';\n            const composable = orientation === 'horizontal' ? 'Row' : 'Column';\n            \n            let code = `${composable}(\\n    modifier = Modifier.fillMaxSize()`;\n            \n            const padding = element.getAttribute('android:padding');\n            if (padding && padding !== '0dp') {\n                code += `\\n        .padding(${convertDpToCompose(padding)})`;\n                result.imports.add('androidx.compose.ui.unit.dp');\n            }\n            \n            const background = element.getAttribute('android:background');\n            if (background && background.startsWith('#')) {\n                const hexColor = background.length === 7 ? background.substring(1) : background.substring(1).repeat(2);\n                code += `\\n        .background(Color(0xFF${hexColor}))`;\n                result.imports.add('androidx.compose.ui.graphics.Color');\n            }\n            \n            code += '\\n) {\\n';\n            \n            children.forEach(child => {\n                const childCode = convertElementToComposeEnhanced(child, result);\n                if (childCode) {\n                    code += indentCode(childCode, 1) + '\\n\\n';\n                }\n            });\n            \n            code += '}';\n            return code;\n        }\n        \n        function convertConstraintLayoutEnhanced(element, children, result) {\n            let code = `Box(\\n    modifier = Modifier.fillMaxSize()`;\n            \n            const background = element.getAttribute('android:background');\n            if (background && background.startsWith('#')) {\n                const hexColor = background.length === 7 ? background.substring(1) : background.substring(1).repeat(2);\n                code += `\\n        .background(Color(0xFF${hexColor}))`;\n                result.imports.add('androidx.compose.ui.graphics.Color');\n            }\n            \n            code += '\\n) {\\n';\n            \n            children.forEach(child => {\n                const childCode = convertElementToComposeEnhanced(child, result);\n                if (childCode) {\n                    code += indentCode(childCode, 1) + '\\n\\n';\n                }\n            });\n            \n            code += '}';\n            return code;\n        }\n        \n        function convertTextViewEnhanced(element, result) {\n            const text = element.getAttribute('android:text') || '';\n            const textSize = element.getAttribute('android:textSize') || '16sp';\n            const textColor = element.getAttribute('android:textColor');\n            \n            let code = `Text(\\n    text = \"${text}\"`;\n            \n            if (textSize !== '16sp') {\n                code += `,\\n    fontSize = ${convertSpToCompose(textSize)}`;\n                result.imports.add('androidx.compose.ui.unit.sp');\n            }\n            \n            if (textColor && textColor.startsWith('#')) {\n                const hexColor = textColor.length === 7 ? textColor.substring(1) : textColor.substring(1).repeat(2);\n                code += `,\\n    color = Color(0xFF${hexColor})`;\n                result.imports.add('androidx.compose.ui.graphics.Color');\n            }\n            \n            code += '\\n)';\n            return code;\n        }\n        \n        function convertEditTextEnhanced(element, result) {\n            const hint = element.getAttribute('android:hint') || '';\n            let code = `OutlinedTextField(\\n    value = \"\",\\n    onValueChange = { }`;\n            if (hint) {\n                code += `,\\n    placeholder = { Text(\"${hint}\") }`;\n            }\n            code += '\\n)';\n            return code;\n        }\n        \n        function convertButtonEnhanced(element, result) {\n            const text = element.getAttribute('android:text') || '';\n            return `Button(onClick = { }) {\\n    Text(\"${text}\")\\n}`;\n        }\n        \n        function convertImageViewEnhanced(element, result) {\n            const src = element.getAttribute('android:src') || 'R.drawable.placeholder';\n            result.imports.add('androidx.compose.foundation.Image');\n            result.imports.add('androidx.compose.ui.res.painterResource');\n            return `Image(\\n    painter = painterResource(id = ${src}),\\n    contentDescription = null\\n)`;\n        }\n        \n        function convertRecyclerViewEnhanced(element, result) {\n            result.imports.add('androidx.compose.foundation.lazy.*');\n            return `LazyColumn {\\n    items(10) { index ->\\n        Text(\"Item \\${index + 1}\")\\n    }\\n}`;\n        }\n        \n        function convertCardViewEnhanced(element, children, result) {\n            result.imports.add('androidx.compose.material3.Card');\n            let code = `Card {\\n`;\n            children.forEach(child => {\n                const childCode = convertElementToComposeEnhanced(child, result);\n                if (childCode) {\n                    code += indentCode(childCode, 1) + '\\n';\n                }\n            });\n            code += '}';\n            return code;\n        }\n        \n        function convertScrollViewEnhanced(element, children, result) {\n            let code = `LazyColumn {\\n`;\n            children.forEach(child => {\n                const childCode = convertElementToComposeEnhanced(child, result);\n                if (childCode) {\n                    code += `    item {\\n${indentCode(childCode, 2)}\\n    }\\n`;\n                }\n            });\n            code += '}';\n            result.imports.add('androidx.compose.foundation.lazy.*');\n            return code;\n        }\n        \n        function generateFallbackCompose(xmlString) {\n            if (xmlString.includes('LinearLayout')) {\n                return `Column(\\n    modifier = Modifier.fillMaxSize()\\n) {\\n    Text(\"由于XML复杂性，仅显示基本结构\")\\n    Text(\"请手动优化代码\")\\n}`;\n            } else if (xmlString.includes('ConstraintLayout')) {\n                return `Box(\\n    modifier = Modifier.fillMaxSize()\\n) {\\n    Text(\"由于XML复杂性，仅显示基本结构\")\\n}`;\n            } else {\n                return `Column {\\n    Text(\"无法解析的XML结构\")\\n    Text(\"请检查XML格式是否正确\")\\n}`;\n            }\n        }\n        \n        function addEssentialImports(imports, code) {\n            imports.add('androidx.compose.foundation.layout.*');\n            imports.add('androidx.compose.material3.*');\n            imports.add('androidx.compose.runtime.*');\n            imports.add('androidx.compose.ui.Modifier');\n            \n            if (code.includes('LazyColumn') || code.includes('LazyRow')) {\n                imports.add('androidx.compose.foundation.lazy.*');\n            }\n        }\n        \n        function displayConversionResult(composeCode, imports) {\n            let fullCode = '';\n            \n            if (imports && imports.size > 0) {\n                fullCode += '// 导入语句\\n';\n                Array.from(imports).sort().forEach(imp => {\n                    fullCode += `import ${imp}\\n`;\n                });\n                fullCode += '\\n@Composable\\nfun MyComposable() {\\n';\n                fullCode += indentCode(composeCode, 1);\n                fullCode += '\\n}';\n            } else {\n                fullCode = composeCode;\n            }\n            \n            composeOutput.textContent = fullCode;\n        }\n        \n        function indentCode(code, levels) {\n            const indent = '    '.repeat(levels);\n            return code.split('\\n').map(line => line ? indent + line : line).join('\\n');\n        }\n        \n        function showNotification(message, type = 'info') {\n            const notification = document.createElement('div');\n            notification.style.cssText = `\n                position: fixed;\n                top: 20px;\n                right: 20px;\n                padding: 16px;\n                background: ${type === 'error' ? '#ffebee' : type === 'warning' ? '#fff3e0' : '#e0f2fe'};\n                color: ${type === 'error' ? '#c62828' : type === 'warning' ? '#ef6c00' : '#01579b'};\n                border-radius: 8px;\n                box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n                z-index: 1000;\n                max-width: 400px;\n                white-space: pre-line;\n            `;\n            notification.innerHTML = `${message} <button onclick=\"this.parentElement.remove()\" style=\"float: right; background: none; border: none; cursor: pointer;\">&times;</button>`;\n            \n            document.body.appendChild(notification);\n            \n            setTimeout(() => {\n                if (notification.parentElement) {\n                    notification.remove();\n                }\n            }, 5000);\n        }\n        \n        // Language switcher
        function switchLang(lang) {
            const buttons = document.querySelectorAll('.lang-switch button');
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // In a real app, this would switch the language
            console.log('Language switched to:', lang);
        }

        // Event listeners
        convertBtn.addEventListener('click', convertXMLToCompose);
        copyBtn.addEventListener('click', copyToClipboard);
        loadSampleBtn.addEventListener('click', loadSample);
        clearInputBtn.addEventListener('click', clearInput);
        downloadBtn.addEventListener('click', downloadCode);
        xmlInput.addEventListener('input', updateInputStatus);

        // Initialize
        updateInputStatus();
        updateOutputStatus(false);
