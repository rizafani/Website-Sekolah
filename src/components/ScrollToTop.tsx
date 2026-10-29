import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!visible) return null;

  return (
    <button
      onClick={scrollToTop}
      aria-label="Kembali ke atas"
      className="fixed bottom-6 right-6 z-40 p-3 bg-sky-900 text-white rounded-full shadow-lg hover:bg-sky-800 transition-all duration-200 border border-sky-700/50 cursor-pointer animate-in fade-in zoom-in-75"
      title="Kembali ke atas"
    >
      <ArrowUp className="w-4 h-4" />
    </button>
  );
};
