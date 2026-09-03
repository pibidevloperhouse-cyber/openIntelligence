const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
require('dotenv').config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createAdmin() {
  const email = 'admin@gmail.com';
  const password = 'root123';
  const name = 'Admin';

  const hash = await bcrypt.hash(password, 10);
  const id = crypto.randomUUID();

  // Upsert the admin
  const { data, error } = await supabaseAdmin
    .from('admins')
    .upsert(
      { id, email, password_hash: hash, name },
      { onConflict: 'email' }
    );

  if (error) {
    console.error('Error creating admin:', error.message);
  } else {
    console.log('Admin account created/updated successfully!');
  }
}

createAdmin();
