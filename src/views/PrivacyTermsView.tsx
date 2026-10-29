import React from 'react';
import { ShieldCheck, Lock, FileText, ArrowLeft } from 'lucide-react';
import { SchoolSettings } from '../types/index.ts';

interface PrivacyTermsViewProps {
  settings: SchoolSettings;
  onNavigate: (view: string) => void;
}

export const PrivacyTermsView: React.FC<PrivacyTermsViewProps> = ({ settings, onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      <div>
        <button
          onClick={() => onNavigate('beranda')}
          className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </button>
      </div>

      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Legalitas & Keamanan Data
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kebijakan Privasi & Ketentuan Penggunaan
        </h1>
        <p className="text-sm text-slate-600">
          Standar perlindungan data pribadi siswa, orang tua, dan ketentuan akses portal resmi SMA Negeri 1 Julok.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8 text-xs sm:text-sm text-slate-700 leading-relaxed">
        
        {/* Section 1 */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>1. Kebijakan Privasi & Perlindungan Data Pribadi</span>
          </h2>
          <p>
            SMA Negeri 1 Julok berkomitmen penuh menjaga kerahasiaan dan keamanan data pribadi yang diserahkan oleh calon siswa, siswa aktif, orang tua/wali, serta dewan guru melalui formulir SPMB, buku tamu, atau sistem pembelajaran daring.
          </p>
          <p>
            Data kependudukan seperti Nomor Induk Kependudukan (NIK), Nomor Induk Siswa Nasional (NISN), nomor telepon orang tua, dan dokumen kartu keluarga hanya digunakan untuk keperluan verifikasi kedinasan pada sistem Dapodikdasmen Kemendikbudristek dan tidak akan pernah diperjualbelikan atau dialihkan kepada pihak ketiga di luar kepentingan pendidikan.
          </p>
        </div>

        {/* Section 2 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-4 h-4 text-sky-800" />
            <span>2. Keamanan Akses Portal Digital</span>
          </h2>
          <p>
            Portal layanan digital seperti E-Rapor, Sistem CBT, dan Presensi dilindungi oleh protokol enkripsi data standar. Setiap siswa dan pendidik bertanggung jawab menjaga kerahasiaan kata sandi akun masing-masing dan segera melaporkan ke tim TIK sekolah bila menemukan kejanggalan aktivitas akun.
          </p>
        </div>

        {/* Section 3 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-700" />
            <span>3. Hak Cipta & Penggunaan Konten Publik</span>
          </h2>
          <p>
            Seluruh materi warta berita, dokumentasi foto kegiatan, silabus, dan modul pembelajaran yang dipublikasikan pada domain resmi SMA Negeri 1 Julok merupakan hak cipta institusi. Penggunaan untuk keperluan edukatif non-komersial diizinkan dengan tetap menyertakan atribusi sumber resmi SMA Negeri 1 Julok, Kabupaten Aceh Timur.
          </p>
        </div>

        {/* Section 4 */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-base font-bold text-slate-900">4. Kontak Pengaduan Data</h2>
          <p>
            Apabila Anda memiliki pertanyaan, keberatan, atau ingin memperbarui data pribadi pada sistem sekolah, silakan hubungi bagian Tata Usaha SMAN 1 Julok:
          </p>
          <p className="font-mono text-sky-900">
            Email: {settings.email} · Telepon: {settings.phone}
          </p>
        </div>

      </div>

    </div>
  );
};
