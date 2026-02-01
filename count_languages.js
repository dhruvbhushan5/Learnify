const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const stats = {};

function walk(dir) {
    let list;
    try {
        list = fs.readdirSync(dir);
    } catch (e) {
        return; // permission denied or other error
    }

    list.forEach(file => {
        // Ignore hidden files and specific folders at any level
        if (file.startsWith('.') || file === 'node_modules' || file === 'package-lock.json' || file === 'users.json') return;

        const filePath = path.join(dir, file);
        let stat;
        try {
            stat = fs.statSync(filePath);
        } catch (e) {
            return;
        }

        if (stat.isDirectory()) {
            walk(filePath);
        } else {
            const ext = path.extname(file).toLowerCase() || 'no_extension';
            if (!stats[ext]) stats[ext] = 0;
            stats[ext] += stat.size;
        }
    });
}

console.log('Starting scan...');
walk(rootDir);
console.log('Scan complete.');

const totalBytes = Object.values(stats).reduce((a, b) => a + b, 0);

// Define what we consider "code"
const codeExtensions = ['.js', '.ejs', '.html', '.css', '.json'];
let codeBytes = 0;
codeExtensions.forEach(ext => {
    if (stats[ext]) codeBytes += stats[ext];
});

console.log('--- raw stats ---');
console.log(JSON.stringify(stats));

console.log('\n--- Code Percentage (of total file size) ---');
Object.keys(stats).forEach(ext => {
    const size = stats[ext];
    const percentage = ((size / totalBytes) * 100).toFixed(2);
    console.log(`${ext}: ${size} bytes (${percentage}%)`);
});

console.log('\n--- Javascript (JS) Percentage ---');
const jsBytes = stats['.js'] || 0;
const jsTotalPct = ((jsBytes / totalBytes) * 100).toFixed(2);
const jsCodePct = ((jsBytes / codeBytes) * 100).toFixed(2);

console.log(`Javascript is ${jsTotalPct}% of all files.`);
if (codeBytes > 0) {
    console.log(`Javascript is ${jsCodePct}% of code files (JS, EJS, HTML, CSS, JSON).`);
}
