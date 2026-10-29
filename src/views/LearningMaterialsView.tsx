import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Search, 
  Filter, 
  FileText, 
  User as UserIcon, 
  Lock, 
  CheckCircle2, 
  GraduationCap, 
  Calendar 
} from 'lucide-react';
import { LearningMaterial } from '../types/index.ts';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';

interface LearningMaterialsViewProps {
  materials: LearningMaterial[];
  onNavigate: (view: string) => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

export const LearningMaterialsView: React.FC<LearningMaterialsViewProps> = ({
  materials,
  onNavigate,
  onOpenLogin,
  isLoggedIn
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadSuccessToast, setDownloadSuccessToast] = useState<string | null>(null);

  const subjects = Array.from(new Set(materials.map(m => m.subject)));

  const filtered = materials.filter(m => {
    const matchesGrade = selectedGrade === 'all' || m.gradeLevel === selectedGrade;
    const matchesSearch = 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.authorTeacher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGrade && matchesSearch;
  });

  const handleDownload = (mat: LearningMaterial) => {
    if (mat.isRestricted && !isLoggedIn) {
      onOpenLogin();
      return;
    }
    setDownloadSuccessToast(`Mengunduh berkas materi: '${mat.title}'`);
    setTimeout(() => setDownloadSuccessToast(null), 3500);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <Breadcrumbs
        items={[
          { label: 'Akademik', view: 'kurikulum' },
          { label: 'Bank Materi & Modul Ajar' }
        ]}
        onNavigate={onNavigate}
      />

      {downloadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-emerald-900 text-emerald-100 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 border border-emerald-700 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{downloadSuccessToast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Banner */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm mb-8">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 mb-1">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>BANK SUMBER BELAJAR DIGITAL</span>
            <span className="text-slate-400">·</span>
            <span>Kurikulum Merdeka</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Modul Ajar, Bahan Tayang & Lembar Kerja Siswa
          </h1>
          <p className="text-sm text-slate-600 mt-2 max-w-2xl leading-relaxed">
            Akses materi pembelajaran resmi yang disusun oleh Dewan Guru SMA Negeri 1 Julok. Materi terbuka bagi seluruh peserta didik dan masyarakat untuk menunjang pembelajaran mandiri.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <button
              onClick={() => setSelectedGrade('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedGrade === 'all' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Fase / Tingkat
            </button>
            <button
              onClick={() => setSelectedGrade('X')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedGrade === 'X' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Kelas X (Fase E)
            </button>
            <button
              onClick={() => setSelectedGrade('XI')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedGrade === 'XI' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Kelas XI (Fase F)
            </button>
            <button
              onClick={() => setSelectedGrade('XII')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedGrade === 'XII' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Kelas XII
            </button>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Cari topik atau mata pelajaran..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mat) => (
            <div
              key={mat.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-sky-900 bg-sky-50 px-2.5 py-0.5 rounded border border-sky-100">
                    Kelas {mat.gradeLevel} · {mat.subject}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-slate-400">
                    {mat.fileType} · {mat.fileSize}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {mat.title}
                </h3>

                <p className="text-xs text-slate-600">
                  Topik: <strong>{mat.topic}</strong>
                </p>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{mat.authorTeacher}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{mat.uploadedDate}</span>
                </span>

                <button
                  onClick={() => handleDownload(mat)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    mat.isRestricted
                      ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
                      : 'bg-sky-900 text-white hover:bg-sky-800 shadow-xs'
                  }`}
                >
                  {mat.isRestricted ? (
                    <>
                      <Lock className="w-3.5 h-3.5 text-amber-700" />
                      <span>{isLoggedIn ? 'Unduh Terproteksi' : 'Login Diperlukan'}</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh Modul</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
