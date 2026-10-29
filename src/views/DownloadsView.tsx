import React, { useState } from 'react';
import { Download, FileText, Search, Tag, CheckCircle2 } from 'lucide-react';
import { DownloadItem } from '../types/index.ts';
import { api } from '../services/api.ts';

interface DownloadsViewProps {
  downloads: DownloadItem[];
  onDownloadTracked: (id: string) => void;
}

export const DownloadsView: React.FC<DownloadsViewProps> = ({ downloads, onDownloadTracked }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['all', 'Kurikulum & Kalender', 'Brosur & Panduan SPMB', 'Surat Keputusan', 'Formulir Siswa', 'Modul Pembelajaran'];

  const filtered = downloads.filter(d => {
    const matchCat = selectedCategory === 'all' || d.category === selectedCategory;
    const q = searchTerm.toLowerCase().trim();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const handleDownload = (item: DownloadItem) => {
    api.trackDownload(item.id);
    onDownloadTracked(item.id);
    // Simulate real file download
    const blob = new Blob([
      `SMA NEGERI 1 JULOK - BUKET SEURAJA, ACEH TIMUR\n\nDokumen Resmi: ${item.title}\nKategori: ${item.category}\nFormat: ${item.fileType}\nTanggal Arsip: ${item.date}\n\nDeskripsi:\n${item.description}\n\nDokumen ini sah dan diterbitkan untuk kepentingan akademik publik SMA Negeri 1 Julok.`
    ], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${item.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.${item.fileType.toLowerCase() === 'docx' ? 'doc' : 'txt'}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Transparansi Informasi Publik
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Pusat Unduhan Dokumen Resmi
        </h1>
        <p className="text-sm text-slate-600">
          Unduh kalender pendidikan, formulir pendaftaran, panduan teknis SPMB, surat keputusan, dan modul ajar SMA Negeri 1 Julok.
        </p>
      </div>

      {/* Filter and Search Bar */}
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
              {cat === 'all' ? 'Semua Dokumen' : cat}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama dokumen..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
          />
        </div>

      </div>

      {/* Document List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs">
            <p className="font-semibold text-slate-700">Tidak ada dokumen ditemukan</p>
            <p className="mt-1 text-slate-400">Silakan pilih kategori lain atau periksa kata kunci Anda.</p>
          </div>
        ) : (
          filtered.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-sky-300 hover:shadow-xs transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium">
                    <span className="text-sky-800 font-semibold">{doc.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{doc.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="tabular-nums">{doc.downloadCount} kali diunduh</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-0.5">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1 mt-0.5">
                    {doc.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <div className="text-right text-[11px] text-slate-400 hidden md:block">
                  <p className="font-mono font-bold text-slate-700">{doc.fileType}</p>
                  <p>{doc.fileSize}</p>
                </div>
                <button
                  onClick={() => handleDownload(doc)}
                  className="px-4 py-2 rounded-lg bg-sky-900 hover:bg-sky-800 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-sky-300" />
                  <span>Unduh File</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};
