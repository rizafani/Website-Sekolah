import React from 'react';
import { ArrowLeft, Users, ShieldCheck, GraduationCap, Building2, UserCheck } from 'lucide-react';
import { SchoolSettings } from '../types/index.ts';

interface OrganizationViewProps {
  settings: SchoolSettings;
  onNavigate: (view: string) => void;
}

export const OrganizationView: React.FC<OrganizationViewProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
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
          Tata Kelola & Manajemen
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Struktur Organisasi Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Susunan kepemimpinan, komite sekolah, dan pembagian tugas manajemen SMA Negeri 1 Julok.
        </p>
      </div>

      {/* Organization Chart Visual */}
      <div className="space-y-8">
        
        {/* Tier 1: Kepala Sekolah & Komite */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          
          <div className="p-6 rounded-2xl bg-sky-950 text-white text-center space-y-2 shadow-md">
            <span className="text-[11px] font-semibold text-sky-300 uppercase tracking-wider">Pimpinan Sekolah</span>
            <h2 className="text-base font-bold">{settings.principalName}</h2>
            <p className="text-xs text-slate-300 font-mono">Kepala Sekolah · NIP. {settings.principalNip}</p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-2 shadow-md">
            <span className="text-[11px] font-semibold text-amber-300 uppercase tracking-wider">Mitra Masyarakat</span>
            <h2 className="text-base font-bold">Tgk. H. Mukhtaruddin, S.Pd.</h2>
            <p className="text-xs text-slate-300">Ketua Komite SMA Negeri 1 Julok</p>
          </div>

        </div>

        {/* Connecting Line */}
        <div className="w-0.5 h-6 bg-slate-300 mx-auto" />

        {/* Tier 2: Wakil Kepala Sekolah */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-sky-800">Bidang Kurikulum</span>
            <p className="text-xs font-bold text-slate-900">Nurul Hidayati, S.Pd., M.Si.</p>
            <p className="text-[11px] text-slate-500">Wakil Kepala Sekolah</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-sky-800">Bidang Kesiswaan</span>
            <p className="text-xs font-bold text-slate-900">Iskandar, S.Pd., M.Pd.</p>
            <p className="text-[11px] text-slate-500">Wakil Kepala Sekolah</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-sky-800">Bidang Sarana & Prasarana</span>
            <p className="text-xs font-bold text-slate-900">Rahmatsyah, S.Pd.</p>
            <p className="text-[11px] text-slate-500">Wakil Kepala Sekolah</p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 text-center space-y-1 shadow-2xs">
            <span className="text-[10px] uppercase font-bold text-sky-800">Bidang Hubungan Masyarakat</span>
            <p className="text-xs font-bold text-slate-900">Cut Maryani, S.Pd.</p>
            <p className="text-[11px] text-slate-500">Wakil Kepala Sekolah</p>
          </div>

        </div>

        {/* Tier 3: Unit Penunjang Akademik & Administrasi */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Koordinator Unit Kerja & Penunjang
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Kepala Tata Usaha</span>
              <p className="font-bold text-slate-900">Zulkifli, S.Sos.</p>
              <p className="text-slate-600">Pelayanan administrasi kepegawaian & persuratan</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Kepala Perpustakaan</span>
              <p className="font-bold text-slate-900">Dra. Halimah</p>
              <p className="text-slate-600">Perpustakaan Cut Nyak Dien & OPAC Digital</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Kepala Lab Komputer & IT</span>
              <p className="font-bold text-slate-900">Cut Mutia Zahra, S.Kom.</p>
              <p className="text-slate-600">Jaringan server CBT & laboratorium multimedia</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Koordinator BP / BK</span>
              <p className="font-bold text-slate-900">Siti Rahmah, S.Pd.</p>
              <p className="text-slate-600">Bimbingan konseling pribadi, sosial & karir PTN</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Operator Dapodik</span>
              <p className="font-bold text-slate-900">Muhammad Munir, A.Md.</p>
              <p className="text-slate-600">Pendataan siswa, rombel & sinkronisasi pusat</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Koordinator Keagamaan & Rohis</span>
              <p className="font-bold text-slate-900">Tgk. Zulfikar, S.Pd.I., M.Ag.</p>
              <p className="text-slate-600">Musholla Al-Ikhlas & pembinaan syiar Islam</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
