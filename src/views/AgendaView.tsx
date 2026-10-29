import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Users, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { EventItem } from '../types/index.ts';

interface AgendaViewProps {
  events: EventItem[];
  onNavigate: (view: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({ events }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Akademik', 'Ujian', 'Ekstrakurikuler', 'Keagamaan', 'Libur'];

  const filtered = events.filter(e => selectedCategory === 'all' || e.category === selectedCategory);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Jadwal & Agenda
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Agenda & Kalender Kegiatan
        </h1>
        <p className="text-sm text-slate-600">
          Kalender akademik semester berjalan, jadwal ujian sumatif, kegiatan OSIS, dan peringatan hari besar keagamaan di SMA Negeri 1 Julok.
        </p>
      </div>

      {/* Filter Segmented Control */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat === 'all' ? 'Semua Agenda' : cat}
          </button>
        ))}
      </div>

      {/* Agenda Items List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            <p className="font-semibold text-slate-700">Tidak ada agenda pada kategori ini</p>
            <p className="mt-1 text-slate-400">Silakan pilih kategori lain untuk melihat jadwal kegiatan sekolah.</p>
          </div>
        ) : (
          filtered.map((ev) => {
            const evDate = new Date(ev.date);
            const monthName = evDate.toLocaleString('id-ID', { month: 'short' });
            const dayNum = evDate.getDate();
            const yearNum = evDate.getFullYear();

            return (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col sm:flex-row items-start gap-6 hover:border-sky-300 hover:shadow-sm transition-all"
              >
                {/* Date Box */}
                <div className="w-20 h-20 rounded-2xl bg-sky-900 text-white flex flex-col items-center justify-center shrink-0 shadow-sm text-center">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-300">
                    {monthName}
                  </span>
                  <span className="text-2xl font-black leading-none tabular-nums my-0.5">
                    {dayNum}
                  </span>
                  <span className="text-[10px] text-slate-300 tabular-nums">
                    {yearNum}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-semibold text-sky-800">{ev.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.time}</span>
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{ev.location}</span>
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {ev.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="pt-2 text-xs text-slate-400 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Penyelenggara: {ev.organizer}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
