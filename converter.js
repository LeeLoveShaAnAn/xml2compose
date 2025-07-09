document.addEventListener('DOMContentLoaded', () => {
    const xmlInput = document.getElementById('xml-input');
    const composeOutput = document.getElementById('compose-output');
    const convertBtn = document.getElementById('convert-btn');
    const copyBtn = document.getElementById('copy-btn');
    const clearBtn = document.getElementById('clear-btn');
    const loadSampleBtn = document.getElementById('load-sample-btn');

    const sampleXml = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Hello, Jetpack Compose!"
        android:textSize="24sp" />

    <Button
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Click Me" />

</LinearLayout>`;

    const loadSample = () => {
        xmlInput.value = sampleXml;
        performConversion();
    };

    const clearInputs = () => {
        xmlInput.value = '';
        composeOutput.textContent = '';
        hljs.highlightElement(composeOutput);
    };

    const copyToClipboard = () => {
        const codeToCopy = composeOutput.textContent;
        navigator.clipboard.writeText(codeToCopy).then(() => {
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Code';
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            copyBtn.textContent = 'Error';
            setTimeout(() => {
                copyBtn.textContent = 'Copy Code';
            }, 2000);
        });
    };

    const convertXmlToCompose = (xmlString) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, "application/xml");
        const rootElement = xmlDoc.documentElement;
        if (xmlDoc.getElementsByTagName("parsererror").length) {
            return "Error: Invalid XML format. Please check your input.";
        }
        return formatCompose(parseNode(rootElement, 0));
    };

    const parseNode = (node, indentLevel) => {
        const tagName = node.tagName;
        const attributes = getAttributes(node);
        const children = Array.from(node.children);
        const composable = mapTagToComposable(tagName, attributes);
        let composeCode = `\n${indent(indentLevel)}${composable.name}(`;
        const modifiers = buildModifiers(attributes, indentLevel + 1);
        if (modifiers) {
            composeCode += `\n${indent(indentLevel + 1)}modifier = Modifier${modifiers},`;
        }
                Object.entries(composable.attributes).forEach(([key, value]) => {
            composeCode += `\n${indent(indentLevel + 1)}${key} = ${value},`;
        });
        if (children.length > 0 || (tagName === 'Button' && attributes['android:text'])) {
            composeCode += `\n${indent(indentLevel)}) {`;
            if (tagName === 'Button' && attributes['android:text']) {
                composeCode += `${indent(indentLevel + 1)}Text(text = "${attributes['android:text']}")`;
            }
            children.forEach(child => {
                composeCode += parseNode(child, indentLevel + 1);
            });
            composeCode += `\n${indent(indentLevel)}}`;
        } else {
            composeCode += `\n${indent(indentLevel)})`;
        }
        return composeCode;
    };

    const getAttributes = (node) => {
        const attrs = {};
        for (const attr of node.attributes) {
            attrs[attr.name] = attr.value;
        }
        return attrs;
    };

    const mapTagToComposable = (tag, attrs) => {
        const result = { name: tag, attributes: {} };
        switch (tag) {
            case 'LinearLayout':
                result.name = attrs['android:orientation'] === 'horizontal' ? 'Row' : 'Column';
                break;
            case 'TextView':
                result.name = 'Text';
                if (attrs['android:text']) {
                    result.attributes.text = `"${attrs['android:text']}"`;
                }
                if (attrs['android:textSize']) {
                    result.attributes.fontSize = `${parseInt(attrs['android:textSize'])}.sp`;
                }
                break;
            case 'Button':
                result.name = 'Button';
                break;
            case 'ImageView':
                result.name = 'Image';
                result.attributes.painter = `painterResource(id = R.drawable.placeholder)`;
                result.attributes.contentDescription = `"${attrs['android:contentDescription'] || 'Image'}"`;
                break;
            default:
                result.name = 'Box';
        }
        return result;
    };

    const buildModifiers = (attrs, indentLevel) => {
        let modifierString = '';
        const indentStr = indent(indentLevel);
        if (attrs['android:layout_width'] === 'match_parent') {
            modifierString += `\n${indentStr}.fillMaxWidth()`;
        } else if (attrs['android:layout_width'] === 'wrap_content') {
            modifierString += `\n${indentStr}.wrapContentWidth()`;
        } else if (attrs['android:layout_width']) {
            modifierString += `\n${indentStr}.width(${parseInt(attrs['android:layout_width'])}.dp)`;
        }
        if (attrs['android:layout_height'] === 'match_parent') {
            modifierString += `\n${indentStr}.fillMaxHeight()`;
        } else if (attrs['android:layout_height'] === 'wrap_content') {
            modifierString += `\n${indentStr}.wrapContentHeight()`;
        } else if (attrs['android:layout_height']) {
            modifierString += `\n${indentStr}.height(${parseInt(attrs['android:layout_height'])}.dp)`;
        }
        if (attrs['android:padding']) {
            modifierString += `\n${indentStr}.padding(${parseInt(attrs['android:padding'])}.dp)`;
        }
        return modifierString;
    };

    const formatCompose = (code) => {
        return code.replace(/,(\n\s*\})/g, '$1')
                    .replace(/\n\s*\n/g, '\n')
                    .trim();
    };

    const indent = (level) => '    '.repeat(level);

    const performConversion = () => {
        const xmlCode = xmlInput.value;
        if (!xmlCode.trim()) {
            composeOutput.textContent = '';
            hljs.highlightElement(composeOutput);
            return;
        }
        const composeCode = convertXmlToCompose(xmlCode);
        composeOutput.textContent = composeCode;
        hljs.highlightElement(composeOutput);
    };

    convertBtn.addEventListener('click', performConversion);
    copyBtn.addEventListener('click', copyToClipboard);
    clearBtn.addEventListener('click', clearInputs);
    loadSampleBtn.addEventListener('click', loadSample);

    // Load the sample and convert on initial page load
    loadSample();
});