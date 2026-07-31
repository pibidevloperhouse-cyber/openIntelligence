const fs = require('fs');
const file = 'e:/final1/admin/openIntelligence/app/admin/page.js';
let c = fs.readFileSync(file, 'utf8');

// Replace import if it doesn't already have admin.css
if (!c.includes("import './admin.css';")) {
    c = c.replace("import StatusBadge from '@/components/StatusBadge';", "import StatusBadge from '@/components/StatusBadge';\nimport './admin.css';");
}

// Remove the <style> block
c = c.replace(/^[ \t]*<style>\{`[\s\S]*?`\}<\/style>[ \t]*\r?\n?/m, '');

fs.writeFileSync(file, c);
