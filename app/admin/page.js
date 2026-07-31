'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import StatusBadge from '@/components/StatusBadge';
import './admin.css';

const TABS = ['overview', 'pending', 'resources', 'events', 'users', 'contributors', 'settings'];

// ─── Reusable UI Components ───────────────────────────────────────────────────
function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <label style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </label>
      {children}

    </div>
  );
}

// Reusable Button to eliminate repetitive inline styles
function Btn({ children, onClick, variant = 'primary', type = 'button', disabled, style }) {
  const baseStyle = {
    padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600,
    cursor: 'pointer', transition: 'all 0.2s ease', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', gap: '6px', border: '1px solid transparent',
    opacity: disabled ? 0.6 : 1, pointerEvents: disabled ? 'none' : 'auto'
  };

  const variants = {
    primary: { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', color: '#fff', border: 'none' },
    success: { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' },
    danger: { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' },
    outline: { background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)' },
    warning: { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.3)' }
  };

  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...baseStyle, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

function CustomMobileDropdown({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    { value: 'select', label: 'All Outcomes' },
    { value: 'pending', label: 'Pending' },
    { value: 'complete', label: 'Completed' }
  ];

  const selectedOpt = options.find(o => o.value === value);

  return (
    <div style={{ position: 'relative', width: '200px' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '8px 14px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
          color: '#ffffff',
          fontSize: '0.85rem',
          fontWeight: 600,
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(31, 111, 178, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: isOpen ? 51 : 'auto'
        }}
      >
        <span>{selectedOpt ? selectedOpt.label : 'All Outcomes'}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '6px',
          background: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
          zIndex: 51,
          overflow: 'hidden'
        }}>
          {options.map(opt => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: '10px 14px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: value === opt.value ? 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' : 'transparent',
                color: value === opt.value ? '#ffffff' : '#64748b',
                transition: 'all 0.2s ease',
                borderBottom: opt.value !== 'complete' ? '1px solid var(--border)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (value !== opt.value) {
                  e.target.style.background = 'var(--bg-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== opt.value) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}
        />
      )}
    </div>
  );
}

function ResourceMobileDropdown({ value, onChange, allResources, pending }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const options = ['pending', 'approved', 'featured', 'rejected', 'all'].map(tab => {
    const count = tab === 'all' ? allResources.length : 
                 tab === 'pending' ? pending.length : 
                 allResources.filter(r => r.status === tab.toUpperCase()).length;
    
    return {
      value: tab,
      label: tab === 'all' ? `All (${count})` : 
             tab === 'pending' ? `Pending Review (${count})` : 
             `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${count})`
    };
  });

  const selectedOpt = options.find(o => o.value === value);

  return (
    <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '10px 16px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)',
          color: '#ffffff',
          fontSize: '0.9rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(31, 111, 178, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'relative',
          zIndex: isOpen ? 51 : 'auto'
        }}
      >
        <span>{selectedOpt ? selectedOpt.label : 'Select...'}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '6px',
          background: '#ffffff',
          border: '1px solid var(--border)',
          borderRadius: '10px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
          zIndex: 51,
          overflow: 'hidden'
        }}>
          {options.map((opt, i) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setIsOpen(false);
              }}
              style={{
                padding: '12px 16px',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                background: value === opt.value ? 'rgba(31, 111, 178, 0.08)' : 'transparent',
                color: value === opt.value ? '#1f6fb2' : '#64748b',
                transition: 'all 0.2s ease',
                borderBottom: i < options.length - 1 ? '1px solid var(--border)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (value !== opt.value) {
                  e.target.style.background = 'linear-gradient(135deg, rgba(31,111,178,0.1), rgba(46,196,182,0.1))';
                  e.target.style.color = '#1f6fb2';
                }
              }}
              onMouseLeave={(e) => {
                if (value !== opt.value) {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#64748b';
                }
              }}
            >
              {opt.label}
            </div>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [resourceTab, setResourceTab] = useState('pending'); // 'all', 'pending', 'approved', 'rejected', 'featured'
  const [eventTab, setEventTab] = useState('upcoming'); // 'upcoming' or 'past'
  const [eventSearch, setEventSearch] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('select'); // 'select', 'pending', 'complete'
  const [currentTime, setCurrentTime] = useState(new Date());

  // Data
  const [stats, setStats] = useState({});
  const [pending, setPending] = useState([]);
  const [allResources, setAllResources] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);

  // Create/Edit event form
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventForm, setEventForm] = useState({ title: '', description: '', date: '', time: '', end_time: '', venue: '', registration_link: '', photos: '', speakers: [] });
  const [speakerInput, setSpeakerInput] = useState('');
  const [savingEvent, setSavingEvent] = useState(false);
  const [eventError, setEventError] = useState('');

  // Outcome form
  const [showOutcomeForm, setShowOutcomeForm] = useState(false);
  const [outcomeEvent, setOutcomeEvent] = useState(null);
  const [outcomeForm, setOutcomeForm] = useState({ outcome_title: '', outcome_summary: '', attendees_count: '', tags: '', photos: '' });
  const [savingOutcome, setSavingOutcome] = useState(false);
  const [viewingOutcome, setViewingOutcome] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [userToBan, setUserToBan] = useState(null);
  const [userToUnban, setUserToUnban] = useState(null);
  const [userPage, setUserPage] = useState(1);
  const [resourcePage, setResourcePage] = useState(1);
  const [pendingPage, setPendingPage] = useState(1);
  const [eventPage, setEventPage] = useState(1);
  const [contribResourcePage, setContribResourcePage] = useState(1);
  const [contribLeaderboardPage, setContribLeaderboardPage] = useState(1);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [eventToDelete, setEventToDelete] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  }, []);

  // GitHub Contributors
  const [ghData, setGhData] = useState(null);
  const [ghLoading, setGhLoading] = useState(false);
  const [ghError, setGhError] = useState('');

  const loadContributors = useCallback(async () => {
    setGhLoading(true); setGhError('');
    try {
      const res = await fetch('/api/github/contributors');
      const data = await res.json();
      if (data.error && !data.leaderboard?.length && !data.resources?.length) {
        setGhError(data.error);
      } else {
        setGhData(data);
      }
    } catch (e) {
      setGhError(e.message);
    }
    setGhLoading(false);
  }, []);

  // Settings
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMessage, setPwMessage] = useState({ type: '', text: '' });
  const [showNewPw, setShowNewPw] = useState(false);
  const [actionLoading, setActionLoading] = useState('');

  const loadData = useCallback(async () => {
    const res = await fetch('/api/admin/data');
    if (!res.ok) return;
    const data = await res.json();
    setStats(data.stats || {});
    setPending(data.pending || []);
    setAllResources(data.resources || []);
    setMeetings(data.meetings || []);
    setUsers(data.users || []);
  }, []);

  useEffect(() => {
    async function init() {
      const res = await fetch('/api/admin/check');
      const data = await res.json();
      if (!data.isAdmin) { router.replace('/admin/login'); return; }
      setAdminUser({ email: data.email });
      await loadData();
      setLoading(false);
    }
    init();
  }, [router, loadData]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleResourceAction = async (resourceId, action) => {
    setActionLoading(resourceId + action);
    await fetch('/api/admin/resources', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resourceId, action }),
    });
    await loadData();
    setActionLoading('');
  };

  const handleUserAction = async (userId, action) => {
    setActionLoading(userId + action);
    await fetch('/api/admin/users/action', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action }),
    });
    await loadData();
    setActionLoading('');
  };

  // ── Event Handlers ──────────────────────────────────────────────────────────
  const resetEventForm = () => {
    setEventForm({ title: '', description: '', date: '', time: '', end_time: '', venue: '', registration_link: '', cover_image: '', speakers: [] });
    setSpeakerInput('');
    setEditingEvent(null);
    setShowEventForm(false);
  };

  const handleEventImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let uploadedUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (uploadedUrls.length > 0) {
      const existingPhotos = eventForm.cover_image ? eventForm.cover_image.split(',').map(p => p.trim()).filter(Boolean) : [];
      setEventForm({ ...eventForm, cover_image: [...existingPhotos, ...uploadedUrls].join(', ') });
    } else {
      alert('Upload failed for selected image(s)');
    }
  };

  const handleOutcomeImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    let uploadedUrls = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        const data = await res.json();
        if (data.success) {
          uploadedUrls.push(data.url);
        }
      } catch (err) {
        console.error(err);
      }
    }

    if (uploadedUrls.length > 0) {
      const existingPhotos = outcomeForm.photos ? outcomeForm.photos.split(',').map(p => p.trim()).filter(Boolean) : [];
      setOutcomeForm({ ...outcomeForm, photos: [...existingPhotos, ...uploadedUrls].join(', ') });
    } else {
      alert('Upload failed for selected image(s)');
    }
  };

  const openEditEvent = (meeting) => {
    const d = new Date(meeting.date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');

    const parse12to24 = (t12) => {
      if (!t12) return '';
      const match = t12.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!match) return t12; // fallback if already 24h or unknown format
      let h = parseInt(match[1], 10);
      const m = match[2];
      const isPM = match[3].toUpperCase() === 'PM';
      if (isPM && h < 12) h += 12;
      if (!isPM && h === 12) h = 0;
      return `${String(h).padStart(2, '0')}:${m}`;
    };

    setEventForm({
      title: meeting.title,
      description: meeting.description || '',
      date: `${year}-${month}-${day}`,
      time: meeting.start_time ? parse12to24(meeting.start_time) : `${hours}:${mins}`,
      end_time: meeting.end_time ? parse12to24(meeting.end_time) : '',
      venue: meeting.venue,
      registration_link: meeting.registration_link,
      cover_image: meeting.cover_image || '',
      speakers: meeting.speakers || []
    });
    setEditingEvent(meeting);
    setShowEventForm(true);
    setShowOutcomeForm(false);
    setActiveTab('events');
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    setSavingEvent(true);
    setEventError('');
    const dateTime = new Date(`${eventForm.date}T${eventForm.time || '10:00'}`).toISOString();

    const url = editingEvent ? `/api/admin/meetings/${editingEvent.id}` : '/api/admin/meetings';
    const method = editingEvent ? 'PUT' : 'POST';
    try {
      const format12 = (t24) => {
        if (!t24) return '';
        // If it already has AM/PM, it's already formatted
        if (t24.toLowerCase().includes('am') || t24.toLowerCase().includes('pm')) return t24;
        const [h, m] = t24.split(':');
        let hours = parseInt(h, 10);
        if (isNaN(hours)) return t24;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return `${String(hours).padStart(2, '0')}:${m} ${ampm}`;
      };

      const payload = { 
        ...eventForm, 
        date: dateTime,
        start_time: eventForm.time ? format12(eventForm.time) : null,
        end_time: eventForm.end_time ? format12(eventForm.end_time) : null
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      let data;
      try {
        data = await res.json();
      } catch (err) {
        setEventError(`Server returned an invalid response (${res.status}). Ensure Prisma is synced.`);
        setSavingEvent(false);
        return;
      }

      if (!res.ok) {
        setEventError(data?.error || `Request failed (${res.status})`);
        setSavingEvent(false);
        return;
      }
      const isEditing = !!editingEvent;
      await loadData();
      resetEventForm();
      showToast(isEditing ? 'Event successfully updated!' : 'Event successfully created!');
    } catch (err) {
      setEventError(err.message || 'Network error');
    }
    setSavingEvent(false);
  };

  const handleDeleteEvent = (id) => {
    setEventToDelete(id);
  };

  const confirmDeleteEvent = async () => {
    if (!eventToDelete) return;
    await fetch(`/api/admin/meetings/${eventToDelete}`, { method: 'DELETE' });
    await loadData();
    setEventToDelete(null);
    showToast('Event successfully deleted!');
  };

  const openOutcomeForm = (meeting) => {
    setOutcomeEvent(meeting);
    setOutcomeForm({
      outcome_title: meeting.outcome_title || '',
      outcome_summary: meeting.outcome_summary || '',
      attendees_count: meeting.attendees_count?.toString() || '',
      tags: (meeting.tags || []).join(', '),
      photos: (meeting.photos || []).join(', '),
    });
    setShowOutcomeForm(true);
    setShowEventForm(false);
    setActiveTab('events');
  };

  const handleSaveOutcome = async (e) => {
    e.preventDefault();
    if (!outcomeEvent?.id) return;
    setSavingOutcome(true);
    const tagsArr = outcomeForm.tags.split(',').map(t => t.trim()).filter(Boolean);
    const photosArr = outcomeForm.photos.split(',').map(t => t.trim()).filter(Boolean);
    const res = await fetch(`/api/admin/meetings/${outcomeEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outcome_title: outcomeForm.outcome_title,
        outcome_summary: outcomeForm.outcome_summary,
        attendees_count: outcomeForm.attendees_count,
        tags: tagsArr,
        photos: photosArr,
        status: 'COMPLETED',
      }),
    });

    if (!res.ok) {
      alert(`Request failed (${res.status})`);
    } else {
      showToast('Outcome successfully saved!');
    }
    await loadData();
    setShowOutcomeForm(false);
    setOutcomeEvent(null);
    setSavingOutcome(false);
  };

  if (loading) return (
    <div className="light-theme" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
      <span style={{ color: 'var(--text-muted)' }}>Loading admin panel...</span>
    </div>
  );

  const now = currentTime;

  const filteredMeetings = meetings.filter(m => {
    if (!eventSearch) return true;
    const q = eventSearch.toLowerCase();
    return m.title.toLowerCase().includes(q) || (m.description && m.description.toLowerCase().includes(q));
  });

  const upcoming = filteredMeetings.filter(m => new Date(m.date) >= now);
  const pastEvents = filteredMeetings.filter(m => new Date(m.date) < now);
  const outcomesList = pastEvents.filter(m => m.status === 'COMPLETED');

  const navItems = [
    { id: 'overview', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>, label: 'Overview' },
    { id: 'resources', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>, label: 'Resources', count: pending.length },
    { id: 'events', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>, label: 'Events', count: meetings.length },
    { id: 'users', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4-4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, label: 'Users', count: users.length },
    { id: 'contributors', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>, label: 'Contributors', count: ghData?.summary?.contributors || 0 },
    { id: 'settings', icon: <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>, label: 'Settings' },
  ];

  return (
    <>
      <div className="light-theme admin-layout">

        {/* ── DESKTOP SIDEBAR (hidden on mobile) ───────────────────────────────── */}
        <aside className="admin-sidebar">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.2, marginBottom: '4px' }}>
              Open Intelligence
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              PiBi Foundation
            </div>
          </div>

          <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navItems.map(tab => (
              <button
                key={tab.id}
                className={`sidebar-nav-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (tab.id === 'resources') setResourceTab('all');
                  if (tab.id === 'contributors' && !ghData && !ghLoading) loadContributors();
                }}
                style={{ color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.1rem', width: '20px', textAlign: 'center' }}>{tab.icon}</span>
                  <span style={{ fontWeight: activeTab === tab.id ? 700 : 500, fontSize: '0.85rem' }}>{tab.label}</span>
                </div>
                {tab.count > 0 && (
                  <span className="sidebar-badge" style={{
                    background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.05)',
                    color: activeTab === tab.id ? '#ffffff' : 'var(--text-muted)',
                    padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600, transition: 'all 0.2s'
                  }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
              <div style={{
                width: 36, height: 36,
                background: 'rgba(0,0,0,0.05)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)',
              }}>
                {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {adminUser?.email}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#34d399', fontWeight: 600 }}>
                  Admin
                </div>
              </div>
            </div>
            <button
              onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); router.push('/admin/login'); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'transparent', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500, padding: 0,
                transition: 'color 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <span style={{ fontSize: '1.1rem' }}>↪</span> Logout
            </button>
          </div>
        </aside>

        {/* ── MOBILE TOPBAR (hidden on desktop): logo left, hamburger right ──────── */}
        <header className="mobile-topbar">
          <div style={{ fontWeight: 800, fontSize: '1rem', background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Open Intelligence
          </div>
          <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(o => !o)}>
            {mobileMenuOpen ? (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </header>

        {/* Mobile dropdown backdrop */}
        <div className={`mobile-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

        {/* Mobile dropdown menu (nav + user), opens below the topbar */}
        <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
          {navItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                if (tab.id === 'resources') setResourceTab('all');
                setMobileMenuOpen(false);
                if (tab.id === 'contributors' && !ghData && !ghLoading) loadContributors();
              }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                background: activeTab === tab.id ? 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' : 'transparent',
                border: 'none',
                color: activeTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
                boxShadow: activeTab === tab.id ? '0 4px 10px rgba(31, 111, 178, 0.2)' : 'none',
                cursor: 'pointer',
                transition: 'all 0.2s',
                textAlign: 'left'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem', width: '20px', textAlign: 'center' }}>{tab.icon}</span>
                <span style={{ fontWeight: activeTab === tab.id ? 700 : 500, fontSize: '0.85rem' }}>{tab.label}</span>
              </div>
              {tab.count > 0 && (
                <span style={{
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.2)' : (tab.id === 'pending' ? 'rgba(245,158,11,0.1)' : 'rgba(0,0,0,0.05)'),
                  color: activeTab === tab.id ? '#ffffff' : (tab.id === 'pending' ? '#fbbf24' : 'var(--text-muted)'),
                  padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 600
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
          <div style={{ borderTop: '1px solid var(--border)', marginTop: 'auto', paddingTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: 36, height: 36,
                background: 'rgba(99,102,241,0.1)',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1rem', fontWeight: 700, color: '#6366f1',
                flexShrink: 0
              }}>
                {adminUser?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-all', lineHeight: 1.2 }}>
                  {adminUser?.email}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600, marginTop: '2px' }}>
                  Admin
                </div>
              </div>
            </div>
            <button
              onClick={async () => { await fetch('/api/admin/logout', { method: 'POST' }); router.push('/admin/login'); }}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#f87171',
                cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
                padding: '0.6rem',
                borderRadius: '8px',
                width: '100%',
                transition: 'background 0.2s'
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>↪</span> Logout
            </button>
          </div>
        </div>

        {/* ── MAIN CONTENT ───────────────────────────────────────────────────── */}
        <main className="admin-main">

          {/* Header Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textTransform: 'capitalize' }}>
                {activeTab === 'pending' ? 'Pending Review' : activeTab}
              </h1>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>
                Open Intelligence Hub · Madurai AI Community
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {activeTab === 'pending' && pending.length > 0 && (
                <button
                  onClick={() => setActiveTab('pending')}
                  style={{ padding: '0.4rem 1rem', background: 'rgba(245,158,11,0.1)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  <span>{pending.length} pending</span>
                </button>
              )}
            </div>
          </div>

          {/* ── OVERVIEW ─────────────────────────────────────────────────────── */}
          {activeTab === 'overview' && (
            <div>
              <div className="overview-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { label: 'Total Resources', value: stats.total || 0, color: '#6366f1', icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path></svg> },
                  { label: 'Pending Review', value: stats.pending || 0, color: '#f59e0b', icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> },
                  { label: 'Approved', value: stats.approved || 0, color: '#10b981', icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg> },
                  { label: 'Featured', value: stats.featured || 0, color: '#06b6d4', icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> },
                  { label: 'Contributors', value: stats.contributors || 0, color: '#8b5cf6', icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> },
                  { label: 'Upcoming Events', value: upcoming.length, color: '#ec4899', icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg> },
                  { label: 'Past Sessions', value: pastEvents.length, color: '#64748b', icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="12" r="2"></circle></svg> },
                ].map(({ label, value, color, icon }) => (
                  <div key={label} style={{ background: '#ffffff', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'transform 0.2s' }}>
                    <div style={{ fontSize: '1.1rem', opacity: 0.9, color }}>{icon}</div>
                    <div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: 500 }}>{label}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button onClick={() => { setActiveTab('resources'); setResourceTab('pending'); }} style={{ padding: '0.6rem 1.25rem', background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', color: 'white', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.2s', boxShadow: '0 4px 10px rgba(31, 111, 178, 0.2)' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  Review Pending ({pending.length}) <span>→</span>
                </button>
                <button onClick={() => { setActiveTab('events'); resetEventForm(); setShowEventForm(true); }} style={{ padding: '0.6rem 1.25rem', background: '#005b9f', color: '#ffffff', border: 'none', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'opacity 0.2s', boxShadow: '0 4px 10px rgba(0, 91, 159, 0.2)' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.85'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                  <span>+</span> Add Event
                </button>
              </div>
            </div>
          )}

          {/* ── RESOURCES (includes Pending) ─────────────────────────────────── */}
          {activeTab === 'resources' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              <div className="outcome-filter-desktop" style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {['pending', 'approved', 'featured', 'rejected', 'all'].map(tab => {
                  const count = tab === 'all' ? allResources.length : 
                               tab === 'pending' ? pending.length : 
                               allResources.filter(r => r.status === tab.toUpperCase()).length;
                  return (
                    <button
                      key={tab}
                      onClick={() => { setResourceTab(tab); setResourcePage(1); }}
                      style={{ 
                        background: 'none', border: 'none', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', 
                        padding: '0.5rem 0', 
                        borderBottom: resourceTab === tab ? '2px solid #2ec4b6' : '2px solid transparent', 
                        transition: 'all 0.2s', 
                        whiteSpace: 'nowrap',
                        ...(resourceTab === tab ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: 'var(--text-muted)' }) 
                      }}
                      onMouseEnter={(e) => {
                        if (resourceTab !== tab) {
                          e.target.style.background = 'linear-gradient(135deg, #1f6fb2, #2ec4b6)';
                          e.target.style.WebkitBackgroundClip = 'text';
                          e.target.style.WebkitTextFillColor = 'transparent';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (resourceTab !== tab) {
                          e.target.style.background = 'none';
                          e.target.style.WebkitBackgroundClip = 'initial';
                          e.target.style.WebkitTextFillColor = 'initial';
                          e.target.style.color = 'var(--text-muted)';
                        }
                      }}
                    >
                      {tab === 'all' ? `All (${count})` : 
                       tab === 'pending' ? `Pending Review (${count})` : 
                       `${tab.charAt(0).toUpperCase() + tab.slice(1)} (${count})`}
                    </button>
                  );
                })}
              </div>
              <div className="outcome-filter-mobile">
                <ResourceMobileDropdown value={resourceTab} onChange={v => { setResourceTab(v); setResourcePage(1); }} allResources={allResources} pending={pending} />
              </div>

              {(() => {
                const resPerPage = 5;
                const filteredRes = resourceTab === 'all' ? allResources 
                  : resourceTab === 'pending' ? pending 
                  : allResources.filter(r => r.status === resourceTab.toUpperCase());
                
                const totalResPages = Math.ceil(filteredRes.length / resPerPage);
                const currentRes = filteredRes.slice((resourcePage - 1) * resPerPage, resourcePage * resPerPage);

                if (filteredRes.length === 0) {
                  return (
                    <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px' }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>No {resourceTab !== 'all' ? resourceTab : ''} resources found.</p>
                    </div>
                  );
                }

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {currentRes.map((r) => (
                      <div key={r.id} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap', borderRadius: '12px', background: '#ffffff', border: '1px solid var(--border)' }}>
                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                            <Link href={`/resources/${r.slug}`} target="_blank" style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: '#1f6fb2' }}><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
                              {r.title} ↗
                            </Link>
                            <StatusBadge status={r.status} />
                          </div>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: '0 0 0.5rem', lineHeight: 1.4 }}>{r.description}</p>
                          <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)', flexWrap: 'wrap', alignItems: 'center' }}>
                             {r.category && (
                               <span style={{ padding: '0.1rem 0.4rem', background: 'rgba(99,102,241,0.05)', color: '#6366f1', borderRadius: '4px', border: '1px solid rgba(99,102,241,0.1)' }}>
                                 {r.category.icon} {r.category.name}
                               </span>
                             )}
                             <span>by @{r.contributor?.username}</span>
                             {r.github_stars > 0 && <span>⭐ {r.github_stars}</span>}
                             {r.github_language && <span>💻 {r.github_language}</span>}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignSelf: 'center' }}>
                          {r.status !== 'FEATURED' && <Btn variant="primary" onClick={() => handleResourceAction(r.id, 'feature')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', minWidth: '90px' }} disabled={!!actionLoading}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> Feature</Btn>}
                          {r.status !== 'APPROVED' && r.status !== 'FEATURED' && <Btn variant="success" onClick={() => handleResourceAction(r.id, 'approve')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', minWidth: '90px' }} disabled={!!actionLoading}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Approve</Btn>}
                          {r.status !== 'REJECTED' && <Btn variant="danger" onClick={() => handleResourceAction(r.id, 'reject')} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', minWidth: '90px' }} disabled={!!actionLoading}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg> Reject</Btn>}
                        </div>
                      </div>
                    ))}
                    {totalResPages > 1 && (
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '1rem' }}>
                        <Btn variant="previous" onClick={() => setResourcePage(p => Math.max(1, p - 1))} disabled={resourcePage === 1} style={{ padding: '0.4rem 1rem' }}>Previous</Btn>
                        <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>Page {resourcePage} of {totalResPages}</span>
                        <Btn variant="next" onClick={() => setResourcePage(p => Math.min(totalResPages, p + 1))} disabled={resourcePage === totalResPages} style={{ padding: '0.4rem 1rem' }}>Next</Btn>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── EVENTS TAB ───────────────────────────────────────────────────── */}
          {activeTab === 'events' && (
            <div>
              {/* Action bar */}
              {!showEventForm && !showOutcomeForm && (
                <Btn onClick={() => { resetEventForm(); setShowEventForm(true); }} style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', color: 'white', border: 'none', boxShadow: '0 4px 10px rgba(31, 111, 178, 0.2)' }}>
                  + Create New Event
                </Btn>
              )}

              {/* CREATE / EDIT Event Form */}
              {showEventForm && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                  <div className="glass-card" style={{ padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid rgba(99,102,241,0.4)', width: '100%', maxWidth: '550px', background: 'var(--bg-primary)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: 0 }}>
                        {editingEvent ? 'Edit Event' : 'Create New Event'}
                      </h3>
                      <button onClick={resetEventForm} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}>✖</button>
                    </div>
                    <div className="custom-scrollbar" style={{ maxHeight: 'calc(85vh - 6rem)', overflowY: 'auto', paddingRight: '0.5rem', marginRight: '-0.5rem' }}>
                      <form onSubmit={handleSaveEvent} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {eventError && (
                          <div style={{ padding: '0.75rem 1rem', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            {eventError}
                          </div>
                        )}
                        <Field label="Event Title">
                          <input required placeholder="e.g. Build a RAG Pipeline with LangChain" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="input-field" />
                        </Field>
                        <Field label="Description / Agenda">
                          <textarea required placeholder="What will be covered, who should attend..." value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="input-field" style={{ minHeight: '100px' }} />
                        </Field>
                        <div className="form-grid">
                          <Field label="Date"><input required type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="input-field" style={{ color: eventForm.date ? 'var(--text-primary)' : 'var(--text-muted, #94a3b8)', textTransform: 'uppercase' }} /></Field>
                          <Field label="Timing">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <input type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="input-field" style={{ padding: '0.4rem', fontSize: '0.8rem', color: eventForm.time ? 'var(--text-primary)' : 'var(--text-muted, #94a3b8)' }} />
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>to</span>
                              <input type="time" value={eventForm.end_time} onChange={(e) => setEventForm({ ...eventForm, end_time: e.target.value })} className="input-field" style={{ padding: '0.4rem', fontSize: '0.8rem', color: eventForm.end_time ? 'var(--text-primary)' : 'var(--text-muted, #94a3b8)' }} />
                            </div>
                          </Field>
                        </div>
                        <Field label="Venue">
                          <input required placeholder="e.g. PiBi Office, Madurai / Online – Google Meet" value={eventForm.venue} onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })} className="input-field" />
                        </Field>
                        <Field label="Registration / Join Link (optional)">
                          <input type="url" placeholder="https://..." value={eventForm.registration_link} onChange={(e) => setEventForm({ ...eventForm, registration_link: e.target.value })} className="input-field" />
                        </Field>
                        <Field label="Speakers (Optional)">
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="text" placeholder="e.g. Nagaraj" value={speakerInput} onChange={(e) => setSpeakerInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (speakerInput.trim()) { setEventForm({ ...eventForm, speakers: [...(eventForm.speakers || []), speakerInput.trim()] }); setSpeakerInput(''); } } }} className="input-field" style={{ width: '100%', maxWidth: '350px', padding: '0.5rem 0.75rem', fontSize: '0.85rem' }} />
                            <button type="button" onClick={() => { if (speakerInput.trim()) { setEventForm({ ...eventForm, speakers: [...(eventForm.speakers || []), speakerInput.trim()] }); setSpeakerInput(''); } }} style={{ padding: '0 2rem', minWidth: '115px', background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 2px 4px rgba(31, 111, 178, 0.2)' }}>Add</button>
                          </div>
                          {eventForm.speakers && eventForm.speakers.length > 0 && (
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.75rem' }}>
                              {eventForm.speakers.map((s, idx) => (
                                <span key={idx} style={{ padding: '4px 10px', background: 'rgba(31, 111, 178, 0.1)', color: '#1f6fb2', borderRadius: '16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(31, 111, 178, 0.2)' }}>
                                  {s}
                                  <button type="button" onClick={() => setEventForm({ ...eventForm, speakers: eventForm.speakers.filter((_, i) => i !== idx) })} style={{ background: 'transparent', border: 'none', color: '#1f6fb2', cursor: 'pointer', padding: 0, fontSize: '1rem', lineHeight: 1 }}>&times;</button>
                                </span>
                              ))}
                            </div>
                          )}
                        </Field>
                        <Field label="Event Banners / Photos">
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', border: '1px solid rgba(31, 111, 178, 0.3)', borderRadius: '8px', background: 'rgba(31, 111, 178, 0.05)', cursor: 'pointer', transition: 'all 0.2s', width: 'fit-content' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(31, 111, 178, 0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(31, 111, 178, 0.05)'}>
                            <input type="file" multiple accept="image/*" onChange={handleEventImageUpload} style={{ display: 'none' }} />
                            <div style={{ width: '32px', height: '32px', background: 'rgba(31, 111, 178, 0.15)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1f6fb2' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ color: '#1f6fb2', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>Upload Images</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Select multiple</span>
                            </div>
                          </label>

                          {eventForm.cover_image && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '1.5rem' }}>
                              {eventForm.cover_image.split(',').map(p => p.trim()).filter(Boolean).map((photoUrl, idx) => (
                                <div key={idx} style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(99,102,241,0.2)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: 'transparent' }}>
                                  <img src={photoUrl} alt={`Event ${idx}`} style={{ height: '100%', width: 'auto', objectFit: 'contain', display: 'block' }} />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newPhotos = eventForm.cover_image.split(',').map(p => p.trim()).filter(Boolean).filter((_, i) => i !== idx);
                                      setEventForm({ ...eventForm, cover_image: newPhotos.join(', ') });
                                    }}
                                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239,68,68,0.9)', border: 'none', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.85rem', zIndex: 5, backdropFilter: 'blur(4px)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                                  >
                                    &times;
                                  </button>
                                  {idx === 0 && (
                                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(99,102,241,0.9)', color: 'white', fontSize: '0.65rem', textAlign: 'center', padding: '2px 0', fontWeight: 700, letterSpacing: '0.5px' }}>MAIN</div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </Field>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                          <Btn variant="outline" onClick={resetEventForm}>Cancel</Btn>
                          <Btn type="submit" disabled={savingEvent}>{savingEvent ? 'Saving...' : editingEvent ? 'Update Event' : 'Create Event'}</Btn>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* ADD OUTCOME Form */}
              {showOutcomeForm && outcomeEvent && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
                  <div className="glass-card" style={{ padding: '1.5rem 2rem', borderRadius: '16px', border: '1px solid rgba(52,211,153,0.4)', width: '100%', maxWidth: '550px', background: 'var(--bg-primary)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <h3 style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 700, fontFamily: 'var(--font-display)', fontSize: '1.25rem', margin: 0, display: 'inline-block' }}>Add Session Outcome</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '4px' }}>For: <strong style={{ color: 'var(--text-secondary)' }}>{outcomeEvent.title}</strong></p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ padding: '0.3rem 0.8rem', background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>→ COMPLETED</span>
                        <button onClick={() => { setShowOutcomeForm(false); setOutcomeEvent(null); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.25rem', cursor: 'pointer' }}>✖</button>
                      </div>
                    </div>
                    <div className="custom-scrollbar" style={{ maxHeight: 'calc(85vh - 6rem)', overflowY: 'auto', paddingRight: '0.5rem', marginRight: '-0.5rem' }}>
                      <form onSubmit={handleSaveOutcome} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Field label="Session Outcome Title">
                          <input required placeholder="e.g. Built a RAG Pipeline with 28 Attendees!" value={outcomeForm.outcome_title} onChange={(e) => setOutcomeForm({ ...outcomeForm, outcome_title: e.target.value })} className="input-field" />
                        </Field>
                        <Field label="What happened? What was built / discussed?">
                          <textarea required placeholder="Describe what was covered, demos built, key learnings, feedback from attendees..." value={outcomeForm.outcome_summary} onChange={(e) => setOutcomeForm({ ...outcomeForm, outcome_summary: e.target.value })} className="input-field" style={{ minHeight: '120px' }} />
                        </Field>
                        <div className="form-grid">
                          <Field label="Attendees Count"><input type="number" min="0" placeholder="e.g. 28" value={outcomeForm.attendees_count} onChange={(e) => setOutcomeForm({ ...outcomeForm, attendees_count: e.target.value })} className="input-field" /></Field>
                          <Field label="Topics Covered (comma-separated)"><input placeholder="e.g. RAG, LangChain, Agents, MCP" value={outcomeForm.tags} onChange={(e) => setOutcomeForm({ ...outcomeForm, tags: e.target.value })} className="input-field" /></Field>
                        </div>
                        <Field label="Upload Outcome Photos">
                          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', border: '1px solid rgba(52,211,153,0.4)', borderRadius: '8px', background: 'rgba(52,211,153,0.05)', cursor: 'pointer', transition: 'all 0.2s', width: 'fit-content' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(52,211,153,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(52,211,153,0.05)'}>
                            <input type="file" multiple accept="image/*" onChange={handleOutcomeImageUpload} style={{ display: 'none' }} />
                            <div style={{ width: '32px', height: '32px', background: 'rgba(52,211,153,0.15)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ color: '#10b981', fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>Upload Photos</span>
                              <span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>Select multiple</span>
                            </div>
                          </label>

                          {outcomeForm.photos && (
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '1.5rem' }}>
                              {outcomeForm.photos.split(',').map(p => p.trim()).filter(Boolean).map((photoUrl, idx) => (
                                <div key={idx} style={{ position: 'relative', height: '100px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(52,211,153,0.3)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', background: 'transparent' }}>
                                  <img src={photoUrl} alt={`Outcome ${idx}`} style={{ height: '100%', width: 'auto', objectFit: 'contain', display: 'block', transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'} />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newPhotos = outcomeForm.photos.split(',').map(p => p.trim()).filter(Boolean).filter((_, i) => i !== idx);
                                      setOutcomeForm({ ...outcomeForm, photos: newPhotos.join(', ') });
                                    }}
                                    style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(239,68,68,0.9)', border: 'none', color: '#fff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '0.85rem', zIndex: 5, backdropFilter: 'blur(4px)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </Field>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                          <Btn variant="outline" onClick={() => { setShowOutcomeForm(false); setOutcomeEvent(null); }}>Cancel</Btn>
                          <Btn variant="success" type="submit" disabled={savingOutcome}>{savingOutcome ? 'Saving...' : '✅ Mark as Completed'}</Btn>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              )}

              {/* Events list */}
              {!showEventForm && !showOutcomeForm && (
                <div className="event-tabs">
                  <button
                    onClick={() => { setEventTab('upcoming'); setEventPage(1); }}
                    style={{ background: 'none', border: 'none', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 0', borderBottom: eventTab === 'upcoming' ? '2px solid #2ec4b6' : '2px solid transparent', transition: 'all 0.2s', ...(eventTab === 'upcoming' ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: 'var(--text-muted)' }) }}>
                    Upcoming Events ({upcoming.length})
                  </button>
                  <button
                    onClick={() => { setEventTab('past'); setEventPage(1); }}
                    style={{ background: 'none', border: 'none', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 0', borderBottom: eventTab === 'past' ? '2px solid #2ec4b6' : '2px solid transparent', transition: 'all 0.2s', ...(eventTab === 'past' ? { background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : { color: 'var(--text-muted)' }) }}>
                    Past Sessions ({pastEvents.length})
                  </button>

                  <div style={{ flex: 1 }}></div>
                  <div style={{ position: 'relative', flex: '1 1 200px' }}>
                    <span style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                    </span>
                    <input
                      type="text"
                      placeholder="Search events..."
                      value={eventSearch}
                      onChange={(e) => setEventSearch(e.target.value)}
                      className="input-field"
                      style={{ paddingLeft: '32px', paddingRight: '12px', paddingTop: '6px', paddingBottom: '6px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              )}

              {meetings.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📅</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No events yet. Create your first event!</p>
                </div>
              ) : (
                <>
                  {eventTab === 'upcoming' && (
                    upcoming.length > 0 ? (() => {
                      const evtPerPage = 5;
                      const totalEvtPages = Math.ceil(upcoming.length / evtPerPage);
                      const currentEvt = upcoming.slice((eventPage - 1) * evtPerPage, eventPage * evtPerPage);
                      return (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {currentEvt.map((m) => <EventRow key={m.id} m={m} onEdit={openEditEvent} onDelete={handleDeleteEvent} onOutcome={openOutcomeForm} onRefresh={loadData} isPast={false} onViewOutcome={setViewingOutcome} />)}
                          </div>
                          {totalEvtPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '1rem' }}>
                              <Btn variant="previous" onClick={() => setEventPage(p => Math.max(1, p - 1))} disabled={eventPage === 1} style={{ padding: '0.4rem 1rem' }}>Previous</Btn>
                              <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>Page {eventPage} of {totalEvtPages}</span>
                              <Btn variant="next" onClick={() => setEventPage(p => Math.min(totalEvtPages, p + 1))} disabled={eventPage === totalEvtPages} style={{ padding: '0.4rem 1rem' }}>Next</Btn>
                            </div>
                          )}
                        </>
                      );
                    })() : (
                      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No upcoming events currently scheduled.</p>
                    )
                  )}

                  {eventTab === 'past' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '1.5rem', width: '100%' }}>
                        <div className="outcome-filter-desktop" style={{ display: 'flex', gap: '0.25rem', background: 'var(--bg-secondary, #f8fafc)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)', flexWrap: 'wrap' }}>
                          {[
                            { value: 'select', label: 'All Outcomes' },
                            { value: 'pending', label: <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><circle cx="10" cy="16" r="5" strokeWidth="2" fill="var(--bg-secondary)"></circle><polyline points="10 14 10 16 11.5 17.5"></polyline></svg>Pending</> },
                            { value: 'complete', label: <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>Completed</> }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => setOutcomeFilter(opt.value)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                whiteSpace: 'nowrap',
                                padding: '0.5rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                background: outcomeFilter === opt.value ? 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' : 'transparent',
                                color: outcomeFilter === opt.value ? '#ffffff' : '#64748b',
                                boxShadow: outcomeFilter === opt.value ? '0 4px 10px rgba(31, 111, 178, 0.2)' : 'none'
                              }}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                        <div className="outcome-filter-mobile">
                          <CustomMobileDropdown
                            value={outcomeFilter}
                            onChange={(val) => setOutcomeFilter(val)}
                          />
                        </div>
                      </div>

                      {(() => {
                        let filteredOutcomes = pastEvents;
                        if (outcomeFilter === 'pending') {
                          filteredOutcomes = pastEvents.filter(m => m.status !== 'COMPLETED' || !m.outcome_title);
                        } else if (outcomeFilter === 'complete') {
                          filteredOutcomes = pastEvents.filter(m => m.status === 'COMPLETED' && m.outcome_title);
                        }

                        if (filteredOutcomes.length === 0) {
                          return <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>No past sessions found for this filter.</p>;
                        }

                        const evtPerPage = 5;
                        const totalEvtPages = Math.ceil(filteredOutcomes.length / evtPerPage);
                        const currentEvt = filteredOutcomes.slice((eventPage - 1) * evtPerPage, eventPage * evtPerPage);

                        return (
                          <>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                              {currentEvt.map(m => <EventRow key={m.id} m={m} onEdit={openEditEvent} onDelete={handleDeleteEvent} onOutcome={openOutcomeForm} onRefresh={loadData} isPast={true} onViewOutcome={setViewingOutcome} />)}
                            </div>
                            {totalEvtPages > 1 && (
                              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '1rem' }}>
                                <Btn variant="previous" onClick={() => setEventPage(p => Math.max(1, p - 1))} disabled={eventPage === 1} style={{ padding: '0.4rem 1rem' }}>Previous</Btn>
                                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>Page {eventPage} of {totalEvtPages}</span>
                                <Btn variant="next" onClick={() => setEventPage(p => Math.min(totalEvtPages, p + 1))} disabled={eventPage === totalEvtPages} style={{ padding: '0.4rem 1rem' }}>Next</Btn>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </>
              )}

              {/* VIEW OUTCOME MODAL */}
              {viewingOutcome && (() => {
                const modalBgImage = viewingOutcome.photos && viewingOutcome.photos.length > 0 ? viewingOutcome.photos[0] : null;

                return (
                  <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setViewingOutcome(null)}>
                    <div
                      className="glass-card"
                      style={{
                        padding: '2rem',
                        borderRadius: '24px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        width: '100%',
                        maxWidth: '650px',
                        background: 'var(--bg-primary)',
                        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.7)'
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <div className="custom-scrollbar" style={{ maxHeight: 'calc(80vh - 4rem)', overflowY: 'auto' }}>

                        {/* First Card - Image Banner */}
                        <div style={{
                          position: 'relative',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          marginBottom: '1rem',
                          background: modalBgImage
                            ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${modalBgImage})`
                            : '#0f172a',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          minHeight: '200px',
                          border: '1px solid rgba(255,255,255,0.15)'
                        }}>
                          <h3 style={{
                            color: '#ffffff',
                            fontWeight: 300,
                            fontSize: '1rem',
                            margin: 0,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            position: 'absolute',
                            top: '16px',
                            left: '16px'
                          }}>Outcome Details</h3>
                        </div>

                        {/* Second Card - Content */}
                        <div style={{
                          background: 'rgba(255, 255, 255, 0.03)',
                          padding: '1.5rem',
                          borderRadius: '16px',
                          border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          <h4 style={{ color: '#34d399', fontWeight: 600, fontSize: '1.1rem', margin: '0 0 12px 0', textTransform: 'uppercase' }}>{viewingOutcome.outcome_title}</h4>
                          <div style={{
                            color: '#ffffff',
                            fontSize: '0.95rem',
                            lineHeight: '1.8',
                            whiteSpace: 'pre-wrap',
                            background: 'rgba(15, 23, 42, 0.5)',
                            padding: '1.25rem',
                            borderRadius: '12px',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
                          }}>
                            {viewingOutcome.outcome_summary}
                          </div>
                        </div>

                      </div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                        <Btn variant="primary" onClick={() => setViewingOutcome(null)}>Close</Btn>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}


          {/* ── USERS ─────────────────────────────────────────────────────────── */}
          {activeTab === 'users' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {users.length === 0 ? (
                <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', borderRadius: '16px' }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>👥</div>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No registered users yet.</p>
                </div>
              ) : (() => {
                const usersPerPage = 5;
                const totalUserPages = Math.ceil(users.length / usersPerPage);
                const currentUsers = users.slice((userPage - 1) * usersPerPage, userPage * usersPerPage);

                return (
                  <div style={{ paddingBottom: '6rem' }}>
                    {currentUsers.map((u) => {
                      const totalSubs = u.resources?.length || 0;
                      const approvedSubs = u.resources?.filter(r => r.status === 'APPROVED' || r.status === 'FEATURED').length || 0;
                      const isBanned = u.bio === '__BANNED__';

                      return (
                        <div key={u.id} className="glass-card" style={{ padding: '1.25rem 1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap', borderRadius: '12px', opacity: isBanned ? 0.6 : 1, marginBottom: '0.75rem', background: '#ffffff', border: '1px solid var(--border)' }}>
                          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flex: 1, minWidth: '220px' }}>
                            <img src={u.avatar_url} alt={u.username} style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />
                            <div>
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ color: isBanned ? '#f87171' : 'var(--text-primary)', fontWeight: 700, fontSize: '1rem', textDecoration: isBanned ? 'line-through' : 'none' }}>{u.full_name}</span>
                                {isBanned && <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(239,68,68,0.15)', color: '#f87171', fontWeight: 700, border: '1px solid rgba(239,68,68,0.3)' }}>BANNED</span>}
                                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: u.role === 'ADMIN' ? 'rgba(239,68,68,0.15)' : 'rgba(46,196,182,0.15)', color: u.role === 'ADMIN' ? '#f87171' : '#2ec4b6', fontWeight: 700, border: `1px solid ${u.role === 'ADMIN' ? 'rgba(239,68,68,0.3)' : 'rgba(46,196,182,0.3)'}` }}>
                                  {u.role}
                                </span>
                              </div>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', margin: '4px 0 0' }}>
                                @{u.username} · Joined {new Date(u.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{totalSubs}</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Submissions</div>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{approvedSubs}</div>
                              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approved</div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.5rem', minWidth: '160px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                            <a href={`https://github.com/${u.username}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                              <Btn variant="outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>GitHub ↗</Btn>
                            </a>
                            <Btn variant="primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setViewingUser(u)}>View</Btn>
                            {isBanned ? (
                              <Btn variant="success" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setUserToUnban(u)} disabled={!!actionLoading}>Unban</Btn>
                            ) : (
                              <Btn variant="danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }} onClick={() => setUserToBan(u)} disabled={!!actionLoading}>Ban</Btn>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border)', position: 'fixed', bottom: '1.5rem', left: '50%', transform: 'translateX(-50%)', width: 'min(560px, 92vw)', zIndex: 50, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
                      <Btn variant="previous" onClick={() => setUserPage(p => Math.max(1, p - 1))} disabled={userPage === 1} style={{ padding: '0.4rem 1rem' }}>
                        Previous
                      </Btn>
                      <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                        Page {userPage} of {totalUserPages || 1}
                      </span>
                      <Btn variant="next" onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))} disabled={userPage === totalUserPages || totalUserPages === 0} style={{ padding: '0.4rem 1rem' }}>
                        Next
                      </Btn>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* VIEW USER SUBMISSIONS MODAL */}
          {viewingUser && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setViewingUser(null)}>
              <div
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: '24px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  width: '100%',
                  maxWidth: '700px',
                  background: 'var(--bg-primary)',
                  boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.7)'
                }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                  <img src={viewingUser.avatar_url} alt={viewingUser.username} style={{ width: '56px', height: '56px', borderRadius: '50%' }} />
                  <div>
                    <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>{viewingUser.full_name}'s Submissions</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: '4px 0 0' }}>@{viewingUser.username}</p>
                  </div>
                </div>
                <div className="custom-scrollbar" style={{ maxHeight: 'calc(80vh - 8rem)', overflowY: 'auto', paddingRight: '0.5rem' }}>
                  {allResources.filter(r => r.contributor_id === viewingUser.id).length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No submissions found for this user.</div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {allResources.filter(r => r.contributor_id === viewingUser.id).map(r => (
                        <div key={r.id} style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1rem', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <Link href={`/resources/${r.slug}`} target="_blank" style={{ color: 'var(--text-primary)', fontWeight: 600, textDecoration: 'none', fontSize: '0.9rem' }}>{r.title} ↗</Link>
                            <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '4px' }}>{r.category?.name}</div>
                          </div>
                          <StatusBadge status={r.status} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <Btn variant="primary" onClick={() => setViewingUser(null)}>Close</Btn>
                </div>
              </div>
            </div>
          )}

          {/* BAN USER MODAL */}
          {userToBan && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setUserToBan(null)}>
              <div
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: '24px',
                  width: 'min(400px, 90vw)',
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                </div>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.4rem', margin: '0 0 0.5rem' }}>Ban User</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 2rem', lineHeight: '1.5' }}>
                  Are you sure you want to ban <strong>{userToBan.full_name}</strong> (@{userToBan.username})? This action will prevent them from accessing the platform.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <Btn variant="outline" onClick={() => setUserToBan(null)} style={{ flex: 1, padding: '0.75rem' }}>Cancel</Btn>
                  <Btn variant="danger" onClick={() => { handleUserAction(userToBan.id, 'ban'); setUserToBan(null); }} style={{ flex: 1, padding: '0.75rem' }}>Yes, Ban User</Btn>
                </div>
              </div>
            </div>
          )}

          {/* UNBAN USER MODAL */}
          {userToUnban && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.85)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }} onClick={() => setUserToUnban(null)}>
              <div
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: '24px',
                  width: 'min(400px, 90vw)',
                  background: '#ffffff',
                  border: '1px solid var(--border)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}
                onClick={e => e.stopPropagation()}
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                </div>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.4rem', margin: '0 0 0.5rem' }}>Unban User</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: '0 0 2rem', lineHeight: '1.5' }}>
                  Are you sure you want to unban <strong>{userToUnban.full_name}</strong> (@{userToUnban.username})? They will be able to access the platform again.
                </p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <Btn variant="outline" onClick={() => setUserToUnban(null)} style={{ flex: 1, padding: '0.75rem' }}>Cancel</Btn>
                  <Btn variant="success" onClick={() => { handleUserAction(userToUnban.id, 'unban'); setUserToUnban(null); showToast(`Successfully unbanned ${userToUnban.username}!`, 'success'); }} style={{ flex: 1, padding: '0.75rem' }}>Yes, Unban</Btn>
                </div>
              </div>
            </div>
          )}

          {/* ── CONTRIBUTORS ──────────────────────────────────────────────────── */}
          {activeTab === 'contributors' && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>
                  Displays everyone who has forked resources from the website
                </p>
                <Btn variant="outline" onClick={loadContributors} disabled={ghLoading} style={{ fontSize: '0.78rem' }}>
                  {ghLoading ? (
                    <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg> Loading...</>
                  ) : (
                    <><svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg> Refresh</>
                  )}
                </Btn>
              </div>

              {ghError && (
                <div style={{ padding: '1rem', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                  ⚠️ {ghError}
                </div>
              )}

              {/* Loading skeleton */}
              {ghLoading && !ghData && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ background: 'rgba(20,24,32,0.8)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '14px', padding: '1.5rem', height: '80px' }} />
                  ))}
                </div>
              )}

              {ghData && (
                <>
                  {/* ── Summary Stats ── */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.75rem', marginBottom: '2rem' }}>
                    {[
                      { label: 'Resources Scanned', value: ghData.summary.total_resources, icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>, color: '#818cf8' },
                      { label: 'Total Forks', value: ghData.summary.total_forks, icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"></path><path d="M12 12v3"></path></svg>, color: '#06b6d4' },
                      { label: 'Unique Forkers', value: ghData.summary.unique_forkers, icon: <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>, color: '#34d399' },
                    ].map(({ label, value, icon, color }) => (
                      <div key={label} style={{ background: '#ffffff', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ fontSize: '1.1rem' }}>{icon}</div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color, fontFamily: 'var(--font-display)', lineHeight: 1 }}>{value}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontWeight: 500 }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  {/* ── Per-Resource Fork View ── */}
                  <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7 }}>
                    Resources & Forks
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
                    {(() => {
                      const cResPerPage = 5;
                      const resourcesList = ghData.resources?.filter(r => r.repoInfo) || [];
                      const totalCResPages = Math.ceil(resourcesList.length / cResPerPage);
                      const currentCRes = resourcesList.slice((contribResourcePage - 1) * cResPerPage, contribResourcePage * cResPerPage);
                      return (
                        <>
                          {currentCRes.map(r => {
                            const appResource = allResources.find(ar => ar.id === r.id);
                            const resourceOwner = users.find(u => u.id === appResource?.contributor_id);
                            const isOwnerBanned = resourceOwner?.bio === '__BANNED__';
                            
                            return (
                            <div key={r.id} style={{ background: isOwnerBanned ? 'rgba(239, 68, 68, 0.02)' : '#ffffff', border: isOwnerBanned ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--border)', borderRadius: '12px', padding: '1rem 1.25rem', opacity: isOwnerBanned ? 0.7 : 1 }}>
                              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: r.forkers.length > 0 ? '0.75rem' : 0 }}>
                                <div>
                                  <a href={r.github_url} target="_blank" rel="noopener noreferrer"
                                    style={{ color: isOwnerBanned ? '#ef4444' : 'var(--text-primary)', fontWeight: 700, fontSize: '0.88rem', textDecoration: isOwnerBanned ? 'line-through' : 'none' }}>
                                    {r.title} ↗ {isOwnerBanned && <span style={{ fontSize: '0.65rem', fontWeight: 'bold', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', textDecoration: 'none', display: 'inline-block' }}>BANNED</span>}
                                  </a>
                                  <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '2px', textDecoration: isOwnerBanned ? 'line-through' : 'none' }}>
                                    {r.owner}/{r.repo}
                                  </div>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, alignItems: 'center' }}>
                                  <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(99,102,241,0.1)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                    {r.repoInfo.stargazers_count}
                                  </span>
                                  <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(6,182,212,0.1)', color: '#06b6d4', border: '1px solid rgba(6,182,212,0.2)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"></path><path d="M12 12v3"></path></svg>
                                    {r.repoInfo.forks_count} forks
                                  </span>
                                </div>
                              </div>

                              {/* Forkers avatars */}
                              {r.forkers.length > 0 ? (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>Forked by:</span>
                                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                                    {r.forkers.map(f => {
                                      const isBanned = users.some(u => u.username === f.login && u.bio === '__BANNED__');
                                      return (
                                        <a key={f.login} href={f.profile_url} target="_blank" rel="noopener noreferrer"
                                          title={isBanned ? `${f.login} (Banned)` : f.login} style={{ textDecoration: 'none' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '2px 8px 2px 2px', background: isBanned ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255,255,255,0.04)', border: isBanned ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', opacity: isBanned ? 0.7 : 1 }}>
                                            <img src={f.avatar_url} alt={f.login} width={18} height={18}
                                              style={{ borderRadius: '50%', objectFit: 'cover', filter: isBanned ? 'grayscale(100%)' : 'none' }}
                                              onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${f.login}&background=${isBanned ? 'ef4444' : '6366f1'}&color=fff&size=18`; }}
                                            />
                                            <span style={{ color: isBanned ? '#ef4444' : 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: 500, textDecoration: isBanned ? 'line-through' : 'none' }}>{f.login}</span>
                                          </div>
                                        </a>
                                      );
                                    })}
                                  </div>
                                </div>
                              ) : (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontStyle: 'italic' }}>
                                  No forks tracked yet
                                </div>
                              )}
                            </div>
                          );
                          })}
                          {totalCResPages > 1 && (
                            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '0.5rem' }}>
                              <Btn variant="previous" onClick={() => setContribResourcePage(p => Math.max(1, p - 1))} disabled={contribResourcePage === 1} style={{ padding: '0.4rem 1rem' }}>Previous</Btn>
                              <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>Page {contribResourcePage} of {totalCResPages}</span>
                              <Btn variant="next" onClick={() => setContribResourcePage(p => Math.min(totalCResPages, p + 1))} disabled={contribResourcePage === totalCResPages} style={{ padding: '0.4rem 1rem' }}>Next</Btn>
                            </div>
                          )}
                        </>
                      );
                    })()}

                    {ghData.resources?.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
                          <svg width="48" height="48" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                        </div>
                        <p>No approved resources found. Approve some resources first.</p>
                      </div>
                    )}
                  </div>

                  {/* ── Leaderboard ── */}
                  {ghData.leaderboard?.length > 0 && (
                    <>
                      <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.7 }}>
                        Top Forkers Leaderboard
                      </h3>
                      {(() => {
                        const lPerPage = 5;
                        const totalLPages = Math.ceil(ghData.leaderboard.length / lPerPage);
                        const currentL = ghData.leaderboard.slice((contribLeaderboardPage - 1) * lPerPage, contribLeaderboardPage * lPerPage);
                        return (
                          <>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '0.75rem' }}>
                              {currentL.map((ghUser, idx) => {
                                const isBanned = users.some(u => u.username === ghUser.login && u.bio === '__BANNED__');
                                return (
                                <a key={ghUser.login} href={ghUser.profile_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                  <div style={{ background: isBanned ? 'rgba(239, 68, 68, 0.05)' : '#ffffff', border: isBanned ? '1px solid rgba(239, 68, 68, 0.3)' : (idx === 0 && contribLeaderboardPage === 1 ? '1px solid #2ec4b6' : '1px solid var(--border)'), borderRadius: '12px', padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.9rem', boxShadow: idx === 0 && contribLeaderboardPage === 1 ? '0 4px 10px rgba(46, 196, 182, 0.1)' : 'none', opacity: isBanned ? 0.7 : 1 }}>
                                    <div style={{ minWidth: 28, height: 28, borderRadius: '50%', background: isBanned ? 'rgba(239,68,68,0.1)' : (idx === 0 && contribLeaderboardPage === 1 ? 'linear-gradient(135deg, #1f6fb2, #2ec4b6)' : 'rgba(0,0,0,0.05)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700, color: isBanned ? '#ef4444' : (idx === 0 && contribLeaderboardPage === 1 ? '#fff' : 'var(--text-muted)'), border: idx > 0 || contribLeaderboardPage > 1 ? '1px solid rgba(0,0,0,0.08)' : 'none', flexShrink: 0 }}>
                                      #{((contribLeaderboardPage - 1) * lPerPage) + idx + 1}
                                    </div>
                                    <img src={ghUser.avatar_url} alt={ghUser.login} width={36} height={36}
                                      style={{ borderRadius: '50%', objectFit: 'cover', flexShrink: 0, filter: isBanned ? 'grayscale(100%)' : 'none' }}
                                      onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${ghUser.login}&background=${isBanned ? 'ef4444' : '1f6fb2'}&color=fff`; }}
                                    />
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ color: isBanned ? '#ef4444' : 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', textDecoration: isBanned ? 'line-through' : 'none' }}>{ghUser.login} {isBanned && <span style={{ fontSize: '0.65rem', fontWeight: 'bold', background: '#ef4444', color: 'white', padding: '2px 6px', borderRadius: '4px', marginLeft: '6px', textDecoration: 'none', display: 'inline-block' }}>BANNED</span>}</div>
                                      <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textDecoration: isBanned ? 'line-through' : 'none' }}>Forked {ghUser.count} resource{ghUser.count !== 1 ? 's' : ''}</div>
                                    </div>
                                    <span style={{ padding: '0.2rem 0.6rem', background: isBanned ? 'rgba(239, 68, 68, 0.1)' : 'rgba(46, 196, 182, 0.1)', color: isBanned ? '#ef4444' : '#2ec4b6', border: isBanned ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(46, 196, 182, 0.2)', borderRadius: '20px', fontSize: '0.7rem', fontWeight: 700, flexShrink: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                      <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="18" r="3"></circle><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="6" r="3"></circle><path d="M18 9v2c0 .6-.4 1-1 1H7c-.6 0-1-.4-1-1V9"></path><path d="M12 12v3"></path></svg>
                                      {ghUser.count}
                                    </span>
                                  </div>
                                </a>
                                );
                              })}
                            </div>
                            {totalLPages > 1 && (
                              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', padding: '1rem', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border)', marginTop: '1rem' }}>
                                <Btn variant="previous" onClick={() => setContribLeaderboardPage(p => Math.max(1, p - 1))} disabled={contribLeaderboardPage === 1} style={{ padding: '0.4rem 1rem' }}>Previous</Btn>
                                <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>Page {contribLeaderboardPage} of {totalLPages}</span>
                                <Btn variant="next" onClick={() => setContribLeaderboardPage(p => Math.min(totalLPages, p + 1))} disabled={contribLeaderboardPage === totalLPages} style={{ padding: '0.4rem 1rem' }}>Next</Btn>
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {/* ── SETTINGS ─────────────────────────────────────────────────────── */}
          {activeTab === 'settings' && (
            <div style={{ maxWidth: '600px' }}>
              <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '1.25rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  Admin Account
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', minWidth: '80px' }}>Email</span>
                    <span style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 600 }}>{adminUser?.email}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', minWidth: '80px' }}>Role</span>
                    <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(52,211,153,0.1)', color: '#34d399', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                      ADMIN
                    </span>
                  </div>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '2rem', marginBottom: '1.5rem', borderRadius: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: 700, fontFamily: 'var(--font-display)', marginBottom: '1.25rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                  Change Password
                </h3>
                {pwMessage.text && (
                  <div style={{
                    padding: '0.85rem 1.2rem', borderRadius: '10px', marginBottom: '1.25rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px',
                    background: pwMessage.type === 'success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                    color: pwMessage.type === 'success' ? '#10b981' : '#f87171',
                    border: `1px solid ${pwMessage.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                  }}>
                    {pwMessage.type === 'success' ? (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                    ) : (
                      <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                    )}
                    {pwMessage.text}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ position: 'relative' }}>
                    <input type={showNewPw ? 'text' : 'password'} placeholder="New password (min 8 chars)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="input-field" style={{ paddingRight: '3rem' }} />
                    <button type="button" onClick={() => setShowNewPw(!showNewPw)} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {showNewPw ? (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                      ) : (
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                      )}
                    </button>
                  </div>
                  <input type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-field" />
                  <Btn onClick={async () => {
                    if (newPassword.length < 8) { setPwMessage({ type: 'error', text: 'Password must be at least 8 characters' }); return; }
                    if (newPassword !== confirmPassword) { setPwMessage({ type: 'error', text: 'Passwords do not match' }); return; }
                    setPwLoading(true); setPwMessage({ type: '', text: '' });
                    // Note: Assuming supabase is imported globally or via hook in your actual code
                    const { error } = await supabase.auth.updateUser({ password: newPassword });
                    if (error) { setPwMessage({ type: 'error', text: error.message }); }
                    else { setPwMessage({ type: 'success', text: 'Password updated successfully!' }); setNewPassword(''); setConfirmPassword(''); }
                    setPwLoading(false);
                  }} disabled={!newPassword || !confirmPassword || pwLoading}>
                    {pwLoading ? (
                      <>Updating...</>
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                        Update Password
                      </>
                    )}
                  </Btn>
                </div>
              </div>

            </div>
          )}
        </main>
      </div>

      {/* DELETE EVENT MODAL */}
      {eventToDelete && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(5,8,16,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div className="glass-card" style={{ background: '#ffffff', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', border: '1px solid var(--border)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', border: '1px solid rgba(239,68,68,0.3)' }}>
              <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            </div>
            <h3 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 800, margin: '0 0 0.5rem 0' }}>Delete Event</h3>
            <p style={{ color: '#475569', margin: '0 0 2rem 0', lineHeight: 1.5 }}>
              Are you sure you want to delete this event? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              <Btn variant="outline" onClick={() => setEventToDelete(null)} style={{ flex: 1, padding: '0.75rem', fontSize: '1rem' }}>Cancel</Btn>
              <Btn variant="danger" onClick={confirmDeleteEvent} style={{ flex: 1, padding: '0.75rem', fontSize: '1rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>Yes, Delete</Btn>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div style={{
          position: 'fixed', top: '2rem', right: '2rem', zIndex: 9999,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(16px)',
          color: '#0f172a',
          padding: '1rem 1.25rem',
          borderRadius: '12px',
          boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05)',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontWeight: 600,
          fontSize: '0.95rem',
          animation: 'toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          overflow: 'hidden'
        }}>
          {/* Accent Line on the left */}
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: toast.type === 'error' ? '#ef4444' : '#10b981' }}></div>

          {/* Icon in a glowing circle */}
          <div style={{
            width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
            background: toast.type === 'error' ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)',
            color: toast.type === 'error' ? '#ef4444' : '#10b981',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: toast.type === 'error' ? '0 0 12px rgba(239,68,68,0.3)' : '0 0 12px rgba(16,185,129,0.3)'
          }}>
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              {toast.type === 'error' ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path>
              )}
            </svg>
          </div>

          <div style={{ paddingRight: '0.5rem', letterSpacing: '-0.2px' }}>
            {toast.message}
          </div>

          <style>{`
            @keyframes toastSlideIn {
              from { transform: translateX(100%) scale(0.9); opacity: 0; }
              to { transform: translateX(0) scale(1); opacity: 1; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}

// ── Countdown Timer Component ───────────────────────────────────────────────────
function CountdownTimer({ targetDate, onExpire }) {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    if (difference > 0) {
      return {
        expired: false,
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return { expired: true };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [expiredTriggered, setExpiredTriggered] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = calculateTimeLeft();
      setTimeLeft(tl);
      if (tl.expired && !expiredTriggered) {
        setExpiredTriggered(true);
        if (onExpire) onExpire();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate, expiredTriggered, onExpire]);

  if (timeLeft.expired) {
    return <p style={{ color: '#fbbf24', fontSize: '0.75rem', margin: '6px 0 0', fontWeight: 600 }}>⏳ Starting soon / In progress...</p>;
  }

  const format = (num) => String(num).padStart(2, '0');

  const Box = ({ value, label }) => (
    <div style={{
      background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
      border: '1px solid #8b5cf6',
      borderRadius: '8px',
      padding: '0.75rem 0.6rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: '60px',
      minHeight: '60px',
      boxSizing: 'border-box',
      boxShadow: '0 4px 10px -2px rgba(124,58,237,0.4)'
    }}>
      <span style={{ fontSize: '1.4rem', fontWeight: 700, color: '#fff', fontFamily: 'var(--font-display)', lineHeight: 1.1 }}>{format(value)}</span>
      <span style={{ fontSize: '0.55rem', textTransform: 'uppercase', color: 'rgba(255,255,255,0.85)', letterSpacing: '1px', marginTop: '4px', fontWeight: 600, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
      {timeLeft.days !== undefined && (
        <>
          <Box value={timeLeft.days} label="Days" />
          <Box value={timeLeft.hours} label="Hours" />
          <Box value={timeLeft.minutes} label="Mins" />
          <Box value={timeLeft.seconds} label="Secs" />
        </>
      )}
    </div>
  );
}

// ── Shared Event Row Component ────────────────────────────────────────────────
function EventRow({ m, onEdit, onDelete, onOutcome, onRefresh, isPast, onViewOutcome }) {
  const dateObj = new Date(m.date);
  let dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  
  if (m.start_time || m.end_time) {
    const formatTime = (timeStr) => {
      if (!timeStr) return '';
      if (timeStr.toLowerCase().includes('am') || timeStr.toLowerCase().includes('pm')) return timeStr;
      const [h, min] = timeStr.split(':');
      let hours = parseInt(h, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      return `${hours}:${min} ${ampm}`;
    };
    const start = formatTime(m.start_time);
    const end = formatTime(m.end_time);
    if (start && end) {
      dateStr += ` • ${start} to ${end}`;
    } else if (start) {
      dateStr += ` • ${start}`;
    }
  } else {
    dateStr = dateObj.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
  const monthStr = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const dayStr = dateObj.getDate();
  const isCompleted = m.status === 'COMPLETED';
  const coverPhoto = m.cover_image ? m.cover_image.split(',')[0].trim() : null;

  return (
    <div
      className="glass-card event-row-card"
      style={{
        background: '#ffffff',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        display: 'flex',
        overflow: 'hidden',
        cursor: 'default',
        transition: 'transform 0.2s, box-shadow 0.2s',
        boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
        color: 'var(--text-primary)',
        minHeight: '260px',
        fontFamily: 'var(--font-sans, sans-serif)',
        marginBottom: '1rem'
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.05)'; }}
    >
      {/* Left side: Image */}
      <div className="event-row-img-container" style={{ position: 'relative', width: '280px', flexShrink: 0, background: '#f8fafc', display: 'flex', justifyContent: 'center' }}>
        {coverPhoto ? (
          <img src={coverPhoto} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '1rem 0' }} />
        ) : (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
            <span style={{ fontSize: '3rem' }}>🖼️</span>
          </div>
        )}
      </div>

      {/* Right side: Content */}
      <div style={{ flex: 1, padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
        {/* Status Badge */}
        <div style={{ alignSelf: 'flex-start', background: 'var(--bg-secondary, #f1f5f9)', border: '1px solid rgba(31, 111, 178, 0.2)', borderRadius: '20px', padding: '0.35rem 0.85rem', fontSize: '0.75rem', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '0.3px', boxShadow: '0 2px 4px rgba(31, 111, 178, 0.05)' }}>
          <span style={{ background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {isCompleted ? 'Completed' : (isPast ? 'Past' : 'Upcoming')}
          </span>
        </div>

        {/* Title */}
        <h3 style={{ color: 'var(--text-primary, #0f172a)', fontSize: '1.4rem', fontWeight: 700, margin: '0 0 1rem 0', lineHeight: 1.3 }}>
          {m.title}
        </h3>

        {/* Description */}
        <p style={{ color: 'var(--text-muted, #64748b)', fontSize: '1rem', lineHeight: 1.6, margin: '0 0 1.5rem 0', flex: 1 }}>
          {m.description ? (m.description.length > 200 ? m.description.substring(0, 200) + '...' : m.description) : 'No description available for this event.'}
        </p>

        {/* Bottom Section */}
        <div style={{ marginTop: 'auto' }}>
          <div style={{ height: '1px', background: 'var(--border, rgba(0,0,0,0.08))', marginBottom: '1.25rem' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text-muted, #64748b)', fontSize: '0.9rem', fontWeight: 500, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                {dateStr}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                {m.venue}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginLeft: 'auto' }}>
              <Btn variant="outline" onClick={() => onEdit(m)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: 'linear-gradient(135deg, #1f6fb2, #2ec4b6)', color: 'white', border: 'none', boxShadow: '0 2px 4px rgba(31, 111, 178, 0.2)' }}>Edit</Btn>
              {!isCompleted && <Btn variant="success" onClick={() => onOutcome(m)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Add Outcome</Btn>}
              {isCompleted && <Btn variant="outline" onClick={() => onOutcome(m)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', background: '#005b9f', color: 'white', border: 'none', boxShadow: '0 2px 4px rgba(0, 91, 159, 0.2)' }}>Edit Outcome</Btn>}
              <Btn variant="danger" onClick={() => onDelete(m.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Delete</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}