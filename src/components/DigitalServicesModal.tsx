import React, { useState } from 'react';
import { 
  X, 
  ExternalLink, 
  GraduationCap, 
  BookOpen, 
  Monitor, 
  FileCheck, 
  Database, 
  Users, 
  Compass, 
  CheckCircle2, 
  Lock 
} from 'lucide-react';

interface DigitalServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToSpmb: () => void;
}

export const DigitalServicesModal: React.FC<DigitalServicesModalProps> = ({
  isOpen,
  onClose,
  onNavigateToSpmb
}) => {
  const [activeTab, setActiveTab] = useState<'siswa' | 'guru' | 'publik'>('siswa');
  const [simulatedPortal, setSimulatedPortal] = useState<string | null>(null);

  if (!isOpen) return null;

  const services = [
    {
      id: 'erapor',
      title: 'Aplikasi E-Rapor Kurikulum Merdeka',
      category: 'siswa',
      desc: 'Akses nilai hasil belajar semester, deskripsi capaian kompetensi, dan cetak rapor berkas resmi siswa.',
      target: 'Siswa & Orang Tua',
      badge: 'Aktif Semester Ganjil',
      icon: FileCheck,
      color: 'bg-emerald-600',
      action: () => setSimulatedPortal('E-Rapor Digital SMAN 1 Julok')
    },
    {
      id: 'cbt',
      title: 'Portal CBT & Asesmen Ujian Online',
      category: 'siswa',
      desc: 'Platform pelaksanaan ujian mandiri, try out ANBK, dan Penilaian Sumatif Akhir Jenjang berbasis web.',
      target: 'Siswa',
      badge: 'Server Ujian Siaga',
      icon: Monitor,
      color: 'bg-sky-600',
      action: () => setSimulatedPortal('Portal Ujian CBT SMAN 1 Julok')
    },
    {
      id: 'library',
      title: 'OPAC Perpustakaan Cut Nyak Dien',
      category: 'siswa',
      desc: 'Katalog pencarian buku elektronik (E-Book), jurnal riset, dan reservasi peminjaman literatur.',
      target: 'Semua Warga Sekolah',
      badge: '5.000+ Judul',
      icon: BookOpen,
      color: 'bg-indigo-600',
      action: () => setSimulatedPortal('Katalog OPAC Perpustakaan Digital')
    },
    {
      id: 'spmb_online',
      title: 'Sistem Penerimaan Murid Baru (SPMB)',
      category: 'publik',
      desc: 'Pendaftaran calon peserta didik baru terintegrasi jalur Zonasi, Prestasi, Afirmasi, dan Perpindahan.',
      target: 'Calon Siswa & Publik',
      badge: 'Gelombang Aktif',
      icon: GraduationCap,
      color: 'bg-amber-600',
      action: () => {
        onClose();
        onNavigateToSpmb();
      }
    },
    {
      id: 'dapodik',
      title: 'Sinkronisasi Dapodikdasmen Kemendikbud',
      category: 'guru',
      desc: 'Pusat integrasi data pokok pendidikan siswa, rombel, sarana prasarana, dan PTK sekolah ke pusat.',
      target: 'Operator & Dewan Guru',
      badge: 'Terintegrasi Nasional',
      icon: Database,
      color: 'bg-rose-600',
      action: () => setSimulatedPortal('Integrasi Dapodikdasmen SMAN 1 Julok')
    },
    {
      id: 'presensi',
      title: 'Sistem Presensi Digital Guru & Tendik',
      category: 'guru',
      desc: 'Pencatatan kehadiran harian berbasis GPS dan verifikasi biometrik jam dinas pendidikan Aceh.',
      target: 'Guru & Karyawan',
      badge: 'Real-time',
      icon: Users,
      color: 'bg-purple-600',
      action: () => setSimulatedPortal('Presensi Online PTK SMAN 1 Julok')
    },
    {
      id: 'karir',
      title: 'Portal SNBP & Bimbingan Karir PTN',
      category: 'siswa',
      desc: 'Rekomendasi jurusan perguruan tinggi, simulasi skor SNBT, serta data serapan alumni SMAN 1 Julok di PTN terkemuka.',
      target: 'Siswa Kelas XII',
      badge: 'Bimbingan Terbimbing',
      icon: Compass,
      color: 'bg-teal-600',
      action: () => setSimulatedPortal('Portal Karir & Kelanjutan Studi PTN')
    }
  ];

  const filteredServices = services.filter(s => activeTab === 'publik' ? true : s.category === activeTab || s.category === 'publik');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-base">Pusat Layanan Digital Terpadu</p>
              <p className="text-xs text-slate-400">SMA Negeri 1 Julok · Kabupaten Aceh Timur</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Simulated Portal Modal View */}
        {simulatedPortal ? (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <p className="text-lg font-bold text-slate-900">{simulatedPortal}</p>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              Anda terhubung ke sistem internal sekolah secara aman. Bagi siswa dan guru, silakan gunakan akun NISN atau NIP resmi yang telah didistribusikan oleh bagian Tata Usaha SMAN 1 Julok.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 max-w-sm w-full text-left space-y-1">
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Single Sign-On (SSO) Terverifikasi</span>
              </p>
              <p className="text-[11px] text-slate-500">Status Server: Online 24/7 · Protokol SSL Terenkripsi</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setSimulatedPortal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Kembali ke Daftar Layanan
              </button>
              <button
                onClick={() => alert(`Membuka sesi terenkripsi untuk ${simulatedPortal}. Akun Anda siap digunakan!`)}
                className="px-4 py-2 text-xs font-semibold text-white bg-sky-900 hover:bg-sky-800 rounded-lg transition-colors"
              >
                Masuk Sesi Sekarang
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Filter Segmented Control */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/70 flex items-center justify-between">
              <div className="flex items-center gap-1 p-1 bg-slate-200/60 rounded-lg">
                <button
                  onClick={() => setActiveTab('siswa')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'siswa' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Untuk Siswa
                </button>
                <button
                  onClick={() => setActiveTab('guru')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'guru' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Untuk Guru & Staf
                </button>
                <button
                  onClick={() => setActiveTab('publik')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                    activeTab === 'publik' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Semua Layanan
                </button>
              </div>

              <span className="text-xs text-slate-500 hidden sm:inline">
                {filteredServices.length} portal terdaftar
              </span>
            </div>

            {/* List of Services */}
            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredServices.map((svc) => {
                const IconComponent = svc.icon;
                return (
                  <div
                    key={svc.id}
                    className="p-4 rounded-xl border border-slate-200 hover:border-sky-300 hover:shadow-md transition-all flex flex-col justify-between bg-white group text-left"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className={`w-9 h-9 rounded-lg ${svc.color} text-white flex items-center justify-center shrink-0`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-medium text-slate-500">
                          {svc.badge}
                        </span>
                      </div>

                      <p className="text-sm font-bold text-slate-900 group-hover:text-sky-900 transition-colors">
                        {svc.title}
                      </p>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                        {svc.desc}
                      </p>
                    </div>

                    <div className="pt-4 mt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">{svc.target}</span>
                      <button
                        onClick={svc.action}
                        className="text-xs font-semibold text-sky-800 hover:text-sky-950 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                      >
                        <span>Akses Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer Notice */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
              <span>Keamanan akun dijamin oleh Tim IT SMAN 1 Julok</span>
              <button
                onClick={() => alert("Bantuan IT Sekolah: Hubungi Bagian TIK di Ruang Server Lantai 1 atau kirim email ke info@sman1julok.sch.id")}
                className="text-sky-800 font-medium hover:underline"
              >
                Butuh Bantuan Akun?
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
