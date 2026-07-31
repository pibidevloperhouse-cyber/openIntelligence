import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request) {
  try {
    const { resourceId } = await request.json();
    console.log('[API POST /api/resources/view] Received resourceId:', resourceId);
    if (!resourceId) return NextResponse.json({ error: 'Missing resourceId' }, { status: 400 });

    const { data: res, error } = await supabaseAdmin.from('resources').select('views').eq('id', resourceId).maybeSingle();
    if (error) throw error;
    if (!res) return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    
    const newViews = (res.views || 0) + 1;
    await supabaseAdmin.from('resources').update({ views: newViews }).eq('id', resourceId);

    return NextResponse.json({ success: true, views: newViews });
  } catch (error) {
    console.error('[POST /api/resources/view]', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
