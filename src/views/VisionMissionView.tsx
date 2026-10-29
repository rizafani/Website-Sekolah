import React from 'react';
import { Target, Compass, CheckCircle2, ArrowLeft, Heart, Sparkles, BookOpen } from 'lucide-react';
import { SchoolSettings } from '../types/index.ts';

interface VisionMissionViewProps {
  settings: SchoolSettings;
  onNavigate: (view: string) => void;
}

export const VisionMissionView: React.FC<VisionMissionViewProps> = ({ settings, onNavigate }) => {
  const missions = [
    "Menumbuhkembangkan keimanan dan ketakwaan kepada Allah SWT serta pengamalan syariat Islam dalam seluruh aktivitas harian sekolah.",
    "Melaksanakan pembelajaran berdiferensiasi dan bimbingan sains-teknologi secara efektif sehingga potensi setiap siswa berkembang optimal.",
    "Membudayakan literasi, numerasi, dan nalar kritis siswa melalui riset, karya ilmiah remaja (KIR), dan pemanfaatan perpustakaan digital.",
    "Melestarikan dan mengembangkan seni, budaya, serta kearifan lokal Aceh sebagai jati diri bangsa yang beradab dan bermartabat.",
    "Membangun jejaring kolaborasi dengan perguruan tinggi, dunia usaha/industri, dan alumni guna menyongsong kelanjutan studi ke PTN favorit.",
    "Mewujudkan lingkungan sekolah yang bersih, hijau, ramah anak, bebas perundungan (anti-bullying), dan sadar kelestarian pesisir."
  ];

  const goals = [
    {
      period: "Tujuan Jangka Pendek (1 Tahun)",
      items: [
        "Peningkatan persentase lulusan yang diterima di Perguruan Tinggi Negeri (PTN) melalui jalur SNBP dan SNBT minimal 15%.",
        "Meraih minimal 3 gelar juara olimpiade sains (OSN) dan festival seni FLS2N di tingkat Kabupaten/Provinsi.",
        "Optimalisasi 100% pembelajaran berbasis platform digital dan asesmen komputer mandiri (CBT)."
      ]
    },
    {
      period: "Tujuan Jangka Menengah (4 Tahun)",
      items: [
        "Mempertahankan akreditasi A (Unggul) dengan peningkatan skor mutu sarana prasarana dan mutu lulusan.",
        "Melahirkan siswa hafidz Quran juz 30 dan juz 1 minimal 40% dari total lulusan melalui program Tahsin & Tahfidz Rohis.",
        "Membangun kemitraan strategis dengan institusi riset dan konservasi lingkungan hidup di Aceh Timur."
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      <div>
        <button
          onClick={() => onNavigate('profil')}
          className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Profil Sekolah</span>
        </button>
      </div>

      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Arah & Panduan Nilai
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Visi, Misi & Tujuan Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Fondasi filosofis dan peta jalan penyelenggaraan pendidikan di SMA Negeri 1 Julok.
        </p>
      </div>

      {/* VISI BOX */}
      <div className="bg-sky-950 text-white rounded-2xl p-8 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-sky-800/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 uppercase tracking-widest">
            <Compass className="w-4 h-4" />
            <span>Visi SMA Negeri 1 Julok</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight text-white">
            "Terwujudnya Peserta Didik yang Unggul dalam Prestasi, Berkarakter Islami, Berbudaya Lingkungan, dan Berwawasan Global."
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2">
            Visi ini menjadi kompas seluruh pendidik, tenaga kependidikan, siswa, dan komite sekolah dalam setiap derap langkah pembaharuan kurikulum dan pelayanan publik.
          </p>
        </div>
      </div>

      {/* MISI SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-sky-800" />
          <h2 className="text-xl font-bold text-slate-900">Misi Sekolah</h2>
        </div>
        <p className="text-xs text-slate-600">
          Upaya terencana dan terukur yang dilaksanakan secara konsisten oleh seluruh civitas akademika:
        </p>
        <div className="grid grid-cols-1 gap-3 pt-2">
          {missions.map((m, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3.5 shadow-2xs"
            >
              <div className="w-6 h-6 rounded-md bg-sky-100 text-sky-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                {m}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* TUJUAN SEKOLAH */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-900">Tujuan Strategis Pendidikan</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((g, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-sky-900 pb-2 border-b border-slate-100">
                {g.period}
              </h3>
              <ul className="space-y-3">
                {g.items.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
