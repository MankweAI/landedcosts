
const fs = require('fs');

try {
    const html = fs.readFileSync('temp_source_node.html', 'utf8');

    const checks = [
        { key: 'Schema Tag', term: 'application/ld+json' },
        { key: 'Product Field (Voltage)', term: 'System Voltage' },
        { key: 'Meta Description', term: 'including System Voltage' }
    ];

    checks.forEach(check => {
        if (html.includes(check.term)) {
            console.log(`✅ ${check.key}: FOUND`);
        } else {
            console.log(`❌ ${check.key}: NOT FOUND`);
        }
    });

} catch (e) {
    console.error("Error reading file:", e.message);
}
