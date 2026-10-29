import React from 'react';
import { BookOpen, Sparkles, CheckCircle2, ArrowRight, Layers, Award, Compass, Heart } from 'lucide-react';

interface CurriculumViewProps {
  onNavigate: (view: string) => void;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ onNavigate }) => {
  const p5Themes = [
    {
      theme: "Kewirausahaan Berbasis Kearifan Lokal Aceh",
      phase: "Fase E (Kelas X)",
      description: "Siswa merancang produk bernilai ekonomis memanfaatkan potensi sumber daya pesisir Julok, seperti olahan pangan lokal, kerajinan pucok reubong, dan pupuk organik hayati."
    },
    {
      theme: "Bhinneka Tunggal Ika & Pelestarian Adat",
      phase: "Fase F (Kelas XI)",
      description: "Eksplorasi nilai gotong royong dalam meuseuraya, pagelaran seni tradisional Seudati dan Ratoh Duek, serta penguatan toleransi kebangsaan."
    },
    {
      theme: "Gaya Hidup Berkelanjutan & Konservasi Pesisir",
      phase: "Fase F (Kelas XII)",
      description: "Riset dan aksi nyata pelestarian ekosistem bakau (mangrove) di pesisir Kuala Julok serta pengelolaan sampah plastik sekolah."
    }
  ];

  const flagshipPrograms = [
    {
      title: "Program Tahsin & Tahfidz Al-Qur'an",
      desc: "Pembiasaan membaca Al-Qur'an bertajwid dan hafalan juz 30 yang terintegrasi pada kegiatan pagi sebelum jam pelajaran pertama."
    },
    {
      title: "Karantina & Bimbingan Intensif OSN",
      desc: "Pendampingan khusus oleh guru pembina bersertifikat untuk bidang Matematika, Fisika, Kimia, Biologi, Astronomi, dan Kebumian."
    },
    {
      title: "Sukses Menembus PTN (SNBP & SNBT)",
      desc: "Simulasi try out UTBK berkala, pendampingan portofolio nilai rapor semester 1-5, dan konsultasi minat bakat karir bersama Guru BK."
    },
    {
      title: "Literasi Digital & Kelas Multimedia",
      desc: "Pemanfaatan perpustakaan digital Cut Nyak Dien, literasi komputasional, serta penulisan karya tulis ilmiah remaja."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Struktur Pembelajaran
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kurikulum & Program Unggulan
        </h1>
        <p className="text-sm text-slate-600">
          Implementasi Kurikulum Merdeka Mandiri Berbagi, Projek P5, dan program pembinaan prestasi di SMA Negeri 1 Julok.
        </p>
      </div>

      {/* Overview Kurikulum Merdeka */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Kurikulum Merdeka di SMA Negeri 1 Julok</h2>
            <p className="text-xs text-slate-500">Kategori: Mandiri Berbagi · Surat Keputusan BSKAP Kemendikbudristek</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          SMA Negeri 1 Julok menerapkan Kurikulum Merdeka yang dirancang untuk memberikan keleluasaan kepada pendidik dalam menciptakan pembelajaran berkualitas yang sesuai dengan kebutuhan dan lingkungan belajar peserta didik. Pada kurikulum ini, siswa tidak disekat oleh penjurusan kaku di awal, melainkan diawali dengan Fase E (Kelas X) untuk memperkuat fondasi umum, dilanjutkan Fase F (Kelas XI dan XII) di mana siswa secara merdeka memilih mata pelajaran pilihan sesuai bakat, minat, dan rencana karir studi lanjut.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-xs font-bold text-sky-900">Fase E (Kelas X)</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mata pelajaran umum wajib meliputi PAI, PPKn, Bahasa Indonesia, Matematika, IPA (Fisika, Kimia, Biologi), IPS (Sosiologi, Ekonomi, Sejarah, Geografi), Bahasa Inggris, PJOK, Seni Budaya, dan Informatika.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <p className="text-xs font-bold text-sky-900">Fase F (Kelas XI & XII)</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Mata pelajaran umum ditambah 4-5 mata pelajaran pilihan sesuai rumpun MIPA (Biologi, Fisika, Kimia, Matematika Tingkat Lanjut) atau rumpun IPS (Ekonomi, Sosiologi, Geografi) untuk persiapan UTBK-SNBT.
            </p>
          </div>
        </div>
      </div>

      {/* P5 SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          <h2 className="text-xl font-bold text-slate-900">Projek Penguatan Profil Pelajar Pancasila (P5)</h2>
        </div>
        <p className="text-xs text-slate-600">
          Pembelajaran lintas disiplin ilmu untuk mengamati dan memikirkan solusi terhadap permasalahan lingkungan sekitar:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {p5Themes.map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2.5 shadow-2xs">
              <span className="text-[11px] font-bold text-sky-800">{item.phase}</span>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">{item.theme}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* PROGRAM UNGGULAN */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-sky-800" />
          <h2 className="text-xl font-bold text-slate-900">4 Program Unggulan Sekolah</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {flagshipPrograms.map((prog, idx) => (
            <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{prog.title}</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-6">
                {prog.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action for SPMB or Assessment */}
      <div className="p-6 rounded-2xl bg-sky-950 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <p className="font-bold text-base">Ingin Bergabung Bersama Kami?</p>
          <p className="text-xs text-slate-300">Pendaftaran Penerimaan Murid Baru (SPMB) terbuka untuk lulusan SMP/MTs sederajat.</p>
        </div>
        <button
          onClick={() => onNavigate('spmb')}
          className="px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors shrink-0"
        >
          Daftar SPMB Online
        </button>
      </div>

    </div>
  );
};
