export const studentRegistrationFields = [
  { key: 'lead_student', label: 'Lead Student', required: true },
  { key: 'institution', label: 'College / University', required: true },
  { key: 'city', label: 'City / District', required: true, fallback: 'state' },
  { key: 'email', label: 'Email Address', type: 'email', required: true },
  { key: 'phone', label: 'Phone Number', type: 'tel', required: true },
  { key: 'dept', label: 'Department' },
  { key: 'year', label: 'Year of Study' },
  { key: 'dob', label: 'Date of Birth', type: 'date' },
  { key: 'team_members', label: 'Team Members (one per line)', multiline: true },
  { key: 'title', label: 'Project Title', required: true },
  { key: 'domain', label: 'Category', required: true, fallback: 'category' },
  { key: 'pitch', label: 'Pitch / Tagline', multiline: true, fallback: 'tagline' },
  { key: 'problem_statement', label: 'Problem Statement', multiline: true, required: true },
  { key: 'solution', label: 'Proposed Solution', multiline: true, required: true },
  { key: 'usp', label: 'Unique Value Proposition', multiline: true },
  { key: 'outcome', label: 'Expected Outcome', multiline: true },
  { key: 'technical_summary', label: 'Technical Summary', multiline: true },
  { key: 'github_url', label: 'GitHub Link', type: 'url' },
  { key: 'presentation_url', label: 'Presentation Link', type: 'url' },
  { key: 'video_url', label: 'Video Link', type: 'url' },
  { key: 'demo_url', label: 'Demo Link', type: 'url' },
];

export function studentRegistrationValue(project, { key, fallback }) {
  const value = project[key] || project[fallback] || '';
  return Array.isArray(value) ? value.join('\n') : String(value);
}
