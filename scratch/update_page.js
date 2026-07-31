const fs = require('fs');
let c = fs.readFileSync('e:/final1/admin/openIntelligence/app/admin/page.js', 'utf8');
c = c.replace("import StatusBadge from '@/components/StatusBadge';", "import StatusBadge from '@/components/StatusBadge';\nimport './admin.css';");
c = c.replace(/<style>\{`[\s\S]*?`\}<\/style>\n/, '');
fs.writeFileSync('e:/final1/admin/openIntelligence/app/admin/page.js', c);
