import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { FaqItem } from '../types/index.ts';

interface FaqViewProps {
  faqs: FaqItem[];
  onNavigate: (view: string) => void;
}

export const FaqView: React.FC<FaqViewProps> = ({ faqs, onNavigate }) => {
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'SPMB', 'Akademik', 'Fasilitas', 'Tata Tertib', 'Layanan Digital'];

  const filtered = faqs.filter(f => {
    const matchCat = selectedCategory === 'all' || f.category === selectedCategory;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Pusat Bantuan & Jawaban
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Pertanyaan yang Sering Diajukan (FAQ)
        </h1>
        <p className="text-sm text-slate-600">
          Temukan jawaban cepat seputar Penerimaan Murid Baru (SPMB), kurikulum, pembiayaan, fasilitas, dan tata tertib SMAN 1 Julok.
        </p>
      </div>

      {/* Filter and Search */}
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
              {cat === 'all' ? 'Semua Topik' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari pertanyaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
          />
        </div>

      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            <p className="font-semibold text-slate-700">Pertanyaan tidak ditemukan</p>
            <p className="mt-1 text-slate-400">Silakan tanyakan langsung melalui halaman Kontak Sekolah.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const isOpen = openId === item.id;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all"
              >
                <button
                  onClick={() => toggleAccordion(item.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {item.question}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Need more help banner */}
      <div className="p-6 rounded-2xl bg-sky-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-base">Punya Pertanyaan Khusus Lainnya?</p>
          <p className="text-xs text-slate-300">Tim Pelayanan Terpadu SMAN 1 Julok siap membantu Anda.</p>
        </div>
        <button
          onClick={() => onNavigate('kontak')}
          className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0 cursor-pointer"
        >
          Kirim Pertanyaan ke Sekolah
        </button>
      </div>

    </div>
  );
};
