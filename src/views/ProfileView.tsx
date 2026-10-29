import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  MapPin, 
  Calendar, 
  FileCheck, 
  CheckCircle2, 
  BookOpen, 
  Compass, 
  Target 
} from 'lucide-react';
import { SchoolSettings } from '../types/index.ts';

interface ProfileViewProps {
  settings: SchoolSettings;
  onNavigate: (view: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-12">
      
      {/* Page Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Profil Lembaga
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Profil Resmi SMA Negeri 1 Julok
        </h1>
        <p className="text-sm text-slate-600">
          Identitas resmi, legalitas pendirian, akreditasi, dan arah pengembangan pendidikan di Buket Seuraja, Julok, Aceh Timur.
        </p>
      </div>

      {/* Featured Campus Image */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative aspect-21/9 bg-slate-900">
        <img
          src={settings.heroImageUrl || "/src/assets/images/hero_sman1julok_1793290495969.jpg"}
          alt="Kompleks SMAN 1 Julok"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-6 text-white">
          <div>
            <p className="text-xs text-sky-300 font-semibold">Kampus Hijau Ramah Lingkungan</p>
            <p className="text-lg font-bold">SMA Negeri 1 Julok, Kabupaten Aceh Timur</p>
          </div>
        </div>
      </div>

      {/* Identitas Resmi Tabel / Metadata Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-sky-800" />
            <h2 className="text-lg font-bold text-slate-900">Identitas Pokok Sekolah</h2>
          </div>
          <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md">
            Terverifikasi Kemendikbudristek
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-xs sm:text-sm">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Nama Resmi Sekolah</span>
            <span className="font-semibold text-slate-900 text-right">{settings.name}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Nomor Pokok Sekolah Nasional (NPSN)</span>
            <span className="font-mono font-bold text-sky-900">{settings.npsn}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Bentuk Pendidikan & Status</span>
            <span className="font-semibold text-slate-900">Sekolah Menengah Atas (Negeri)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Peringkat Akreditasi</span>
            <span className="font-bold text-emerald-700">{settings.accreditation} (Nilai {settings.stats.accreditationScore})</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Kurikulum Operasional</span>
            <span className="font-semibold text-slate-900">{settings.curriculum}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Kepala Sekolah</span>
            <span className="font-semibold text-slate-900">{settings.principalName}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Desa / Kelurahan</span>
            <span className="font-semibold text-slate-900">{settings.village}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Kecamatan</span>
            <span className="font-semibold text-slate-900">{settings.district}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Kabupaten & Provinsi</span>
            <span className="font-semibold text-slate-900">{settings.regency}, {settings.province}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Kode Pos</span>
            <span className="font-mono font-semibold text-slate-900">{settings.postalCode}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Jam Pelayanan</span>
            <span className="font-semibold text-slate-900">{settings.operatingHours}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Email Resmi</span>
            <span className="font-mono text-sky-800 font-medium">{settings.email}</span>
          </div>
        </div>
      </div>

      {/* Profil Ringkas Sub-Nav */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-800 flex items-center justify-center">
            <Calendar className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Sejarah Berdiri</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Berdiri sejak tahun 1993 untuk melayani kebutuhan pendidikan menengah atas masyarakat Kecamatan Julok dan sekitarnya.
          </p>
          <button 
            onClick={() => onNavigate('sejarah')}
            className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1"
          >
            <span>Baca Sejarah Selengkapnya</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Visi & Misi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mewujudkan insan yang berkarakter Islami, unggul dalam sains teknologi, berbudaya kearifan lokal Aceh, dan berwawasan global.
          </p>
          <button 
            onClick={() => onNavigate('visi-misi')}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
          >
            <span>Uraian Visi & Misi</span>
          </button>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-800 flex items-center justify-center">
            <Building2 className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Struktur Organisasi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Didukung pimpinan sekolah, Komite Sekolah, dewan guru berpengalaman, dan tenaga kependidikan berdedikasi tinggi.
          </p>
          <button 
            onClick={() => onNavigate('organisasi')}
            className="text-xs font-semibold text-purple-800 hover:text-purple-950 flex items-center gap-1"
          >
            <span>Lihat Bagan Organisasi</span>
          </button>
        </div>
      </div>

    </div>
  );
};
