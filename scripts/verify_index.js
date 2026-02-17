const fs = require('fs');
const path = 'src/generated/page-index.json';

try {
    // Wait to allow potential build pass to finish
    setTimeout(() => {
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path, 'utf8');
            const index = JSON.parse(data);

            const lithiumSlug = '/import-duty-vat-landed-cost/lithium-batteries/from/china/to/south-africa';
            const solarSlug = '/import-duty-vat-landed-cost/solar-panels/from/china/to/south-africa';

            const lithiumPage = index.pages.find(p => p.slug === lithiumSlug);
            const solarPage = index.pages.find(p => p.slug === solarSlug);

            console.log('\n--- Index Status Check (Vertical: Lithium Only) ---');

            if (lithiumPage) {
                console.log(`\nUser Target (Lithium): ${lithiumPage.slug}`);
                console.log(`Status: ${lithiumPage.indexStatus}`);
                if (lithiumPage.indexStatus === 'INDEX') console.log('✅ PASS: Lithium is INDEXED.');
                else console.log('❌ FAIL: Lithium is NOINDEX.');
            } else {
                console.log('❌ FAIL: Lithium page NOT FOUND.');
            }

            if (solarPage) {
                console.log(`\nInactive Vertical (Solar): ${solarPage.slug}`);
                console.log(`Status: ${solarPage.indexStatus}`);
                if (solarPage.indexStatus === 'NOINDEX') console.log('✅ PASS: Solar is NOINDEX.');
                else console.log('❌ FAIL: Solar is INDEXED.');
            } else {
                console.log('❓ NOTE: Solar page not found (maybe filtered out entirely?)');
            }

        } else {
            console.log('page-index.json not found.');
        }
    }, 2000);

} catch (err) {
    console.error('Error:', err);
}
