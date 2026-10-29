import React, { useState } from 'react';
import { Bell, Search, FileText, Download, AlertCircle, ArrowRight } from 'lucide-react';
import { AnnouncementItem } from '../types/index.ts';

interface AnnouncementsViewProps {
  announcements: AnnouncementItem[];
  onNavigate: (view: string) => void;
}

export const AnnouncementsView: React.FC<AnnouncementsViewProps> = ({ announcements }) => {
  const [selectedTarget, setSelectedTarget] = useState<string>('Semua');
  const [searchTerm, setSearchTerm] = useState('');

  const targets = ['Semua', 'Siswa', 'Guru & Staf', 'Orang Tua', 'Calon Siswa Baru'];

  const filtered = announcements.filter(a => {
    const matchTarget = selectedTarget === 'Semua' || a.target === selectedTarget || a.target === 'Semua';
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q);
    return matchTarget && matchSearch;
  });

  const handleSimulateDownload = (filename: string) => {
    alert(`Mengunduh dokumen lampiran pengumuman: ${filename}\nFormat resmi SMA Negeri 1 Julok.`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Pemberitahuan Resmi
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Pengumuman Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Surat edaran, pengumuman kedinasan, jadwal asesmen, dan informasi penting bagi seluruh warga SMAN 1 Julok.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        
        {/* Target Filter Segmented */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {targets.map((tgt) => (
            <button
              key={tgt}
              onClick={() => setSelectedTarget(tgt)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedTarget === tgt ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tgt}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pengumuman..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
          />
        </div>

      </div>

      {/* List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            <p className="font-semibold text-slate-700">Tidak ada pengumuman ditemukan</p>
            <p className="mt-1 text-slate-400">Silakan pilih target lain atau ubah kata kunci pencarian.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className={`p-6 rounded-2xl border transition-all space-y-3 bg-white ${
                item.isUrgent ? 'border-amber-300 shadow-xs bg-amber-50/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  {item.isUrgent && (
                    <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                      PENTING & SEGERA
                    </span>
                  )}
                  <span className="text-slate-500 font-medium">Ditujukan untuk: <strong className="text-slate-800">{item.target}</strong></span>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{item.date}</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {item.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {item.content}
              </p>

              {item.attachmentName && (
                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <FileText className="w-4 h-4 text-sky-800" />
                    <span>Lampiran: {item.attachmentName}</span>
                  </div>
                  <button
                    onClick={() => handleSimulateDownload(item.attachmentName!)}
                    className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Dokumen</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

    </div>
  );
};
