import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localesDir = path.join(__dirname, '..', 'src', 'messages');

const baseLocale = 'en';

function flatten(obj, prefix = '') {
    return Object.entries(obj).reduce((acc, [key, value]) => {
        const newKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
            Object.assign(acc, flatten(value, newKey));
        } else {
            acc[newKey] = value;
        }
        return acc;
    }, {});
}

const baseLocalePath = path.join(localesDir, `${baseLocale}.json`);
if (!fs.existsSync(baseLocalePath)) {
    console.error(`❌ Base locale file "${baseLocale}.json" not found in ${localesDir}`);
    process.exit(1);
}

const baseContent = JSON.parse(fs.readFileSync(baseLocalePath, 'utf-8'));
const baseKeys = Object.keys(flatten(baseContent));

fs.readdirSync(localesDir).forEach(file => {
    const locale = path.basename(file, '.json');

    if (locale === baseLocale || !file.endsWith('.json')) return;

    const filePath = path.join(localesDir, file);
    const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const keys = Object.keys(flatten(content));

    const missing = baseKeys.filter(key => !keys.includes(key));

    if (missing.length > 0) {
        console.warn(`⚠️  ${locale}.json is missing ${missing.length} key(s):`);
        missing.forEach(key => {
            console.warn(`   - ${key}`);
        });
        console.log();
    } else {
        console.log(`✅ ${locale}.json is complete.`);
    }
});
