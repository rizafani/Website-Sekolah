import React, { useState } from 'react';
import { Award, Trophy, Medal, Star, Filter, Calendar } from 'lucide-react';
import { AchievementItem } from '../types/index.ts';

interface AchievementsViewProps {
  achievements: AchievementItem[];
  onNavigate: (view: string) => void;
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const [selectedRecipient, setSelectedRecipient] = useState<'all' | 'Siswa' | 'Guru'>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filtered = achievements.filter(ach => {
    const matchRec = selectedRecipient === 'all' || ach.category === selectedRecipient;
    const matchLev = selectedLevel === 'all' || ach.level === selectedLevel;
    return matchRec && matchLev;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Kebanggaan & Prestasi
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Prestasi Siswa & Guru
        </h1>
        <p className="text-sm text-slate-600">
          Daftar raihan penghargaan dalam bidang sains, seni budaya tradisional Aceh, olahraga, tilawatil Quran, dan inovasi pendidikan.
        </p>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setSelectedRecipient('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedRecipient === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({achievements.length})
          </button>
          <button
            onClick={() => setSelectedRecipient('Siswa')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedRecipient === 'Siswa' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prestasi Siswa
          </button>
          <button
            onClick={() => setSelectedRecipient('Guru')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedRecipient === 'Guru' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Prestasi Guru
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Tingkat:</span>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
          >
            <option value="all">Semua Tingkat</option>
            <option value="Kabupaten">Tingkat Kabupaten</option>
            <option value="Provinsi">Tingkat Provinsi</option>
            <option value="Nasional">Tingkat Nasional</option>
          </select>
        </div>

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
                <span className="font-semibold text-sky-800">Tingkat {item.level}</span>
                <span className="font-mono tabular-nums font-semibold">{item.year}</span>
              </div>

              <h2 className="text-base font-bold text-slate-900 group-hover:text-sky-900 transition-colors leading-snug">
                {item.title}
              </h2>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                <p className="font-bold text-slate-900">{item.recipient}</p>
                <p className="text-amber-700 font-semibold">{item.rank}</p>
                <p className="text-slate-500 text-[11px]">{item.type}</p>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
              <span>Kategori: {item.category}</span>
              <span className="text-emerald-700 font-semibold">Terverifikasi</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
