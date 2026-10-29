import React, { useEffect } from 'react';
import { X, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../types/index.ts';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  item,
  onClose,
  onPrev,
  onNext
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && onPrev) onPrev();
      if (e.key === 'ArrowRight' && onNext) onNext();
    };
    if (item) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, onClose, onPrev, onNext]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* Top action bar */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Navigation arrows */}
      {onPrev && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer hidden sm:block"
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {onNext && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer hidden sm:block"
          aria-label="Selanjutnya"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Content wrapper */}
      <div className="max-w-4xl w-full max-h-[90vh] flex flex-col bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
        
        {/* Media Display */}
        <div className="relative flex-1 bg-black flex items-center justify-center min-h-[320px] max-h-[65vh] overflow-hidden">
          {item.type === 'video' ? (
            <div className="w-full aspect-video">
              <iframe
                src={item.url}
                title={item.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={item.url}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
            />
          )}
        </div>

        {/* Caption & Metadata */}
        <div className="p-5 bg-slate-900 text-white border-t border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-sky-400" />
              <span>{item.category}</span>
              <span aria-hidden="true">·</span>
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{item.date}</span>
            </div>
            <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
              SMA NEGERI 1 JULOK DOKUMENTASI
            </span>
          </div>

          <p className="text-base font-bold text-white leading-snug">
            {item.title}
          </p>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            {item.caption}
          </p>
        </div>

      </div>
    </div>
  );
};
