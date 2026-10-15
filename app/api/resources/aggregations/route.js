import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    try {
      const cookieStore = await cookies();
      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          cookies: {
            getAll: () => cookieStore.getAll(),
            setAll: (toSet) => toSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)),
          },
        }
      );
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabaseAdmin.from('users').select('bio').eq('id', user.id).single();
        if (profile?.bio === '__BANNED__') {
          return NextResponse.json({ categoryCounts: {}, tagCounts: {}, totalCount: 0, banned: true }, { status: 403 });
        }
      }
    } catch {}

    // Fetch only the necessary fields to compute aggregations across all approved resources.
    const { data: dbResources, error } = await supabaseAdmin
      .from('resources')
      .select('resource_categories(category:categories(slug)), resource_tags(tag:tags(name)), contributor:users!inner(bio)')
      .in('status', ['APPROVED', 'FEATURED'])
      .or('bio.neq.__BANNED__,bio.is.null', { foreignTable: 'contributor' });

    if (error) throw error;

    const categoryCounts = {};
    const tagCounts = {};
    let totalCount = 0;

    (dbResources || []).forEach(r => {
      totalCount++;
      
      // Category count
      if (r.resource_categories) {
        r.resource_categories.forEach(rc => {
          if (rc.category && rc.category.slug) {
            categoryCounts[rc.category.slug] = (categoryCounts[rc.category.slug] || 0) + 1;
          }
        });
      }
      
      // Tag count
      if (r.resource_tags) {
        r.resource_tags.forEach(rt => {
          if (rt.tag && rt.tag.name) {
            tagCounts[rt.tag.name] = (tagCounts[rt.tag.name] || 0) + 1;
          }
        });
      }
    });

    return NextResponse.json({ 
      categoryCounts, 
      tagCounts,
      totalCount
    });
  } catch (error) {
    console.error('Aggregations API error:', error);
    return NextResponse.json({ categoryCounts: {}, tagCounts: {}, totalCount: 0, error: error.message }, { status: 500 });
  }
}
