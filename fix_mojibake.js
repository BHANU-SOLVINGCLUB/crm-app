const fs = require('fs');
const path = require('path');

const replacements = {
    'â€”': '—',
    'Â·': '·',
    'âŒ¨': '⌨',
    'ðŸ’¾': '💾',
    'ðŸ–±': '🖱',
    'ðŸŽ‰': '🎉',
    'ðŸ˜”': '😔',
    'âœ“': '✓',
    'â„¹': 'ℹ',
    'â‚¹': '₹',
    'â”€': '─',
    'â€¦': '…',
    'ðŸ“£': '📢',
    'ðŸŽ¯': '🎯',
    'ðŸ§ ': '🧠',
    'ðŸ’¼': '💼',
    'ðŸ“„': '📄',
    'ðŸ¤ ': '🤝',
    'ðŸ’³': '💳',
    'âš™ï¸ ': '⚙️',
    'ðŸŽ§': '🎧',
    'â­ ': '⭐',
    'ðŸ”§': '🔧',
    'ðŸ“ˆ': '📈',
    'â— ': '●',
    'â†’': '→'
};

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.ts') || file.endsWith('.tsx')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(path.join(__dirname, 'src'));

let fixedCount = 0;
for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    for (const [key, value] of Object.entries(replacements)) {
        if (content.includes(key)) {
            content = content.split(key).join(value);
            modified = true;
        }
    }
    if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Fixed mojibake in', file);
        fixedCount++;
    }
}

console.log('Fixed', fixedCount, 'files.');
