import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  items: Array<{ label: string; view?: string }>;
  onNavigate: (view: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="bg-slate-100/80 border-b border-slate-200 py-2.5 px-4 sm:px-8 text-xs text-slate-600">
      <div className="max-w-7xl mx-auto flex items-center flex-wrap gap-1.5">
        <button
          onClick={() => onNavigate('beranda')}
          className="flex items-center gap-1 text-slate-500 hover:text-sky-900 transition-colors cursor-pointer"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </button>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <React.Fragment key={index}>
              <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
              {isLast || !item.view ? (
                <span className="font-semibold text-sky-950 truncate max-w-[200px] sm:max-w-md">
                  {item.label}
                </span>
              ) : (
                <button
                  onClick={() => onNavigate(item.view!)}
                  className="hover:text-sky-900 transition-colors cursor-pointer truncate max-w-[150px] sm:max-w-none"
                >
                  {item.label}
                </button>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </nav>
  );
};
