'use client';

import { useState } from 'react';

export default function WhatsAppVotingCampaign() {
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState('');

  async function sendCampaign() {
    if (sending) return;
    setSending(true);
    setFeedback('');
    try {
      const response = await fetch('/api/admin/student-projects/whatsapp', {
        method: 'POST',
        headers: { 'X-WhatsApp-Campaign': 'send' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Could not send the campaign.');
      setFeedback(`${data.accepted} accepted by WhatsApp · ${data.alreadyClaimed} already processed or pending · ${data.invalidPhone} missing or invalid phone · ${data.failed} failed · ${data.uncertain} awaiting verification`);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mb-5">
      <button type="button" disabled={sending} onClick={sendCampaign} className="cursor-pointer rounded-lg border border-emerald-300 bg-emerald-50 px-4 py-2 text-sm font-bold text-emerald-900 hover:bg-emerald-100 disabled:opacity-50">
        {sending ? 'Sending WhatsApp Links…' : 'Send WhatsApp Voting Links'}
      </button>
      <p className="mt-2 text-sm text-slate-600">Sends the voting announcement and each project’s link to its registered WhatsApp number.</p>
      {feedback && <p role="status" className="mt-3 text-sm text-slate-800">{feedback}</p>}
    </div>
  );
}
