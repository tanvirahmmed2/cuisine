'use client';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import TiptapEditor from '@/components/ui/TiptapEditor';

const STATUS_COLORS = {
  open: 'bg-pink-50 text-pink-700 border-pink-200',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  closed: 'bg-slate-50 text-slate-700 border-slate-200',
};

export default function ControlContactPage() {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [contactReply, setContactReply] = useState('');
  const [loadingContacts, setLoadingContacts] = useState(true);
  const [sendingContact, setSendingContact] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchContacts = useCallback(async () => {
    setLoadingContacts(true);
    const url = `/api/control/contact${filterStatus ? `?status=${filterStatus}` : ''}`;
    try {
      const res = await axios.get(url, { withCredentials: true });
      setContacts(res.data.data.contacts || []);
    } catch {}
    setLoadingContacts(false);
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts, filterStatus]);

  const openContact = async (id) => {
    setSelectedContact(id);
    setContactReply('');
  };

  const sendContactReply = async () => {
    if (!contactReply.trim() || !selectedContact) return;
    setSendingContact(true);
    await axios.post('/api/control/contact', { contact_id: selectedContact, reply_message: contactReply }, { withCredentials: true });
    setSendingContact(false);
    setContactReply('');
    fetchContacts();
    setSelectedContact(null);
  };

  const updateContactStatus = async (contactId, status) => {
    await axios.patch('/api/control/contact', { contact_id: contactId, status }, { withCredentials: true });
    fetchContacts();
  };

  const getSelectedContactData = () => contacts.find(c => c.contact_id === selectedContact);

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Contact Messages</h1>
          <p className="text-sm text-slate-500 mt-1">Manage public website contact requests</p>
        </div>
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setSelectedContact(null); }}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-220px)]">
        {/* Contact list */}
        <div className={`w-full md:w-[360px] shrink-0 flex-col gap-2 overflow-y-auto pr-1 ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
          {loadingContacts ? (
            <div className="text-slate-500 text-sm text-center py-12">Loading…</div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <div className="text-5xl mb-3 opacity-40">📨</div>
              <p className="font-medium text-slate-600">No contact messages found</p>
            </div>
          ) : contacts.map(c => (
            <button
              key={c.contact_id}
              onClick={() => openContact(c.contact_id)}
              className={`text-left w-full p-4 rounded-xl border transition-all duration-150 ${
                selectedContact === c.contact_id
                  ? 'bg-pink-50 border-pink-300'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-pink-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-slate-900 line-clamp-1">{c.name}</span>
                <span className={`shrink-0 text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[c.status]}`}>
                  {c.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium mb-1 truncate">📧 {c.email}</div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1.5">
                <span className="line-clamp-1 italic">"{c.message}"</span>
              </div>
            </button>
          ))}
        </div>

        {/* Contact Thread panel */}
        <div className={`flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl flex-col overflow-hidden ${!selectedContact ? 'hidden md:flex' : 'flex'}`}>
          {!selectedContact ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <div className="text-6xl mb-4 opacity-30">📨</div>
              <p className="text-lg font-medium text-slate-600">Select a message to view</p>
            </div>
          ) : (
            (() => {
              const c = getSelectedContactData();
              if (!c) return null;
              return (
                <>
                  <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <button onClick={() => setSelectedContact(null)} className="md:hidden text-slate-400 hover:text-slate-600 mt-1">←</button>
                      <div>
                        <h2 className="text-lg font-bold text-slate-900 mb-0.5">Contact Request</h2>
                        <div className="text-xs text-slate-500">
                          <span className="text-slate-600 font-bold">{c.name}</span>
                          {' · '}{new Date(c.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-[0.7rem] font-bold uppercase px-2 py-1 rounded-full border ${STATUS_COLORS[c.status]}`}>
                        {c.status.replace('_', ' ')}
                      </span>
                      <select
                        value={c.status}
                        onChange={e => updateContactStatus(selectedContact, e.target.value)}
                        className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-semibold"
                      >
                        <option value="open">Open</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-slate-50/30">
                    <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4 border-b border-slate-100 pb-4">
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Name</div>
                          <div className="text-sm text-slate-900 font-medium">{c.name}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Email</div>
                          <div className="text-sm text-slate-900 font-medium">{c.email}</div>
                        </div>
                        <div>
                          <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Phone</div>
                          <div className="text-sm text-slate-900 font-medium">{c.phone || 'N/A'}</div>
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-2">Message</div>
                        <div 
                          className="text-sm text-slate-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: c.message }}
                        />
                      </div>
                    </div>
                  </div>

                  {c.status !== 'resolved' && (
                    <div className="p-4 border-t border-slate-200 bg-white flex flex-col gap-3">
                      <div className="text-xs text-slate-500 mb-1">Reply via Email to <span className="text-pink-600 font-bold">{c.email}</span>:</div>
                      <div className="flex flex-col gap-3">
                        <TiptapEditor
                          value={contactReply}
                          onChange={html => setContactReply(html)}
                         
                        />
                        <button
                          onClick={sendContactReply}
                          disabled={sendingContact || !contactReply.replace(/<[^>]*>?/gm, '').trim()}
                          className="btn-custom-primary px-5 py-2 text-sm self-end"
                        >
                          {sendingContact ? 'Sending...' : 'Send & Resolve'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
