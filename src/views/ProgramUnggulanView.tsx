import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  BookOpen, 
  Compass, 
  Cpu, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  Users, 
  Building2, 
  Calendar, 
  Share2,
  Printer
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';

interface ProgramUnggulanViewProps {
  onNavigate: (view: string, param?: string) => void;
}

export const ProgramUnggulanView: React.FC<ProgramUnggulanViewProps> = ({ onNavigate }) => {
  const [copied, setCopied] = useState(false);

  const programs = [
    {
      id: 'tahfiz',
      title: 'Program Unggulan Tahfiz Al-Qur\'an & Karakter Islami',
      tagline: 'Mencetak Generasi Qur\'ani yang Berintelektual & Berakhlak Mulia',
      icon: BookOpen,
      color: 'from-emerald-700 to-teal-800',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      description: 'Program pembinaan hafalan Al-Qur\'an terpadu yang dibimbing oleh ustadz/ustadzah tersertifikasi. Siswa dibimbing menghafal minimal 3 Juz selama menempuh pendidikan di SMAN 1 Julok serta mendalami fiqih ibadah dan akhlakul karimah khas Serambi Mekkah.',
      highlights: [
        'Target hafalan minimal Juz 30, Juz 1, dan Juz 2',
        'Halaqah Al-Qur\'an intensif setiap pagi sebelum jam pelajaran',
        'Munaqasyah hafalan dan wisuda tahfiz berkala',
        'Bebas biaya pendaftaran dan jalur beasiswa khusus tahfiz'
      ],
      stats: '120+ Siswa Terbina · 35 Wisudawan/Tahun'
    },
    {
      id: 'sains-osn',
      title: 'Klinik Sains & Akselerasi Olimpiade (OSN)',
      tagline: 'Pusat Inkubasi Prestasi Akademik Sains, Teknologi & Riset Pelajar',
      icon: Award,
      color: 'from-sky-800 to-indigo-900',
      badgeColor: 'bg-sky-100 text-sky-800',
      description: 'Pusat bimbingan khusus bagi peserta didik berbakat di bidang Matematika, Fisika, Kimia, Biologi, Astronomi, Kebumian, Ekonomi, dan Informatika untuk berlaga di ajang Olimpiade Sains Nasional (OSN) dari tingkat kabupaten hingga nasional.',
      highlights: [
        'Dukungan mentor dosen tamu dan dewan guru berprestasi',
        'Laboratorium sains modern (Fisika, Kimia, Biologi) berstandar nasional',
        'Simulasi berkala setara soal OSN Provinsi & Nasional',
        'Beasiswa pembinaan bagi peraih medali'
      ],
      stats: '15+ Medali OSN Tingkat Kab. Aceh Timur & Provinsi'
    },
    {
      id: 'literasi-budaya',
      title: 'Literasi Budaya Aceh & Sejarah Samudera Pasai',
      tagline: 'Menggali Khazanah Lokal Aceh untuk Wawasan Global',
      icon: Compass,
      color: 'from-amber-700 to-yellow-800',
      badgeColor: 'bg-amber-100 text-amber-800',
      description: 'Penguatan muatan lokal yang berakar kuat pada nilai-nilai perjuangan, kesusastraan Aceh, kearifan maritim Selat Malaka, serta riset cagar budaya sejarah pesisir timur Aceh, memperkuat jatidiri generasi muda Aceh di era global.',
      highlights: [
        'Pojok literasi naskah dan manuskrip sejarah pesisir Julok',
        'Pentas seni budaya Seudati, Saman, dan Ratoh Duek',
        'Penerbitan antologi karya sastra dan majalah dinding berkala',
        'Ekspedisi cagar budaya tahunan bersama balai pelestarian'
      ],
      stats: '3 Antologi Buku Diterbitkan · Mitra Budaya Aceh'
    },
    {
      id: 'digital-vokasi',
      title: 'Digital Creative Lab & Vokasi Keterampilan Mandiri',
      tagline: 'Keahlian Terapan Desain Komunikasi Visual & Agrobisnis Pesisir',
      icon: Cpu,
      color: 'from-purple-800 to-slate-900',
      badgeColor: 'bg-purple-100 text-purple-800',
      description: 'Membekali siswa keterampilan abad-21 mencakup coding dasar, desain grafis, editing video multimedia, serta kewirausahaan agrobisnis kelautan lokal agar memiliki kemandirian sebelum melanjutkan ke perguruan tinggi maupun dunia kerja.',
      highlights: [
        'Laboratorium Komputer Multimedia dengan software industri',
        'Pelatihan digital marketing produk UMKM lokal Buket Seuraja',
        'Sertifikasi keahlian komputer terapan bagi lulusan',
        'Pameran karya digital tahunan (Julok Technofair)'
      ],
      stats: '100% Siswa Mendapat Modul Literasi Digital'
    }
  ];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <Breadcrumbs
        items={[
          { label: 'Beranda', view: 'beranda' },
          { label: 'Profil Sekolah', view: 'profil' },
          { label: 'Program Unggulan' }
        ]}
        onNavigate={onNavigate}
      />

      {/* Header Banner */}
      <section className="bg-gradient-to-r from-sky-950 via-slate-900 to-sky-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-sky-900/50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Program Unggulan Unggul & Berkarakter</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Program Unggulan SMA Negeri 1 Julok
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              Kompilasi program strategis yang dirancang khusus untuk memadukan kedalaman spiritual Islami, kecemerlangan sains, kearifan budaya Aceh, dan kecakapan digital masa depan di Desa Buket Seuraja.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Tautan Disalin!' : 'Bagikan'}</span>
            </button>
            <button
              onClick={() => onNavigate('spmb')}
              className="px-4 py-2 text-xs font-bold text-sky-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <span>Daftar SPMB Sekarang</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {programs.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Card Banner */}
                  <div className={`p-6 bg-gradient-to-r ${item.color} text-white flex items-start justify-between gap-4`}>
                    <div className="space-y-1">
                      <span className="text-[11px] font-semibold tracking-wider uppercase text-slate-200 block">
                        Fokus Pembinaan
                      </span>
                      <h3 className="font-extrabold text-lg text-white leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-200/90 italic pt-1">
                        "{item.tagline}"
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>

                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <h4 className="text-xs font-bold text-slate-800">Keunggulan & Rangkaian Kegiatan:</h4>
                      <ul className="space-y-2">
                        {item.highlights.map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer Metric */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">{item.stats}</span>
                  <button
                    onClick={() => onNavigate('kontak')}
                    className="text-sky-800 hover:text-sky-950 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>Konsultasi Program</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Call to Action Banner */}
        <div className="p-8 rounded-2xl bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <h3 className="text-xl font-bold">Tertarik Mengikuti Program Unggulan Kami?</h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              Pendaftaran peserta didik baru (SPMB) SMA Negeri 1 Julok telah terintegrasi dengan penjaringan bakat istimewa tahfiz, olimpiade sains, dan jalur prestasi akademik.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigate('spmb')}
              className="w-full sm:w-auto px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-lg shadow-sm cursor-pointer transition-colors"
            >
              Daftar Siswa Baru (SPMB)
            </button>
            <button
              onClick={() => onNavigate('kurikulum')}
              className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg border border-white/20 cursor-pointer transition-colors"
            >
              Lihat Kurikulum Merdeka
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
