import React, { useState, useEffect } from 'react';
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
  Printer,
  Globe,
  Copy,
  Sparkles
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

  const articleFullUrl = `${window.location.origin}${window.location.pathname}#/berita/${newsItem.slug || newsItem.id}`;

  useEffect(() => {
    const prevTitle = document.title;
    document.title = `${newsItem.title} - SMA Negeri 1 Julok`;
    window.location.hash = `#/berita/${newsItem.slug || newsItem.id}`;
    return () => {
      document.title = prevTitle;
    };
  }, [newsItem.title, newsItem.slug, newsItem.id]);

  const related = allNews
    .filter(n => n.id !== newsItem.id && n.category === newsItem.category)
    .slice(0, 3);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(articleFullUrl);
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

        {/* Dedicated Article Permanent URL Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-sky-50/90 border border-sky-200 text-xs shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="px-2 py-0.5 rounded bg-sky-800 text-white font-bold text-[10px] shrink-0 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" />
              URL Resmi Artikel
            </span>
            <span className="font-mono text-sky-950 font-medium truncate text-[11px] select-all">
              {articleFullUrl}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white border border-sky-300 text-sky-900 font-bold hover:bg-sky-100 text-[11px] cursor-pointer shadow-2xs shrink-0 self-start sm:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-sky-700" />}
            <span>{copied ? 'URL Disalin!' : 'Salin URL Artikel'}</span>
          </button>
        </div>
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

      {/* Main Body with Inline Image Support */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4">
          {newsItem.content.split('\n\n').map((paragraph, idx) => {
            // Check if paragraph is markdown image ![alt](url)
            const imgMatch = paragraph.match(/^!\[(.*?)\]\((.*?)\)$/);
            if (imgMatch) {
              const altText = imgMatch[1];
              const imgSrc = imgMatch[2];
              return (
                <figure key={idx} className="my-6 rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                  <img
                    src={imgSrc}
                    alt={altText}
                    className="w-full max-h-96 object-cover"
                  />
                  {altText && (
                    <figcaption className="p-2.5 text-center text-xs text-slate-500 italic bg-white border-t border-slate-100">
                      {altText}
                    </figcaption>
                  )}
                </figure>
              );
            }

            // Check if heading ##
            if (paragraph.startsWith('## ')) {
              return (
                <h2 key={idx} className="text-xl sm:text-2xl font-bold text-slate-900 pt-3">
                  {paragraph.replace(/^## /, '')}
                </h2>
              );
            }

            return (
              <p key={idx} className={idx === 0 ? "text-base sm:text-lg font-medium text-slate-800 leading-relaxed" : ""}>
                {paragraph}
              </p>
            );
          })}
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
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(newsItem.title)}&url=${encodeURIComponent(articleFullUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1"
            >
              X / Twitter
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(newsItem.title + ' - ' + articleFullUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1"
            >
              WhatsApp
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleFullUrl)}`}
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
