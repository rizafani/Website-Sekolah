import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Eye, 
  Share2, 
  Check, 
  Tag, 
  Bookmark, 
  BookmarkCheck,
  Printer
} from 'lucide-react';
import { NewsItem } from '../types/index.ts';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';

interface NewsDetailViewProps {
  newsItem: NewsItem;
  allNews: NewsItem[];
  onBack: () => void;
  onSelectNews: (id: string) => void;
}

export const NewsDetailView: React.FC<NewsDetailViewProps> = ({
  newsItem,
  allNews,
  onBack,
  onSelectNews
}) => {
  const [copied, setCopied] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    return localStorage.getItem(`bookmark_news_${newsItem.id}`) === 'true';
  });

  const related = allNews
    .filter(n => n.id !== newsItem.id && n.category === newsItem.category)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBookmark = () => {
    const next = !isBookmarked;
    setIsBookmarked(next);
    localStorage.setItem(`bookmark_news_${newsItem.id}`, next ? 'true' : 'false');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <Breadcrumbs
        items={[
          { label: 'Informasi', view: 'berita' },
          { label: 'Berita & Artikel', view: 'berita' },
          { label: newsItem.title }
        ]}
        onNavigate={onBack}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 space-y-8">
        
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1.5 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Indeks Berita</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors flex items-center gap-1.5 cursor-pointer ${
                isBookmarked 
                  ? 'bg-amber-50 text-amber-800 border-amber-300' 
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
              title={isBookmarked ? 'Tersimpan di bookmark' : 'Simpan ke bookmark'}
            >
              {isBookmarked ? (
                <>
                  <BookmarkCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Tersimpan</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5 text-slate-400" />
                  <span>Bookmark</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer"
              title="Cetak artikel ini"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
          </div>
        </div>

      {/* Article Header */}
      <div className="space-y-4">
        {/* Clean unboxed metadata with dot separator */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 font-medium">
          <span className="text-sky-800 font-bold">{newsItem.category}</span>
          <span aria-hidden="true">·</span>
          <span>Ditulis oleh {newsItem.author}</span>
          <span aria-hidden="true">·</span>
          <span>{newsItem.date}</span>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">{newsItem.views} kali dibaca</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {newsItem.title}
        </h1>
      </div>

      {/* Hero Image */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-sm aspect-16/9 bg-slate-900">
        <img
          src={newsItem.imageUrl}
          alt={newsItem.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Body */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4">
          {newsItem.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className={idx === 0 ? "text-base sm:text-lg font-medium text-slate-800 leading-relaxed" : ""}>
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags */}
        {newsItem.tags && newsItem.tags.length > 0 && (
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>Kata Kunci:</span>
            </span>
            {newsItem.tags.map((tag, i) => (
              <span key={i} className="text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Social Share bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Share2 className="w-4 h-4 text-sky-800" />
            <span>Bagikan Berita Ini:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="text-xs font-medium px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
              <span>{copied ? 'Tautan Disalin!' : 'Salin Tautan'}</span>
            </button>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(newsItem.title)}&url=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1"
            >
              X / Twitter
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(newsItem.title + ' - ' + window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-sky-700 hover:bg-sky-800 text-white flex items-center gap-1"
            >
              Facebook
            </a>
          </div>
        </div>

      </div>

      {/* Related News */}
      {related.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="text-xl font-bold text-slate-900">Berita Terkait Lainnya</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectNews(item.id)}
                className="p-4 rounded-xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all cursor-pointer space-y-2"
              >
                <div className="aspect-video rounded-lg overflow-hidden bg-slate-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-xs text-slate-400">{item.date}</p>
                <p className="text-xs font-bold text-slate-900 line-clamp-2">{item.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      </div>
    </div>
  );
};
