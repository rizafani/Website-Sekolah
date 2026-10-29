import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  FileText, 
  ShieldCheck, 
  ExternalLink,
  Settings,
  Mail
} from 'lucide-react';
import { NotificationItem } from '../types/index.ts';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  onNavigate: (view: string) => void;
}

export const NotificationModal: React.FC<NotificationModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkRead,
  onMarkAllRead,
  onNavigate
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [showPreferences, setShowPreferences] = useState(false);
  const [emailAlertsEnabled, setEmailAlertsEnabled] = useState(false);
  const [inAppAlertsEnabled, setInAppAlertsEnabled] = useState(true);

  if (!isOpen) return null;

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredList = filter === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

  const getIconForType = (type: NotificationItem['type']) => {
    switch (type) {
      case 'approval_required':
        return <Clock className="w-4 h-4 text-amber-600" />;
      case 'article_approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'article_rejected':
        return <AlertCircle className="w-4 h-4 text-rose-600" />;
      case 'spmb_new':
        return <FileText className="w-4 h-4 text-sky-600" />;
      case 'urgent_announcement':
        return <Bell className="w-4 h-4 text-amber-500 animate-pulse" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-900 text-white flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <span>Pusat Notifikasi & Pemberitahuan</span>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-600 text-white">
                    {unreadCount} baru
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-500">SMA Negeri 1 Julok</div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowPreferences(!showPreferences)}
              className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-200/60 cursor-pointer"
              title="Pengaturan Preferensi Notifikasi"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preferences Drawer */}
        {showPreferences ? (
          <div className="p-4 bg-sky-50/50 border-b border-sky-100 text-xs space-y-3">
            <div className="font-bold text-sky-950 flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-sky-800" />
              <span>Pengaturan Preferensi Notifikasi</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <span className="text-slate-700">Pemberitahuan Langsung di Aplikasi (In-App)</span>
                <input
                  type="checkbox"
                  checked={inAppAlertsEnabled}
                  onChange={(e) => setInAppAlertsEnabled(e.target.checked)}
                  className="rounded text-sky-900 focus:ring-sky-500"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                <div>
                  <div className="text-slate-700">Notifikasi Melalui Email</div>
                  <div className="text-[10px] text-slate-400">
                    * Memerlukan integrasi SMTP aktif pada server sekolah.
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlertsEnabled}
                  onChange={(e) => setEmailAlertsEnabled(e.target.checked)}
                  className="rounded text-sky-900 focus:ring-sky-500"
                />
              </label>
            </div>

            <button
              onClick={() => setShowPreferences(false)}
              className="px-3 py-1 text-xs font-bold bg-sky-900 text-white rounded-md cursor-pointer"
            >
              Simpan Preferensi
            </button>
          </div>
        ) : null}

        {/* Filter & Actions Bar */}
        <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between text-xs bg-white">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                filter === 'unread' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Belum Dibaca ({unreadCount})
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-sky-800 hover:text-sky-950 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai Semua Dibaca</span>
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredList.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <div className="text-xs font-semibold text-slate-600">Tidak ada notifikasi</div>
              <div className="text-[11px] text-slate-400 mt-0.5">Semua pemberitahuan telah Anda periksa.</div>
            </div>
          ) : (
            filteredList.map((item) => (
              <div
                key={item.id}
                className={`p-3.5 transition-colors flex items-start gap-3 hover:bg-slate-50 ${
                  !item.isRead ? 'bg-sky-50/40' : ''
                }`}
              >
                <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-xs shrink-0 mt-0.5">
                  {getIconForType(item.type)}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs font-bold leading-tight ${!item.isRead ? 'text-sky-950' : 'text-slate-800'}`}>
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.date}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex items-center gap-3 pt-1 text-[11px]">
                    {item.link && (
                      <button
                        onClick={() => {
                          onNavigate(item.link!);
                          onMarkRead(item.id);
                          onClose();
                        }}
                        className="text-sky-800 hover:text-sky-950 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Buka Menu Terkait</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    )}

                    {!item.isRead && (
                      <button
                        onClick={() => onMarkRead(item.id)}
                        className="text-slate-500 hover:text-slate-700 font-medium cursor-pointer"
                      >
                        Tandai dibaca
                      </button>
                    )}
                  </div>
                </div>

                {!item.isRead && (
                  <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0 mt-1.5" title="Belum dibaca"></span>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 rounded-lg cursor-pointer"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
