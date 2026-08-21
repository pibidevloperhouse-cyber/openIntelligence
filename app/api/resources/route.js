import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search   = searchParams.get('search')   || '';
  const category = searchParams.get('category') || 'all';
  const sort     = searchParams.get('sort')      || 'newest';
  const page     = parseInt(searchParams.get('page')  || '1');
  const limit    = parseInt(searchParams.get('limit') || '12');
  const skip     = (page - 1) * limit;

  try {
    const selectStr = category !== 'all' 
      ? '*, resource_categories!inner(category:categories!inner(*)), contributor:users!inner(username, avatar_url, bio), resource_tags(tag:tags(*))'
      : '*, resource_categories(category:categories(*)), contributor:users!inner(username, avatar_url, bio), resource_tags(tag:tags(*))';

    let query = supabaseAdmin
      .from('resources')
      .select(selectStr, { count: 'exact' })
      .in('status', ['APPROVED', 'FEATURED'])
      .or('bio.neq.__BANNED__,bio.is.null', { foreignTable: 'contributor' });

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,use_case.ilike.%${search}%`);
    }

    if (category !== 'all') {
      query = query.eq('resource_categories.category.slug', category);
    }

    // Build orderBy
    if (sort === 'stars') {
      query = query.order('github_stars', { ascending: false });
    } else if (sort === 'featured') {
      query = query.order('status', { ascending: true });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    query = query.range(skip, skip + limit - 1);

    const { data: dbResources, count: total, error } = await query;

    if (error) throw error;

    // Map nested tags structure to match expected output
    const resources = (dbResources || []).map(r => ({
      ...r,
      categories: (r.resource_categories || []).map(rc => rc.category),
      tags: r.resource_tags || []
    }));

    return NextResponse.json({ resources, total: total || 0, page, limit });
  } catch (error) {
    console.error('Resources API error:', error);
    return NextResponse.json({ resources: [], total: 0, error: error.message }, { status: 500 });
  }
}
