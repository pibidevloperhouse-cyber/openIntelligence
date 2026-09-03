const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
require('dotenv').config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const CATEGORIES = [
  { slug: 'dataset',         name: 'Public Dataset',              icon: '🗄️', description: 'Open source datasets for training and testing' },
  { slug: 'open-repository', name: 'Open GitHub Project',         icon: '📦', description: 'Open source GitHub repositories and codebases' },
  { slug: 'prompt-library',  name: 'Prompt Library',              icon: '💬', description: 'Curated prompts for language models' },
  { slug: 'mcp-server',      name: 'MCP Server',                  icon: '🔌', description: 'Model Context Protocol servers' },
  { slug: 'rag-template',    name: 'RAG Template',                icon: '🕸️', description: 'Retrieval-Augmented Generation workflows' },
  { slug: 'ai-workflow',     name: 'AI Workflow & Automation',    icon: '⚙️', description: 'Automated AI pipelines and agents' },
  { slug: 'documentation',   name: 'Documentation & Tutorial',    icon: '📖', description: 'Guides, tutorials, and deep dives' },
];

async function seedCategories() {
  console.log('Seeding categories...');
  
  for (const cat of CATEGORIES) {
    const { data: existing } = await supabaseAdmin.from('categories').select('id').eq('slug', cat.slug).single();
    
    if (!existing) {
      console.log(`Inserting category: ${cat.name}`);
      const { error } = await supabaseAdmin.from('categories').insert({
        id: crypto.randomUUID(),
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        description: cat.description
      });
      if (error) {
        console.error(`Failed to insert ${cat.name}:`, error);
      }
    } else {
      console.log(`Category ${cat.name} already exists.`);
    }
  }
  console.log('Categories seeded successfully!');
}

seedCategories();
