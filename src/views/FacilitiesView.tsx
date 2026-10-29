import React, { useState } from 'react';
import { Building2, CheckCircle2, Users, Layers, ShieldCheck } from 'lucide-react';
import { FacilityItem } from '../types/index.ts';

interface FacilitiesViewProps {
  facilities: FacilityItem[];
  onNavigate: (view: string) => void;
}

export const FacilitiesView: React.FC<FacilitiesViewProps> = ({ facilities }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = ['all', 'Laboratorium', 'Ruang Belajar', 'Sarana Olahraga', 'Ibadah', 'Layanan Siswa'];

  const filteredFacilities = facilities.filter(f => selectedCategory === 'all' || f.category === selectedCategory);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Sarana & Prasarana
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Fasilitas Kampus SMA Negeri 1 Julok
        </h1>
        <p className="text-sm text-slate-600">
          Infrastruktur modern dan fasilitas pendukung pembelajaran yang asri, lengkap, dan berstandar nasional di Buket Seuraja.
        </p>
      </div>

      {/* Category Segmented Control */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat === 'all' ? 'Semua Fasilitas' : cat}
          </button>
        ))}
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((fac) => (
          <div
            key={fac.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Photo */}
              <div className="aspect-16/10 bg-slate-900 overflow-hidden relative">
                <img
                  src={fac.photoUrl}
                  alt={fac.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
                  {fac.category}
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-2.5">
                <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-900 transition-colors leading-snug">
                  {fac.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {fac.description}
                </p>
              </div>
            </div>

            {/* Footer Metadata - Clean unboxed text */}
            <div className="p-5 pt-0 border-t border-slate-100 text-xs flex items-center justify-between text-slate-500">
              <span>Kapasitas: {fac.capacity || 'Tersedia'}</span>
              <span className="font-semibold text-emerald-700">{fac.condition}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
