'use client'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import TiptapEditor from '@/components/forms/TiptapEditor'
import { MdAdd, MdClose, MdArrowBack, MdSupportAgent } from 'react-icons/md'

const ProfileSupportPage = () => {
  const [tickets, setTickets] = useState([])
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [activeTicket, setActiveTicket] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  // New Ticket State
  const [showNewTicket, setShowNewTicket] = useState(false)
  const [newSubject, setNewSubject] = useState('')
  const [newInitialMsg, setNewInitialMsg] = useState('')
  const [creating, setCreating] = useState(false)

  const fetchTickets = async () => {
    try {
      const res = await axios.get('/api/support/ticket')
      if (res.data.success) {
        setTickets(res.data.payload || [])
      }
    } catch (error) {
      console.error('Failed to load tickets', error)
    } finally {
      setLoadingTickets(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  useEffect(() => {
    if (activeTicket) {
      fetchMessages(activeTicket.id)
    }
  }, [activeTicket])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchMessages = async (ticketId) => {
    setLoadingMessages(true)
    try {
      const res = await axios.get(`/api/support/message?ticket_id=${ticketId}`)
      if (res.data.success) {
        setMessages(res.data.payload)
      }
    } catch (error) {
      toast.error('Failed to load messages')
    } finally {
      setLoadingMessages(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage || newMessage === '<p></p>') return
    setSending(true)
    try {
      const res = await axios.post('/api/support/message', {
        ticket_id: activeTicket.id,
        message: newMessage
      })
      if (res.data.success) {
        setMessages(prev => [...prev, res.data.payload])
        setNewMessage('')
        // Refresh ticket timestamp/list
        setTickets(prev => prev.map(t => t.id === activeTicket.id ? { ...t, updated_at: new Date().toISOString() } : t))
      }
    } catch (error) {
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const handleCreateTicket = async (e) => {
    e.preventDefault()
    if (!newSubject || !newInitialMsg || newInitialMsg === '<p></p>') return
    setCreating(true)
    try {
      const res = await axios.post('/api/support/ticket', {
        subject: newSubject,
        initial_message: newInitialMsg
      })
      if (res.data.success) {
        setTickets(prev => [res.data.payload, ...prev])
        setShowNewTicket(false)
        setActiveTicket(res.data.payload)
        setNewSubject('')
        setNewInitialMsg('')
        toast.success("Support ticket created")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create ticket')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold text-gray-900 tracking-tight'>Support Center</h1>
        <p className='text-gray-500 text-sm mt-1'>We&apos;re here to help you.</p>
      </div>

      <div className="flex flex-col md:flex-row bg-white rounded-2xl border border-gray-200 overflow-hidden min-h-[60vh] max-h-[75vh]">
        {/* Left Sidebar - Tickets List */}
        <div className={`w-full md:w-80 border-r border-gray-100 flex flex-col bg-gray-50/30 ${
          (activeTicket || showNewTicket) ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center">
            <h2 className="text-sm font-bold text-gray-800 tracking-tight">Your Tickets</h2>
            <button 
              onClick={() => {
                setActiveTicket(null)
                setShowNewTicket(true)
              }}
              className="flex items-center gap-1 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-600 hover:text-pink-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              <MdAdd size={16} /> New Ticket
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loadingTickets ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-pink-500"></div>
              </div>
            ) : tickets.length > 0 ? (
              tickets.map(ticket => {
                const isActive = activeTicket?.id === ticket.id && !showNewTicket
                return (
                  <div 
                    key={ticket.id} 
                    onClick={() => {
                      setShowNewTicket(false)
                      setActiveTicket(ticket)
                    }}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      isActive 
                        ? 'bg-pink-500 border-pink-500 text-white' 
                        : 'bg-white border-gray-100 hover:border-pink-200'
                    }`}
                  >
                    <h3 className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-gray-800'}`}>{ticket.subject}</h3>
                    <div className="flex justify-between items-center mt-2">
                      <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : ticket.status === 'open' 
                            ? 'bg-emerald-50 text-emerald-600' 
                            : 'bg-gray-100 text-gray-500'
                      }`}>
                        {ticket.status}
                      </span>
                      <p className={`text-[9px] font-medium ${isActive ? 'text-white/80' : 'text-gray-400'}`}>
                        {new Date(ticket.updated_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="p-6 text-center text-gray-400 text-xs font-medium border border-dashed border-gray-200 rounded-xl bg-white">
                No active support tickets. Click &quot;New Ticket&quot; to create one.
              </div>
            )}
          </div>
        </div>

        {/* Right Pane - Chat / Form / Placeholder */}
        <div className={`flex-1 flex flex-col bg-white min-h-[50vh] ${
          (!activeTicket && !showNewTicket) ? 'hidden md:flex' : 'flex'
        }`}>
          {showNewTicket ? (
            <div className="flex-1 flex flex-col bg-white">
              {/* Create Ticket Header */}
              <div className="p-6 border-b border-gray-100 bg-white flex items-center">
                <button 
                  type="button"
                  onClick={() => setShowNewTicket(false)} 
                  className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-800 transition-colors mr-2 cursor-pointer"
                >
                  <MdArrowBack size={20} />
                </button>
                <div>
                  <h2 className="text-sm font-bold text-gray-900 tracking-tight">Create Support Ticket</h2>
                  <p className="text-gray-500 text-xs mt-0.5">Let us know how we can help you today.</p>
                </div>
                {/* Cancel button for desktop */}
                <button 
                  type="button"
                  onClick={() => setShowNewTicket(false)}
                  className="hidden md:flex ml-auto items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 transition-colors cursor-pointer"
                >
                  <MdClose size={16} /> Cancel
                </button>
              </div>

              {/* Create Ticket Form */}
              <form onSubmit={handleCreateTicket} className="flex-1 p-6 overflow-y-auto space-y-6 max-w-2xl">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Subject</label>
                  <input 
                    type="text" 
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    required
                    placeholder="e.g., Issue with my recent order delivery"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-500/5 transition-all text-sm text-gray-800 font-medium" 
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Detailed Message</label>
                  <TiptapEditor
                    content={newInitialMsg}
                    onChange={setNewInitialMsg}
                    placeholder="Describe your issue in detail..."
                  />
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    type="submit"
                    disabled={creating || !newSubject || !newInitialMsg || newInitialMsg === '<p></p>'}
                    className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {creating ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </form>
            </div>
          ) : activeTicket ? (
            <div className="flex-1 flex flex-col bg-white">
              {/* Ticket Chat Header */}
              <div className="p-6 border-b border-gray-100 bg-white flex items-center justify-between">
                <div className="flex items-center">
                  <button 
                    onClick={() => setActiveTicket(null)} 
                    className="md:hidden p-2 -ml-2 text-gray-500 hover:text-gray-800 transition-colors mr-2 cursor-pointer"
                  >
                    <MdArrowBack size={20} />
                  </button>
                  <div>
                    <h2 className="text-sm font-bold text-gray-900 tracking-tight">{activeTicket.subject}</h2>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">Ticket #{activeTicket.id}</p>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  activeTicket.status === 'open' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'
                }`}>
                  {activeTicket.status}
                </span>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50/20">
                {loadingMessages ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isUser = msg.sender_type === 'user';
                    return (
                      <div 
                        key={msg.id || idx} 
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                      >
                        <div className={`max-w-[85%] rounded-2xl p-4 ${
                          isUser ? 'bg-pink-500 text-white rounded-tr-none' : 'bg-white border border-gray-100 rounded-tl-none'
                        }`}>
                          <div 
                            className={`prose prose-sm max-w-none break-words ${isUser ? 'prose-invert text-white' : 'text-gray-800'}`}
                            dangerouslySetInnerHTML={{ __html: msg.message }}
                          />
                        </div>
                        <span className="text-[9px] font-bold uppercase text-gray-400 tracking-widest mt-1.5 px-1">
                          {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • {isUser ? 'You' : 'Support'}
                        </span>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply Composer */}
              {activeTicket.status === 'open' ? (
                <div className="p-6 bg-white border-t border-gray-100 flex flex-col gap-4">
                  <TiptapEditor
                    content={newMessage}
                    onChange={setNewMessage}
                    placeholder="Type your reply here..."
                  />
                  <div className="flex justify-end">
                    <button 
                      onClick={handleSendMessage}
                      disabled={sending || !newMessage || newMessage === '<p></p>'}
                      className="px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {sending ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 bg-gray-50 border-t border-gray-100 text-center text-xs font-semibold text-gray-500">
                  This support ticket has been closed.
                </div>
              )}
            </div>
          ) : (
            /* Placeholder */
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-300">
                <MdSupportAgent size={32} />
              </div>
              <p className="font-bold text-base text-gray-800 tracking-tight">Support Chat</p>
              <p className="text-xs mt-1 text-gray-500 text-center max-w-sm">Select a ticket from the list or click &quot;New Ticket&quot; to open a new support request.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfileSupportPage
