const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testBucket() {
  console.log('Checking buckets...');
  const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets();
  if (listError) {
    console.error('List error:', listError);
    return;
  }
  
  const hasEvents = buckets.some(b => b.name === 'events');
  console.log('Events bucket exists:', hasEvents);

  if (!hasEvents) {
    console.log('Creating events bucket...');
    const { data, error } = await supabaseAdmin.storage.createBucket('events', { public: true });
    if (error) {
      console.error('Create error:', error);
    } else {
      console.log('Bucket created successfully!', data);
    }
  } else {
    console.log('Bucket already exists.');
  }
}

testBucket();
