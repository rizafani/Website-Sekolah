import React, { useState, useMemo } from 'react';
import { Search, ChevronRight, BookOpen, ArrowRight, Eye, Calendar, User } from 'lucide-react';
import { NewsItem } from '../types/index.ts';

interface NewsViewProps {
  newsList: NewsItem[];
  onSelectNews: (id: string) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ newsList, onSelectNews }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const categories = ['all', 'Prestasi', 'Kegiatan', 'Akademik', 'Pengumuman', 'Artikel Siswa'];

  const filteredNews = useMemo(() => {
    return newsList.filter(item => {
      const matchCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchTerm.toLowerCase().trim();
      const matchSearch = !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.author.toLowerCase().includes(q) ||
        item.tags.some(t => t.toLowerCase().includes(q));
      return matchCategory && matchSearch;
    });
  }, [newsList, selectedCategory, searchTerm]);

  const totalPages = Math.ceil(filteredNews.length / itemsPerPage) || 1;
  const currentItems = filteredNews.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Publikasi & Kabar Sekolah
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Berita & Artikel Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Informasi kegiatan akademik, karya ilmiah siswa, prestasi, dan geliat kehidupan belajar mengajar di SMA Negeri 1 Julok.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        
        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-100 rounded-lg">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                selectedCategory === cat ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari judul atau topik berita..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
          />
        </div>

      </div>

      {/* News Grid */}
      {currentItems.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
          <p className="font-semibold text-slate-700">Tidak ada berita yang sesuai</p>
          <p className="mt-1 text-slate-400">Silakan ubah kata kunci atau pilih kategori lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentItems.map((item) => (
            <article
              key={item.id}
              onClick={() => onSelectNews(item.id)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2 py-0.5 rounded">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  {/* Clean unboxed metadata per Section 1.A */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span>{item.author}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{item.views} dibaca</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-900 transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="text-xs font-semibold text-sky-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Sebelumnya
          </button>
          <span className="text-xs text-slate-600 px-3">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Selanjutnya
          </button>
        </div>
      )}

    </div>
  );
};
