import React, { useState } from 'react';
import { Monitor, FileCheck, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Download } from 'lucide-react';

interface AssessmentViewProps {
  onNavigate: (view: string) => void;
  onOpenDigitalServices: () => void;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({ onNavigate, onOpenDigitalServices }) => {
  const [activeTab, setActiveTab] = useState<'anbk' | 'sas' | 'cbt'>('anbk');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Evaluasi & Ujian
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Informasi Ujian & Asesmen Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Panduan teknis pelaksanaan Asesmen Nasional Berbasis Komputer (ANBK), Penilaian Sumatif Akhir Semester, dan portal CBT SMAN 1 Julok.
        </p>
      </div>

      {/* Segmented Tab */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
        <button
          onClick={() => setActiveTab('anbk')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'anbk' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Asesmen Nasional (ANBK)
        </button>
        <button
          onClick={() => setActiveTab('sas')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'sas' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sumatif Akhir Semester (SAS)
        </button>
        <button
          onClick={() => setActiveTab('cbt')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'cbt' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sistem CBT & Gladi Bersih
        </button>
      </div>

      {/* Tab 1: ANBK */}
      {activeTab === 'anbk' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Asesmen Nasional Berbasis Komputer (ANBK)</h2>
              <p className="text-xs text-slate-500">Program Evaluasi Sistem Pendidikan oleh Kemendikbudristek</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            ANBK diikuti oleh sampel acak 45 siswa kelas XI (ditambah 5 siswa cadangan) dari sistem Dapodikdasmen. Asesmen ini bertujuan mengukur mutu satuan pendidikan, mencakup Asesmen Kompetensi Minimum (AKM Literasi dan Numerasi), Survei Karakter, serta Survei Lingkungan Belajar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-sky-800">Komponen 1</span>
              <p className="text-xs font-bold text-slate-900">AKM Literasi & Numerasi</p>
              <p className="text-xs text-slate-600">Menguji kemampuan bernalar membaca teks informasi/sastra dan pemecahan masalah kuantitatif.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-sky-800">Komponen 2</span>
              <p className="text-xs font-bold text-slate-900">Survei Karakter</p>
              <p className="text-xs text-slate-600">Mengukur sikap, kebiasaan, dan nilai-nilai akhlak mulia sesuai 6 dimensi Profil Pelajar Pancasila.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-[11px] font-bold text-sky-800">Komponen 3</span>
              <p className="text-xs font-bold text-slate-900">Survei Lingkungan Belajar</p>
              <p className="text-xs text-slate-600">Diisi oleh seluruh guru dan kepala sekolah untuk memetakan iklim keamanan, inklusivitas, dan kebersihan sekolah.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SAS */}
      {activeTab === 'sas' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Penilaian Sumatif Akhir Semester (SAS)</h2>
              <p className="text-xs text-slate-500">Evaluasi Capaian Pembelajaran Semester Gasal & Genap</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Penilaian Sumatif Akhir Semester dilaksanakan pada akhir semester ganjil dan genap untuk mengukur ketercapaian tujuan pembelajaran pada setiap mata pelajaran. Hasil SAS dikombinasikan dengan asesmen formatif harian dan portofolio projek sebagai dasar penyusunan Laporan Hasil Belajar (E-Rapor).
          </p>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <p className="font-bold">Ketentuan Tata Tertib Peserta Ujian:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Peserta hadir di ruang ujian 15 menit sebelum waktu dimulai dengan seragam sekolah rapi dan lengkap.</li>
              <li>Wajib membawa kartu tanda peserta ujian resmi yang telah distempel bagian kurikulum.</li>
              <li>Dilarang membawa alat komunikasi genggam (HP) selain perangkat yang diizinkan untuk CBT.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Tab 3: CBT */}
      {activeTab === 'cbt' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Sistem CBT & Gladi Bersih Ujian</h2>
              <p className="text-xs text-slate-500">Platform Ujian Berbasis Komputer & Jaringan Lokal SMAN 1 Julok</p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            Laboratorium Komputer SMAN 1 Julok dilengkapi server lokal berkecepatan tinggi, sistem uninterruptible power supply (UPS), serta koneksi internet cadangan untuk menjamin ujian berjalan tanpa kendala teknis atau pemadaman listrik.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenDigitalServices}
              className="px-5 py-2.5 rounded-lg bg-sky-900 text-white font-semibold text-xs hover:bg-sky-800 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-sky-300" />
              <span>Buka Portal CBT Internal Siswa</span>
            </button>
            <button
              onClick={() => onNavigate('unduhan')}
              className="px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Unduh Panduan Siswa CBT (PDF)</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
