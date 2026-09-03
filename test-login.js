const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function test() {
  const { data: admin } = await supabaseAdmin.from('admins').select('*').eq('email', 'admin@gmail.com').single();
  console.log('Admin:', admin);
  
  if (admin) {
    const isValid = await bcrypt.compare('root123', admin.password_hash);
    console.log('Is valid:', isValid);
  }
}
test();
