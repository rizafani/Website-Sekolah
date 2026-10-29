import React, { useState, useMemo, useEffect } from 'react';
import { Search, X, BookOpen, Bell, Users, Award, FileText, Calendar, Building2, ArrowRight } from 'lucide-react';
import { DatabaseSchema } from '../types/index.ts';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: DatabaseSchema;
  onSelectResult: (view: string, id?: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  data,
  onSelectResult
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const results = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q || q.length < 2) return [];

    const items: Array<{
      category: string;
      title: string;
      desc: string;
      view: string;
      id?: string;
      icon: any;
    }> = [];

    // News
    data.news.forEach(n => {
      if (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q) || n.category.toLowerCase().includes(q)) {
        items.push({
          category: 'Berita & Artikel',
          title: n.title,
          desc: n.excerpt,
          view: 'berita-detail',
          id: n.id,
          icon: BookOpen
        });
      }
    });

    // Announcements
    data.announcements.forEach(a => {
      if (a.title.toLowerCase().includes(q) || a.content.toLowerCase().includes(q)) {
        items.push({
          category: 'Pengumuman',
          title: a.title,
          desc: a.content.substring(0, 100) + '...',
          view: 'pengumuman',
          id: a.id,
          icon: Bell
        });
      }
    });

    // Staff
    data.staff.forEach(s => {
      if (s.name.toLowerCase().includes(q) || (s.subject && s.subject.toLowerCase().includes(q)) || s.role.toLowerCase().includes(q)) {
        items.push({
          category: 'Guru & Tenaga Kependidikan',
          title: s.name,
          desc: `${s.role} - ${s.subject || s.education}`,
          view: 'guru',
          id: s.id,
          icon: Users
        });
      }
    });

    // Facilities
    data.facilities.forEach(f => {
      if (f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) {
        items.push({
          category: 'Fasilitas',
          title: f.name,
          desc: f.description.substring(0, 90) + '...',
          view: 'fasilitas',
          id: f.id,
          icon: Building2
        });
      }
    });

    // Achievements
    data.achievements.forEach(ach => {
      if (ach.title.toLowerCase().includes(q) || ach.recipient.toLowerCase().includes(q)) {
        items.push({
          category: 'Prestasi',
          title: ach.title,
          desc: `${ach.recipient} (${ach.rank})`,
          view: 'prestasi',
          id: ach.id,
          icon: Award
        });
      }
    });

    // Events
    data.events.forEach(ev => {
      if (ev.title.toLowerCase().includes(q) || ev.description.toLowerCase().includes(q)) {
        items.push({
          category: 'Agenda Sekolah',
          title: ev.title,
          desc: `${ev.date} - ${ev.location}`,
          view: 'agenda',
          id: ev.id,
          icon: Calendar
        });
      }
    });

    // Downloads
    data.downloads.forEach(d => {
      if (d.title.toLowerCase().includes(q) || d.category.toLowerCase().includes(q)) {
        items.push({
          category: 'Unduhan Dokumen',
          title: d.title,
          desc: `${d.fileType} (${d.fileSize})`,
          view: 'unduhan',
          id: d.id,
          icon: FileText
        });
      }
    });

    return items.slice(0, 10);
  }, [searchTerm, data]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Cari berita, pengumuman, guru, fasilitas, prestasi, dokumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="text-xs text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Hapus
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {searchTerm.length < 2 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Ketik minimal 2 karakter untuk memulai pencarian di seluruh portal SMAN 1 Julok.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['SPMB', 'OSN', 'Kurikulum', 'Biologi', 'Perpustakaan', 'Jadwal'].map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => setSearchTerm(keyword)}
                    className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200 px-2.5 py-1 rounded-md transition-colors"
                  >
                    {keyword}
                  </button>
                ))}
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              <p className="font-semibold text-slate-700">Tidak ada hasil ditemukan</p>
              <p className="mt-1 text-slate-400">Coba kata kunci lain atau periksa ejaan Anda.</p>
            </div>
          ) : (
            results.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    onSelectResult(item.view, item.id);
                    onClose();
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-sky-50 transition-colors flex items-center justify-between group border border-transparent hover:border-sky-100 cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-800 flex items-center justify-center shrink-0 mt-0.5">
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span>{item.category}</span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 group-hover:text-sky-900 transition-colors">
                        {item.title}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-sky-700 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-4 py-2 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Tekan ESC untuk menutup</span>
          <span>Ditemukan {results.length} hasil</span>
        </div>

      </div>
    </div>
  );
};
