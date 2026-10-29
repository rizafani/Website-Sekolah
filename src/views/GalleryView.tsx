import React, { useState } from 'react';
import { Play, Image as ImageIcon, Calendar, Tag, Maximize2 } from 'lucide-react';
import { GalleryItem } from '../types/index.ts';

interface GalleryViewProps {
  galleries: GalleryItem[];
  onOpenLightbox: (item: GalleryItem) => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ galleries, onOpenLightbox }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<'all' | 'photo' | 'video'>('all');

  const categories = ['all', 'Kegiatan Belajar', 'Upacara & Peringatan', 'Ekstrakurikuler', 'Fasilitas'];

  const filtered = galleries.filter(g => {
    const matchCat = selectedCategory === 'all' || g.category === selectedCategory;
    const matchType = selectedType === 'all' || g.type === selectedType;
    return matchCat && matchType;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Dokumentasi Multimedia
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Galeri Foto & Video Kegiatan
        </h1>
        <p className="text-sm text-slate-600">
          Dokumentasi visual peristiwa bersejarah, pembelajaran aktif, pentas seni, dan aktivitas warga kampus SMA Negeri 1 Julok.
        </p>
      </div>

      {/* Filter Segmented Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* Media Type Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
          <button
            onClick={() => setSelectedType('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedType === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua Media
          </button>
          <button
            onClick={() => setSelectedType('photo')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedType === 'photo' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Foto ({galleries.filter(g => g.type === 'photo').length})
          </button>
          <button
            onClick={() => setSelectedType('video')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              selectedType === 'video' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Video ({galleries.filter(g => g.type === 'video').length})
          </button>
        </div>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onOpenLightbox(item)}
            className="group relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="aspect-16/10 overflow-hidden relative">
              {item.type === 'video' ? (
                <div className="w-full h-full relative flex items-center justify-center bg-slate-800">
                  <img
                    src="/src/assets/images/hero_sman1julok_1793290495969.jpg"
                    alt={item.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="w-12 h-12 rounded-full bg-white text-sky-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>
              ) : (
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              )}

              <div className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <Maximize2 className="w-4 h-4" />
              </div>
            </div>

            <div className="p-4 bg-white space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span className="font-semibold text-sky-800">{item.category}</span>
                <span>{item.date}</span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-900 transition-colors line-clamp-1 leading-snug">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {item.caption}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
