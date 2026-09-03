const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const { data: admins } = await supabaseAdmin.from('admins').select('*').eq('email', 'admin@gmail.com');
  console.log('Admins:', admins);
}
test();
