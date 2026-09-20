'use client';

import React, { useState, useMemo } from 'react';
import {
  Mail,
  MailOpen,
  Search,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  Send,
  X,
  User,
  Calendar,
  Globe,
  RefreshCw,
  ArrowUpRight,
  Inbox,
  Sparkles,
} from 'lucide-react';

export interface MessageItem {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  is_read: boolean;
  ip_address?: string;
  created_at: string;
}

const INITIAL_MESSAGES: MessageItem[] = [
  {
    id: 'msg-001',
    sender_name: 'Alexandre Dubois',
    sender_email: 'alex.dubois@techventure.io',
    subject: 'Senior Fullstack Architect Role - Remote Opportunity',
    message: `Hi Saeful,\n\nI reviewed your DevCraft portfolio and was extremely impressed by your micro-frontend architecture and telemetry pipeline case studies.\n\nWe are currently scaling our core cloud platform at TechVenture (Series B funded) and are looking for a Senior Technical Lead / Architect. This is a 100% remote position with competitive compensation in USD.\n\nWould you be open for a short introductory call this week?\n\nBest regards,\nAlexandre Dubois\nHead of Engineering Talent`,
    is_read: false,
    ip_address: '103.252.12.84',
    created_at: '2026-09-20 14:15',
  },
  {
    id: 'msg-002',
    sender_name: 'Sarah Jenkins',
    sender_email: 'sarah.j@designscale.co',
    subject: 'Inquiry: Enterprise CMS & Next.js Re-architecture',
    message: `Hello Saeful,\n\nOur company is planning to migrate our legacy WordPress monolith to Next.js 15 App Router and Supabase. We need a consultant to conduct a system audit and lead the migration roadmap.\n\nCould you send over your consulting rates and availability for Q4 2026?\n\nThanks,\nSarah`,
    is_read: false,
    ip_address: '180.252.201.11',
    created_at: '2026-09-19 09:30',
  },
  {
    id: 'msg-003',
    sender_name: 'Budi Pratama',
    sender_email: 'budi.pratama@indotech.id',
    subject: 'Diskusi Kolaborasi Proyek AI Vector Search',
    message: `Halo Mas Saeful,\n\nSaya melihat artikel Anda mengenai Semantic Vector Router dengan Qdrant dan FastAPI. Sangat inspiratif!\n\nPerusahaan kami sedang mengembangkan mesin pencari internal berbasis AI untuk dokumen hukum. Apakah Mas Saeful menerima proyek freelance consulting atau mentorship untuk tim engineering kami?\n\nTerima kasih,\nBudi Pratama`,
    is_read: true,
    ip_address: '36.85.12.4',
    created_at: '2026-09-15 17:45',
  },
  {
    id: 'msg-004',
    sender_name: 'Michael Chen',
    sender_email: 'm.chen@devops-global.com',
    subject: 'Feedback on Rust Telemetry Article',
    message: `Great read on microsecond telemetry pipelines in Rust! Just wanted to drop a quick note saying the WebSockets memory safety section helped us resolve a leak in our staging environment.\n\nKeep up the great technical writing!`,
    is_read: true,
    ip_address: '172.56.21.99',
    created_at: '2026-09-10 11:20',
  },
];

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>(INITIAL_MESSAGES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');

  // Modal States
  const [selectedMessage, setSelectedMessage] = useState<MessageItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const telemetry = useMemo(() => {
    const total = messages.length;
    const unread = messages.filter((m) => !m.is_read).length;
    const read = total - unread;
    return { total, unread, read };
  }, [messages]);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch =
        msg.sender_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.sender_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'unread' && !msg.is_read) ||
        (statusFilter === 'read' && msg.is_read);

      return matchesSearch && matchesStatus;
    });
  }, [messages, searchQuery, statusFilter]);

  const handleOpenDetail = (msg: MessageItem) => {
    setSelectedMessage(msg);
    if (!msg.is_read) {
      // Auto mark as read upon viewing detail
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );
    }
  };

  const handleToggleReadStatus = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: !m.is_read } : m))
    );
  };

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      setMessages((prev) => prev.filter((m) => m.id !== deleteTargetId));
      if (selectedMessage?.id === deleteTargetId) {
        setSelectedMessage(null);
      }
      setDeleteTargetId(null);
    }
  };

  const handleReplyEmail = (email: string, subject: string) => {
    const mailtoUrl = `mailto:${email}?subject=Re: ${encodeURIComponent(subject)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="relative min-h-screen bg-[#0f131c] text-[#dfe2ef] p-6 lg:p-8 font-sans">
      {/* Ambient Accent Lighting */}
      <div className="absolute top-0 right-1/3 w-96 h-48 bg-[#4d8eff]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Header Breadcrumb */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8">
        <div>
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#8c909f] font-semibold">
            <span>CMS Studio</span>
            <span>/</span>
            <span className="text-[#adc6ff]">Contact Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#F9FAFB] tracking-tight mt-1">
            Messages Inbox
          </h1>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Manage inquiry submissions, recruiter proposals, and technical consultation requests.
          </p>
        </div>

        <button
          onClick={() => setMessages(INITIAL_MESSAGES)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1c1f29] hover:bg-[#262a34] text-[#dfe2ef] text-xs font-semibold transition-all border border-[#1F293D] shadow-sm w-fit"
        >
          <RefreshCw className="w-4 h-4 text-[#adc6ff]" />
          <span>Reset Sample Data</span>
        </button>
      </div>

      {/* Telemetry KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">
              Total Inquiries
            </span>
            <p className="text-3xl font-black text-[#F9FAFB] mt-1">{telemetry.total}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#4d8eff]/10 text-[#adc6ff] flex items-center justify-center">
            <Inbox className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">
              Unread Messages
            </span>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-3xl font-black text-[#EF4444]">{telemetry.unread}</p>
              {telemetry.unread > 0 && (
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] animate-ping" />
              )}
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#93000a]/30 text-[#ffb4ab] flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-[#1c1f29] p-5 rounded-xl border border-[#1F293D] shadow-md flex items-center justify-between">
          <div>
            <span className="text-xs text-[#8c909f] uppercase tracking-wider font-semibold">
              Processed / Read
            </span>
            <p className="text-3xl font-black text-[#4edea3] mt-1">{telemetry.read}</p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-[#00a572]/20 text-[#4edea3] flex items-center justify-center">
            <MailOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Inbox Panel */}
      <div className="bg-[#1c1f29] rounded-xl border border-[#1F293D] p-5 shadow-lg">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#1F293D]">
          <div className="flex items-center bg-[#0a0e17] px-3 py-2 rounded-lg border border-[#1F293D] w-full md:w-80">
            <Search className="w-4 h-4 text-[#8c909f]" />
            <input
              type="text"
              placeholder="Search sender, email, or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#F9FAFB] px-2 focus:outline-none placeholder:text-[#8c909f] w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8c909f]" />
            <div className="flex items-center bg-[#0a0e17] p-1 rounded-lg border border-[#1F293D]">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  statusFilter === 'all'
                    ? 'bg-[#4d8eff] text-[#00285d]'
                    : 'text-[#8c909f] hover:text-[#dfe2ef]'
                }`}
              >
                All ({telemetry.total})
              </button>
              <button
                onClick={() => setStatusFilter('unread')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  statusFilter === 'unread'
                    ? 'bg-[#4d8eff] text-[#00285d]'
                    : 'text-[#8c909f] hover:text-[#dfe2ef]'
                }`}
              >
                Unread ({telemetry.unread})
              </button>
              <button
                onClick={() => setStatusFilter('read')}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  statusFilter === 'read'
                    ? 'bg-[#4d8eff] text-[#00285d]'
                    : 'text-[#8c909f] hover:text-[#dfe2ef]'
                }`}
              >
                Read ({telemetry.read})
              </button>
            </div>
          </div>
        </div>

        {/* Messages List Table */}
        <div className="overflow-x-auto w-full mt-4">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-[#181b25] text-[#8c909f] text-xs uppercase tracking-wider border-b border-[#1F293D]">
                <th className="py-3 px-4 rounded-l-lg">Status</th>
                <th className="py-3 px-4">Sender Info</th>
                <th className="py-3 px-4">Subject & Excerpt</th>
                <th className="py-3 px-4">Date & IP</th>
                <th className="py-3 px-4 text-right rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F293D]">
              {filteredMessages.length > 0 ? (
                filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    onClick={() => handleOpenDetail(msg)}
                    className={`hover:bg-[#262a34] cursor-pointer transition-colors group ${
                      !msg.is_read ? 'bg-[#4d8eff]/5 font-medium' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      {msg.is_read ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#181b25] text-[#8c909f] text-[11px] font-mono border border-[#1F293D]">
                          <MailOpen className="w-3 h-3" /> Read
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-[11px] font-mono border border-[#EF4444]/30">
                          <Mail className="w-3 h-3 animate-pulse" /> Unread
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col">
                        <span
                          className={`text-sm ${
                            !msg.is_read ? 'text-[#F9FAFB] font-bold' : 'text-[#c2c6d6]'
                          }`}
                        >
                          {msg.sender_name}
                        </span>
                        <span className="text-xs text-[#8c909f] font-mono">{msg.sender_email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                      <div className="flex flex-col">
                        <span
                          className={`text-sm line-clamp-1 ${
                            !msg.is_read ? 'text-[#F9FAFB] font-semibold' : 'text-[#dfe2ef]'
                          }`}
                        >
                          {msg.subject}
                        </span>
                        <span className="text-xs text-[#8c909f] line-clamp-1 mt-0.5">
                          {msg.message}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs font-mono text-[#8c909f]">
                      <div>{msg.created_at}</div>
                      {msg.ip_address && (
                        <div className="text-[10px] text-[#424754]">{msg.ip_address}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div
                        className="inline-flex items-center gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={(e) => handleToggleReadStatus(msg.id, e)}
                          className="p-1.5 rounded hover:bg-[#31353f] text-[#c2c6d6] hover:text-[#adc6ff] transition-colors"
                          title={msg.is_read ? 'Mark as Unread' : 'Mark as Read'}
                        >
                          {msg.is_read ? (
                            <Mail className="w-4 h-4" />
                          ) : (
                            <MailOpen className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleReplyEmail(msg.sender_email, msg.subject)}
                          className="p-1.5 rounded hover:bg-[#31353f] text-[#c2c6d6] hover:text-[#4edea3] transition-colors"
                          title="Reply via Email"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(msg.id)}
                          className="p-1.5 rounded hover:bg-[#93000a] text-[#c2c6d6] hover:text-[#ffb4ab] transition-colors"
                          title="Delete Message"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-sm text-[#8c909f]">
                    No messages found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Message Inspector Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1f29] border border-[#1F293D] rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#181b25] border-b border-[#1F293D]">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#adc6ff]" />
                <h2 className="text-base font-bold text-[#F9FAFB]">Inquiry Message Inspector</h2>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-1 rounded text-[#8c909f] hover:text-[#F9FAFB] hover:bg-[#31353f]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Sender Metadata Box */}
              <div className="bg-[#0a0e17] p-4 rounded-lg border border-[#1F293D] space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-[#F9FAFB]">
                    <User className="w-4 h-4 text-[#adc6ff]" />
                    <span>{selectedMessage.sender_name}</span>
                  </div>
                  <span className="text-xs font-mono text-[#8c909f] flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {selectedMessage.created_at}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-[#8c909f]">
                  <span className="font-mono text-[#adc6ff]">{selectedMessage.sender_email}</span>
                  {selectedMessage.ip_address && (
                    <span className="flex items-center gap-1 font-mono text-[11px]">
                      <Globe className="w-3 h-3 text-[#8c909f]" /> IP: {selectedMessage.ip_address}
                    </span>
                  )}
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="text-xs text-[#8c909f] uppercase font-semibold tracking-wider">
                  Subject
                </label>
                <h3 className="text-base font-bold text-[#F9FAFB] mt-1">
                  {selectedMessage.subject}
                </h3>
              </div>

              {/* Message Body */}
              <div>
                <label className="text-xs text-[#8c909f] uppercase font-semibold tracking-wider">
                  Message Content
                </label>
                <div className="mt-2 bg-[#0a0e17] p-4 rounded-lg border border-[#1F293D] text-xs text-[#dfe2ef] font-mono leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-[#181b25] border-t border-[#1F293D]">
              <button
                onClick={() => setDeleteTargetId(selectedMessage.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#93000a]/30 text-[#ffb4ab] text-xs font-semibold hover:bg-[#93000a] hover:text-[#ffdad6] transition-all"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Message</span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 rounded-lg bg-[#0a0e17] text-[#c2c6d6] text-xs font-semibold hover:bg-[#31353f] transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() =>
                    handleReplyEmail(selectedMessage.sender_email, selectedMessage.subject)
                  }
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#4d8eff] text-[#00285d] text-xs font-bold hover:bg-[#adc6ff] transition-all shadow-md"
                >
                  <Send className="w-4 h-4" />
                  <span>Reply via Email</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteTargetId && (
        <div className="fixed inset-0 z-50 bg-[#000000]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#1c1f29] border border-[#1F293D] rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-[#ffb4ab] mb-3">
              <AlertCircle className="w-6 h-6" />
              <h3 className="text-lg font-bold text-[#F9FAFB]">Purge Inquiry Message</h3>
            </div>
            <p className="text-xs text-[#9CA3AF] mb-6 leading-relaxed">
              Are you sure you want to permanently delete this message record? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTargetId(null)}
                className="px-4 py-2 rounded-lg bg-[#0a0e17] text-[#c2c6d6] text-xs font-semibold hover:bg-[#31353f] transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 rounded-lg bg-[#93000a] text-[#ffdad6] text-xs font-bold hover:bg-[#ffb4ab] hover:text-[#690005] transition-all"
              >
                Confirm Purge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}