import React, { useState } from 'react';
import { Sparkles, Calendar, Users, Award, Shield, Heart, Trophy } from 'lucide-react';
import { ExtracurricularItem } from '../types/index.ts';

interface ExtracurricularViewProps {
  items: ExtracurricularItem[];
  onNavigate: (view: string) => void;
}

export const ExtracurricularView: React.FC<ExtracurricularViewProps> = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Kepemimpinan', 'Keagamaan', 'Seni & Budaya', 'Olahraga', 'Karya Ilmiah & Bahasa'];

  const filtered = items.filter(e => selectedCategory === 'all' || e.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Pengembangan Minat & Bakat
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kegiatan Ekstrakurikuler
        </h1>
        <p className="text-sm text-slate-600">
          Wadah aktualisasi diri, kepemimpinan karakter, dan prestasi non-akademik peserta didik SMA Negeri 1 Julok.
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
            {cat === 'all' ? 'Semua Ekskul' : cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-md transition-all space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-sky-800">{item.category}</span>
                <span className="tabular-nums font-semibold">{item.membersCount} Anggota Aktif</span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-900 transition-colors leading-snug">
                {item.name}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 text-xs">
                <p className="text-slate-700">
                  <strong className="text-slate-900">Pembina:</strong> {item.coach}
                </p>
                <p className="text-slate-700">
                  <strong className="text-slate-900">Jadwal:</strong> {item.schedule}
                </p>
              </div>

              {item.achievements && item.achievements.length > 0 && (
                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1">
                    <Trophy className="w-3.5 h-3.5 text-amber-600" />
                    <span>Prestasi Terbaru:</span>
                  </span>
                  <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                    {item.achievements.map((ach, i) => (
                      <li key={i}>{ach}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400">
              Terbuka untuk seluruh siswa Fase E dan Fase F
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
