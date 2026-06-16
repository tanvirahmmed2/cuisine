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
const PRIORITY_COLORS = {
  low: 'text-slate-500',
  normal: 'text-pink-600',
  high: 'text-orange-600',
  urgent: 'text-red-600',
};

export default function ControlSupportPage() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [thread, setThread] = useState({ ticket: null, replies: [] });
  const [ticketReply, setTicketReply] = useState('');
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [sendingTicket, setSendingTicket] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchTickets = useCallback(async () => {
    setLoadingTickets(true);
    const url = `/api/control/support${filterStatus ? `?status=${filterStatus}` : ''}`;
    try {
      const res = await axios.get(url, { withCredentials: true });
      setTickets(res.data.data.tickets || []);
    } catch {}
    setLoadingTickets(false);
  }, [filterStatus]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const openTicket = async (id) => {
    setSelectedTicket(id);
    try {
      const res = await axios.get(`/api/control/support?ticketId=${id}`, { withCredentials: true });
      setThread(res.data.data);
    } catch {}
    setTicketReply('');
  };

  const sendTicketReply = async () => {
    if (!ticketReply.trim()) return;
    setSendingTicket(true);
    await axios.post('/api/control/support', { ticket_id: selectedTicket, message: ticketReply }, { withCredentials: true });
    setSendingTicket(false);
    setTicketReply('');
    openTicket(selectedTicket);
  };

  const updateTicketStatus = async (ticketId, status) => {
    await axios.patch('/api/control/support', { ticket_id: ticketId, status }, { withCredentials: true });
    fetchTickets();
    if (selectedTicket === ticketId) openTicket(ticketId);
  };

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
       
        <select
          value={filterStatus}
          onChange={e => { setFilterStatus(e.target.value); setSelectedTicket(null); }}
          className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20"
        >
          <option value="">All statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-220px)]">
        {/* Ticket list */}
        <div className={`w-full md:w-[360px] shrink-0 flex-col gap-2 overflow-y-auto pr-1 ${selectedTicket ? 'hidden md:flex' : 'flex'}`}>
          {loadingTickets ? (
            <div className="text-slate-500 text-sm text-center py-12">Loading…</div>
          ) : tickets.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <div className="text-5xl mb-3 opacity-40">🎫</div>
              <p className="font-medium text-slate-600">No tickets found</p>
            </div>
          ) : tickets.map(t => (
            <button
              key={t.ticket_id}
              onClick={() => openTicket(t.ticket_id)}
              className={`text-left w-full p-4 rounded-xl border transition-all duration-150 ${
                selectedTicket === t.ticket_id
                  ? 'bg-pink-50 border-pink-300'
                  : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-pink-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-sm font-semibold text-slate-900 line-clamp-1">{t.subject}</span>
                <span className={`shrink-0 text-[0.65rem] font-bold uppercase px-2 py-0.5 rounded-full border ${STATUS_COLORS[t.status]}`}>
                  {t.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-slate-500 font-medium mb-1">👤 {t.tenant_name || t.user_name || 'Customer'}</div>
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <span className={`font-semibold ${PRIORITY_COLORS[t.priority]}`}>↑ {t.priority}</span>
                <span>💬 {t.reply_count} replies</span>
                <span>{new Date(t.created_at).toLocaleDateString()}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Thread panel */}
        <div className={`flex-1 bg-white border border-slate-200 shadow-sm rounded-2xl flex-col overflow-hidden ${!selectedTicket ? 'hidden md:flex' : 'flex'}`}>
          {!selectedTicket ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <div className="text-6xl mb-4 opacity-30">💬</div>
              <p className="text-lg font-medium text-slate-600">Select a ticket to view</p>
            </div>
          ) : !thread.ticket ? (
            <div className="flex-1 flex items-center justify-center text-slate-500 text-sm">Loading thread…</div>
          ) : (
            <>
              {/* Thread header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button onClick={() => setSelectedTicket(null)} className="md:hidden text-slate-400 hover:text-slate-600 mt-1">←</button>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 mb-0.5">{thread.ticket.subject}</h2>
                    <div className="text-xs text-slate-500">
                      <span className="text-slate-600 font-bold">{thread.ticket.tenant_name || thread.ticket.user_name || 'Customer'}</span>
                      {' · '}{new Date(thread.ticket.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[0.7rem] font-bold uppercase px-2 py-1 rounded-full border ${STATUS_COLORS[thread.ticket.status]}`}>
                    {thread.ticket.status.replace('_', ' ')}
                  </span>
                  <select
                    value={thread.ticket.status}
                    onChange={e => updateTicketStatus(selectedTicket, e.target.value)}
                    className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 font-semibold"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-4 bg-slate-50/30">
                {/* Original message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-500 flex items-center justify-center text-sm shrink-0">🏢</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-slate-900">{thread.ticket.tenant_name || thread.ticket.user_name || 'Customer'}</span>
                      <span className="text-xs text-slate-500">· Original</span>
                    </div>
                    <div 
                      className="bg-white border border-slate-200 shadow-sm rounded-xl p-3 text-sm text-slate-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: thread.ticket.message }}
                    />
                  </div>
                </div>

                {thread.replies.map(r => (
                  <div key={r.reply_id} className={`flex gap-3 ${r.is_admin ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0 font-bold ${
                      r.is_admin ? 'bg-pink-100 border border-pink-200 text-pink-700' : 'bg-slate-100 border border-slate-200 text-slate-500'
                    }`}>
                      {r.is_admin ? '⚡' : '🏢'}
                    </div>
                    <div className={`flex-1 ${r.is_admin ? 'items-end' : ''} flex flex-col`}>
                      <div className={`flex items-center gap-2 mb-1 ${r.is_admin ? 'flex-row-reverse' : ''}`}>
                        <span className="text-sm font-bold text-slate-900">{r.is_admin ? 'SaaS Admin' : (r.user_name || 'Tenant')}</span>
                        <span className="text-xs text-slate-500 font-medium">{new Date(r.created_at).toLocaleString()}</span>
                      </div>
                      <div 
                        className={`max-w-[85%] rounded-xl p-3 text-sm shadow-sm leading-relaxed ${
                          r.is_admin
                            ? 'bg-pink-50 border border-pink-200 text-pink-900 self-end'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                        dangerouslySetInnerHTML={{ __html: r.message }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply box */}
              {thread.ticket.status !== 'closed' && (
                <div className="p-4 border-t border-slate-200 bg-white flex flex-col gap-3">
                  <TiptapEditor
                    value={ticketReply}
                    onChange={html => setTicketReply(html)}
                   
                  />
                  <button
                    onClick={sendTicketReply}
                    disabled={sendingTicket || !ticketReply.replace(/<[^>]*>?/gm, '').trim()}
                    className="btn-custom-primary px-5 py-2 text-sm self-end"
                  >
                    {sendingTicket ? '…' : 'Reply'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
