import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  try {
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
