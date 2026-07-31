import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request) {
  try {
    const { resourceId, action } = await request.json();
    if (!resourceId) return NextResponse.json({ error: 'Missing resourceId' }, { status: 400 });

    const { data: res, error } = await supabaseAdmin.from('resources').select('likes').eq('id', resourceId).single();
    if (error) throw error;
    
    let newLikes = res.likes || 0;
    if (action === 'unlike') {
      newLikes = Math.max(0, newLikes - 1);
    } else {
      newLikes += 1;
    }

    await supabaseAdmin.from('resources').update({ likes: newLikes }).eq('id', resourceId);

    return NextResponse.json({ success: true, likes: newLikes });
  } catch (error) {
    console.error('[POST /api/resources/like]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
