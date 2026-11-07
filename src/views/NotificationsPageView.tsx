import React, { useState } from 'react';
import { 
  Bell, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Search, 
  Filter, 
  CheckCheck, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';
import { NotificationItem } from '../types/index.ts';

interface NotificationsPageViewProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (view: string, param?: string) => void;
}

export const NotificationsPageView: React.FC<NotificationsPageViewProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigate
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = (notifications || []).filter((notif) => {
    const matchesFilter = filterType === 'all' || notif.type === filterType;
    const matchesSearch = 
      notif.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const unreadCount = (notifications || []).filter((n) => !n.isRead).length;

  const getTypeBadge = (type: NotificationItem['type']) => {
    switch (type) {
      case 'urgent_announcement':
        return { label: 'Penting / Darurat', color: 'bg-rose-100 text-rose-800 border-rose-200' };
      case 'approval_required':
        return { label: 'Persetujuan Redaksi', color: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'article_approved':
        return { label: 'Artikel Disetujui', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
      case 'spmb_new':
        return { label: 'Pendaftaran SPMB', color: 'bg-sky-100 text-sky-800 border-sky-200' };
      case 'system_alert':
        return { label: 'Sistem & Keamanan', color: 'bg-purple-100 text-purple-800 border-purple-200' };
      default:
        return { label: 'Pengumuman Umum', color: 'bg-slate-100 text-slate-800 border-slate-200' };
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <Breadcrumbs
        items={[
          { label: 'Beranda', view: 'beranda' },
          { label: 'Pusat Notifikasi & Siaran Resmi' }
        ]}
        onNavigate={onNavigate}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-sky-900/50">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-800/60 text-sky-200 text-xs font-semibold border border-sky-600/40">
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>Pemberitahuan Resmi Sekolah</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              Pusat Notifikasi & Siaran Internal
            </h1>
            <p className="text-slate-300 text-sm">
              Pantau jadwal akademik penting, pengumuman kedinasan, dan status layanan portal SMA Negeri 1 Julok.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllRead}
                className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg flex items-center gap-2 cursor-pointer transition-colors shadow-sm"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Tandai Semua Telah Dibaca</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-6">
        {/* Controls Filter Bar */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: `Semua (${notifications.length})` },
              { id: 'urgent_announcement', label: 'Penting' },
              { id: 'spmb_new', label: 'SPMB' },
              { id: 'approval_required', label: 'Editorial' },
              { id: 'system_alert', label: 'Sistem' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  filterType === tab.id
                    ? 'bg-sky-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari notifikasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">Tidak ada notifikasi</h3>
              <p className="text-xs text-slate-500 mt-1">Anda sudah membaca seluruh pemberitahuan terbaru.</p>
            </div>
          ) : (
            filtered.map((item) => {
              const badge = getTypeBadge(item.type);
              return (
                <div
                  key={item.id}
                  className={`p-5 rounded-xl border transition-all flex flex-col sm:flex-row items-start justify-between gap-4 ${
                    item.isRead
                      ? 'bg-white border-slate-200'
                      : 'bg-sky-50/70 border-sky-200 shadow-xs'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.color}`}>
                        {badge.label}
                      </span>
                      {!item.isRead && (
                        <span className="w-2 h-2 rounded-full bg-sky-600"></span>
                      )}
                      <span className="text-[11px] text-slate-400 font-mono">
                        {item.date ? new Date(item.date).toLocaleDateString('id-ID', { dateStyle: 'long' }) : 'Hari ini'}
                      </span>
                    </div>

                    <h3 className={`text-sm font-bold ${item.isRead ? 'text-slate-800' : 'text-slate-900'}`}>
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.message}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!item.isRead && (
                      <button
                        onClick={() => onMarkRead(item.id)}
                        className="px-3 py-1.5 text-xs font-semibold text-sky-900 bg-sky-100/80 hover:bg-sky-200/80 rounded-lg cursor-pointer transition-colors"
                      >
                        Tandai Dibaca
                      </button>
                    )}
                    {item.link && (
                      <button
                        onClick={() => {
                          onMarkRead(item.id);
                          onNavigate(item.link!);
                        }}
                        className="px-3 py-1.5 text-xs font-bold text-white bg-sky-900 hover:bg-sky-800 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
                      >
                        <span>Buka</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
};
