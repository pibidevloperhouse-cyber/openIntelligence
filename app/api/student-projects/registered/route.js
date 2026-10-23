import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

// Public GET route returning all registered student projects
export async function GET() {
  try {
    const { data: projects, error } = await supabaseAdmin
      .from('student_project_submissions')
      .select(`
        id,
        registration_id,
        title,
        category,
        domain,
        tagline,
        lead_student,
        institution,
        city,
        state,
        dept,
        year,
        problem_statement,
        solution,
        usp,
        outcome,
        technical_summary,
        pitch,
        github_url,
        presentation_url,
        video_url,
        demo_url,
        team_members,
        tags,
        created_at,
        status
      `)
      .neq('status', 'REJECTED')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[GET /api/student-projects/registered error]:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    const list = projects || [];

    // Calculate live aggregated metrics
    const uniqueColleges = new Set();
    const uniqueDomains = new Set();
    let totalInnovatorsCount = 0;

    list.forEach((p) => {
      if (p.institution) uniqueColleges.add(p.institution.trim().toLowerCase());
      const dom = p.domain || p.category;
      if (dom) uniqueDomains.add(dom.trim());

      // Count lead + team members
      if (Array.isArray(p.team_members) && p.team_members.length > 0) {
        totalInnovatorsCount += p.team_members.length;
      } else {
        totalInnovatorsCount += 1;
      }
    });

    return NextResponse.json({
      success: true,
      projects: list,
      stats: {
        totalProjects: list.length,
        totalInnovators: totalInnovatorsCount,
        uniqueColleges: uniqueColleges.size,
        uniqueDomains: uniqueDomains.size,
      },
    });
  } catch (err) {
    console.error('[GET /api/student-projects/registered error]:', err);
    return NextResponse.json(
      { success: false, error: err.message || 'Failed to fetch registered projects' },
      { status: 500 }
    );
  }
}
