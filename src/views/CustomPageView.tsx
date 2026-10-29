import React, { useState } from 'react';
import { 
  Calendar, 
  User as UserIcon, 
  Eye, 
  Share2, 
  Printer, 
  History, 
  ArrowLeft, 
  Clock, 
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { CustomPage } from '../types/index.ts';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';

interface CustomPageViewProps {
  page: CustomPage;
  onNavigate: (view: string) => void;
}

export const CustomPageView: React.FC<CustomPageViewProps> = ({ page, onNavigate }) => {
  const [showRevisions, setShowRevisions] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    return localStorage.getItem(`bookmark_page_${page.id}`) === 'true';
  });

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const toggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    localStorage.setItem(`bookmark_page_${page.id}`, next ? 'true' : 'false');
  };

  return (
    <div className="bg-white min-h-[70vh]">
      <Breadcrumbs
        items={[
          { label: 'Informasi', view: 'beranda' },
          { label: page.title }
        ]}
        onNavigate={onNavigate}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="space-y-4 pb-6 border-b border-slate-200">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={() => onNavigate('beranda')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-sky-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleBookmark}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1 cursor-pointer transition-colors ${
                  isBookmarked 
                    ? 'bg-amber-50 text-amber-800 border-amber-300' 
                    : 'text-slate-600 hover:bg-slate-100 border-slate-200'
                }`}
                title={isBookmarked ? 'Tersimpan di Bookmark' : 'Simpan Halaman'}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-600 text-amber-600' : ''}`} />
                <span className="hidden sm:inline">{isBookmarked ? 'Tersimpan' : 'Simpan'}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs flex items-center gap-1 cursor-pointer"
                title="Cetak Halaman"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cetak</span>
              </button>

              <button
                onClick={handleShare}
                className="p-2 rounded-lg bg-sky-900 text-white hover:bg-sky-800 text-xs flex items-center gap-1 cursor-pointer shadow-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? 'Tautan Disalin!' : 'Bagikan'}</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {page.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <UserIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>{page.author}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{page.publishedAt || page.createdAt}</span>
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-slate-400" />
              <span>{page.viewCount} pembaca</span>
            </span>
            {page.revisions && page.revisions.length > 0 && (
              <>
                <span>·</span>
                <button
                  onClick={() => setShowRevisions(!showRevisions)}
                  className="text-sky-800 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Riwayat Revisi ({page.revisions.length})</span>
                </button>
              </>
            )}
          </div>
        </header>

        {/* Revision Drawer */}
        {showRevisions && page.revisions && (
          <div className="my-6 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3 animate-in fade-in">
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <History className="w-4 h-4 text-sky-800" />
              <span>Riwayat Versi Dokumen Resmi</span>
            </div>
            <div className="divide-y divide-slate-200 border border-slate-200 rounded-lg bg-white overflow-hidden">
              {page.revisions.map((rev) => (
                <div key={rev.id} className="p-3 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-slate-800">{rev.title}</div>
                    <div className="text-slate-500 mt-0.5">{rev.summary}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Oleh: {rev.authorName} · {rev.timestamp}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                    Tersimpan
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lead Excerpt */}
        {page.excerpt && (
          <div className="my-6 p-4 rounded-xl bg-sky-50/70 border-l-4 border-sky-800 text-sm font-medium text-sky-950 leading-relaxed italic">
            {page.excerpt}
          </div>
        )}

        {/* Body Content */}
        <div className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed space-y-4 whitespace-pre-line pt-2">
          {page.content}
        </div>

        {/* Footer Meta */}
        <footer className="mt-12 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            Halaman Resmi SMA Negeri 1 Julok · Diperbarui pada: {page.updatedAt}
          </div>
          <div className="text-right text-[11px] text-slate-400">
            NPSN: 10101890 · Buket Seuraja, Aceh Timur
          </div>
        </footer>
      </article>
    </div>
  );
};
