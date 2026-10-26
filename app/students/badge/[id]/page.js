import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase-admin';
import PublicBadgeClient from './PublicBadgeClient';

export async function generateMetadata({ params, searchParams }) {
  const { id } = await params;
  if (!id) return { title: 'Builder Badge | PiBi Open Intelligence' };

  const sParams = searchParams ? await searchParams : {};
  const member = sParams?.member ? decodeURIComponent(sParams.member).trim() : null;

  const trimmedId = id.trim();
  let query = supabaseAdmin
    .from('student_project_submissions')
    .select('registration_id, lead_student, title, institution')
    .neq('status', 'REJECTED');

  if (trimmedId.toUpperCase().startsWith('PIBI-')) {
    query = query.ilike('registration_id', trimmedId);
  } else if (trimmedId.length === 24 || trimmedId.length === 32) {
    query = query.eq('share_token', trimmedId);
  } else if (trimmedId.includes('-')) {
    query = query.eq('id', trimmedId);
  } else {
    query = query.ilike('registration_id', trimmedId);
  }

  const { data: record } = await query.maybeSingle();

  if (!record) {
    return {
      title: 'Badge Not Found | PiBi Open Intelligence',
      robots: { index: false, follow: false },
    };
  }

  const studentName = member || record.lead_student || 'Student Innovator';
  const projectTitle = record.title || 'AI Project';
  const badgeId = record.registration_id || id;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pibiopenintelligence.com';
  const ogImageUrl = `${siteUrl}/api/og/badge/${encodeURIComponent(badgeId)}.png${member ? `?member=${encodeURIComponent(member)}` : ''}`;
  const canonicalUrl = `${siteUrl}/students/badge/${encodeURIComponent(badgeId)}${member ? `?member=${encodeURIComponent(member)}` : ''}`;

  return {
    title: `${studentName} — Open Intelligence Builder Badge 2026`,
    description: `Official Registration Badge for "${projectTitle}" by ${studentName} — PiBi Open Intelligence Student Project Awards 2026.`,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${studentName} is an Open Intelligence Builder!`,
      description: `Registered project: "${projectTitle}" for the PiBi Open Intelligence Student Project Awards 2026.`,
      url: canonicalUrl,
      siteName: 'PiBi Open Intelligence',
      images: [
        {
          url: ogImageUrl,
          secureUrl: ogImageUrl,
          width: 1609,
          height: 977,
          type: 'image/png',
          alt: `${studentName} — PiBi Open Intelligence Builder Badge`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${studentName} — Open Intelligence Builder Badge 2026`,
      description: `Registered "${projectTitle}" for the PiBi Open Intelligence Student Project Awards 2026.`,
      images: [ogImageUrl],
    },
  };
}

export default async function PublicBadgePage({ params, searchParams }) {
  const { id } = await params;
  if (!id) notFound();

  const trimmedId = id.trim();
  let query = supabaseAdmin
    .from('student_project_submissions')
    .select(`
      id,
      registration_id,
      share_token,
      lead_student,
      title,
      institution,
      dept,
      year,
      domain,
      category,
      team_members,
      status,
      created_at
    `)
    .neq('status', 'REJECTED');

  if (trimmedId.toUpperCase().startsWith('PIBI-')) {
    query = query.ilike('registration_id', trimmedId);
  } else if (trimmedId.length === 24 || trimmedId.length === 32) {
    query = query.eq('share_token', trimmedId);
  } else if (trimmedId.includes('-')) {
    query = query.eq('id', trimmedId);
  } else {
    query = query.ilike('registration_id', trimmedId);
  }

  const { data: record, error } = await query.maybeSingle();

  if (error || !record) {
    return (
      <div className="min-h-screen bg-[#070e1e] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-3xl bg-[#0b162c] border border-slate-800 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-2xl font-bold">
            ?
          </div>
          <h1 className="text-xl font-bold text-white">Badge Record Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The requested registration identifier does not match any confirmed student registration record, or it has been removed.
          </p>
          <div className="pt-2">
            <Link
              href="/students"
              className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1f6fb2] to-[#2ec4b6] text-white font-bold text-xs"
            >
              Explore PiBi Open Intelligence
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Safe public fields only
  const safeData = {
    registrationId: record.registration_id || 'PIBI-2026-BDR-CONFIRMED',
    studentName: record.lead_student || 'Student Innovator',
    projectTitle: record.title || 'AI Project',
    institution: record.institution || 'Engineering College',
    dept: record.dept || '',
    year: record.year || '',
    domain: record.domain || record.category || 'AI & Machine Learning',
    teamMembers: record.team_members || [],
    createdAt: record.created_at,
    status: 'Registration Confirmed',
  };

  return <PublicBadgeClient badgeData={safeData} />;
}
