import React, { useState } from 'react';
import { 
  Globe, 
  ExternalLink, 
  GraduationCap, 
  BookOpen, 
  Monitor, 
  FileCheck, 
  Database, 
  Users, 
  CheckCircle2, 
  Lock, 
  Search,
  Server,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  KeyRound,
  Download,
  AlertCircle
} from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs.tsx';

interface DigitalServicesViewProps {
  onNavigate: (view: string, param?: string) => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
}

export const DigitalServicesView: React.FC<DigitalServicesViewProps> = ({
  onNavigate,
  onOpenLogin,
  isLoggedIn
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'siswa' | 'guru' | 'publik'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalApp, setActiveModalApp] = useState<any | null>(null);

  const services = [
    {
      id: 'erapor',
      title: 'Aplikasi E-Rapor Kurikulum Merdeka',
      category: 'siswa',
      categoryLabel: 'Layanan Siswa & Ortu',
      desc: 'Akses nilai capaian kompetensi semester, transkrip nilai, dan cetak rapor resmi digital SMA Negeri 1 Julok.',
      target: 'Siswa, Orang Tua & Wali Kelas',
      badge: 'Aktif Semester Ganjil 2026',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: FileCheck,
      color: 'bg-emerald-600',
      serverStatus: 'Online (Server Lokal & Cloud)',
      features: ['Unduh Lembar Hasil Belajar (LHB)', 'Rekapitulasi Nilai Asesmen Sumatif', 'Catatan Karakter Pelajar Pancasila']
    },
    {
      id: 'cbt',
      title: 'Portal CBT & Asesmen Ujian Mandiri',
      category: 'siswa',
      categoryLabel: 'Layanan Siswa',
      desc: 'Platform pelaksanaan ujian daring mandiri, Try Out ANBK, Penilaian Akhir Semester, dan ujian modul berbasis web tanpa distraksi.',
      target: 'Peserta Didik SMAN 1 Julok',
      badge: 'Server Ujian Siaga (Lokal Lan & Cloud)',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      icon: Monitor,
      color: 'bg-sky-600',
      serverStatus: 'Siaga (Load Balanced)',
      features: ['Bank Soal Terverifikasi Standar Nasional', 'Fitur Timer & Anti-Cheat', 'Penilaian Otomatis Pilihan Ganda & Analisis Soal']
    },
    {
      id: 'library',
      title: 'OPAC Perpustakaan Digital Cut Nyak Dien',
      category: 'publik',
      categoryLabel: 'Semua Warga Sekolah',
      desc: 'Katalog pencarian buku elektronik (E-Book), jurnal riset, literatur budaya Aceh, modul ajar, dan peminjaman koleksi fisik perpustakaan.',
      target: 'Siswa, Guru & Masyarakat',
      badge: '5.200+ Judul Buku & Jurnal',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: BookOpen,
      color: 'bg-indigo-600',
      serverStatus: 'Online 24 Jam',
      features: ['Akses Ribuan E-Book Kurikulum Merdeka', 'Peminjaman Buku dengan Barcode', 'Koleksi Khusus Sejarah & Budaya Aceh Timur']
    },
    {
      id: 'spmb_online',
      title: 'Sistem Penerimaan Murid Baru (SPMB Daring)',
      category: 'publik',
      categoryLabel: 'Layanan Publik',
      desc: 'Portal pendaftaran resmi calon peserta didik baru terintegrasi jalur Zonasi, Prestasi, Afirmasi, dan Perpindahan Tugas Orang Tua.',
      target: 'Calon Siswa Baru & Orang Tua',
      badge: 'Tahun Ajaran 2026/2027 Dibuka',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: GraduationCap,
      color: 'bg-amber-600',
      serverStatus: 'Aktif Terbuka',
      features: ['Formulir Pendaftaran Online Praktis', 'Verifikasi Dokumen Real-Time', 'Pengumuman Hasil Seleksi Transparan']
    },
    {
      id: 'dapodik',
      title: 'Integrasi Dapodikdasmen Kemendikbudristek',
      category: 'guru',
      categoryLabel: 'Administrasi PTK',
      desc: 'Pusat sinkronisasi data pokok pendidikan siswa, rombel kelas, sarana prasarana, dan pendidik SMAN 1 Julok ke server pusat kementerian.',
      target: 'Operator Sekolah & Dewan Guru',
      badge: 'Tersinkronisasi Resmi Kemendikbud',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: Database,
      color: 'bg-cyan-700',
      serverStatus: 'Tersinkronisasi',
      features: ['Sinkronisasi NISN & NIK Resmi', 'Pembaruan Data Beban Kerja Guru', 'Verifikasi Profil Sekolah & Sarpras']
    },
    {
      id: 'presensi',
      title: 'Sistem Presensi Digital & GPS Kehadiran',
      category: 'guru',
      categoryLabel: 'Kepegawaian',
      desc: 'Pencatatan kehadiran harian dewan guru dan tenaga kependidikan berbasis geolokasi sekolah Buket Seuraja dan pengenalan biometrik.',
      target: 'Dewan Guru & Tenaga Kependidikan',
      badge: 'Sistem Geolokasi Buket Seuraja',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Users,
      color: 'bg-purple-600',
      serverStatus: 'Online Setiap Hari Kerja',
      features: ['Presensi Datang & Pulang Real-Time', 'Rekap Kehadiran untuk Tunjangan Kinerja', 'Pemberitahuan Otomatis ke Dinas Pendidikan']
    },
    {
      id: 'classroom',
      title: 'Google Workspace for Education SMAN 1 Julok',
      category: 'siswa',
      categoryLabel: 'Pembelajaran Digital',
      desc: 'Platform ruang kelas maya, penugasan tugas digital, diskusi kolaboratif, dan penyimpanan tak terbatas untuk seluruh siswa dan guru.',
      target: 'Siswa & Guru Terdaftar Akun @sman1julok.sch.id',
      badge: 'Akun Domain Resmi Terverifikasi',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      icon: Globe,
      color: 'bg-rose-600',
      serverStatus: 'Google Cloud Platform',
      features: ['Email Resmi @sman1julok.sch.id', 'Google Classroom Terintegrasi Jadwal', 'Penyimpanan Drive Tugas Terproteksi']
    },
    {
      id: 'tracer',
      title: 'Pusat Tracer Study & Jaringan Alumni SMAN 1 Julok',
      category: 'publik',
      categoryLabel: 'Layanan Alumni',
      desc: 'Sistem pendataan pelacakan jejak alumni, sebaran perguruan tinggi negeri (SNBP/SNBT), dunia usaha, dan karir profesional lulusan.',
      target: 'Alumni Semua Angkatan SMAN 1 Julok',
      badge: 'Database Lulusan Sejak Berdiri',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Sparkles,
      color: 'bg-blue-600',
      serverStatus: 'Aktif Terbuka',
      features: ['Registrasi Angkatan Alumni', 'Peluang Magang & Beasiswa Karir', 'Forum Temu Alumni Tahunan']
    }
  ];

  const filteredServices = services.filter((srv) => {
    const matchesCategory = activeTab === 'all' || srv.category === activeTab;
    const matchesSearch = 
      srv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      srv.target.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Beranda', view: 'beranda' },
          { label: 'Portal Layanan Digital Sekolah' }
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-sky-900/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-800/60 border border-sky-600/40 text-sky-200 text-xs font-semibold">
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span>Single Sign-On & Ekosistem Digital Terintegrasi</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Pusat Layanan Digital Sekolah
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed">
                Pintu gerbang akses terpadu menuju seluruh aplikasi pembelajaran, ujian online, administrasi akademik, dan perpustakaan digital SMA Negeri 1 Julok.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
              {!isLoggedIn ? (
                <button
                  onClick={onOpenLogin}
                  className="w-full sm:w-auto px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Lock className="w-4 h-4" />
                  <span>Masuk Akun Warga Sekolah</span>
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Buka Dasbor Saya</span>
                </button>
              )}
              <button
                onClick={() => onNavigate('spmb')}
                className="w-full sm:w-auto px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white border border-white/20 text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-amber-300" />
                <span>Pendaftaran SPMB Online</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-sky-900/50 text-xs">
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-slate-400 block text-[11px]">Infrastruktur Server</span>
              <p className="font-bold text-emerald-400 mt-0.5 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Operasional 100%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-slate-400 block text-[11px]">Akun Terdaftar</span>
              <p className="font-bold text-white mt-0.5">850+ Siswa, Guru & Tendik</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-slate-400 block text-[11px]">Integrasi Dapodik</span>
              <p className="font-bold text-sky-300 mt-0.5">Sinkron Kemendikbud</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <span className="text-slate-400 block text-[11px]">Keamanan Portal</span>
              <p className="font-bold text-indigo-300 mt-0.5">Enkripsi SSL & 3NF RBAC</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Controls Bar: Search & Filter Tabs */}
        <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'all', label: 'Semua Layanan' },
              { id: 'siswa', label: 'Peserta Didik' },
              { id: 'guru', label: 'Guru & Karyawan' },
              { id: 'publik', label: 'Publik & Alumni' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-sky-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari aplikasi atau layanan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>
        </div>

        {/* Services Grid */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => {
            const Icon = srv.icon;
            return (
              <div
                key={srv.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-sky-200 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`w-12 h-12 rounded-xl ${srv.color} text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${srv.badgeColor}`}>
                      {srv.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      {srv.categoryLabel}
                    </span>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-sky-900 transition-colors mt-0.5">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {srv.desc}
                    </p>
                  </div>

                  {/* Feature Bullets */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    {srv.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[11px] text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                    <Server className="w-3.5 h-3.5 text-slate-400" />
                    <span>{srv.serverStatus}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (srv.id === 'spmb_online') {
                        onNavigate('spmb');
                      } else {
                        setActiveModalApp(srv);
                      }
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold text-sky-900 bg-sky-100/80 hover:bg-sky-200/80 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <span>Buka Layanan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredServices.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 mt-6">
            <Globe className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Layanan tidak ditemukan</h3>
            <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau pilih tab kategori lain.</p>
          </div>
        )}

        {/* Security & SSO Information Banner */}
        <div className="mt-12 bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-xl bg-sky-50 text-sky-800 shrink-0 border border-sky-100">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-900">Petunjuk Autentikasi Tunggal (Single Sign-On / SSO)</h4>
              <p className="text-xs text-slate-600 mt-1 max-w-2xl leading-relaxed">
                Seluruh siswa, guru, dan staf administrasi SMA Negeri 1 Julok dapat menggunakan akun terpadu yang diberikan oleh Operator Dapodik untuk masuk ke LMS, E-Rapor, dan CBT tanpa perlu mendaftar ulang.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 text-xs font-bold text-white bg-sky-900 hover:bg-sky-800 rounded-lg shadow-sm whitespace-nowrap cursor-pointer transition-colors"
          >
            Masuk SSO Sekolah
          </button>
        </div>
      </main>

      {/* Interactive Service Simulation Modal */}
      {activeModalApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg ${activeModalApp.color} text-white flex items-center justify-center text-xs font-bold`}>
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900">{activeModalApp.title}</h3>
                  <span className="text-[11px] text-slate-500 font-mono">Status: {activeModalApp.serverStatus}</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModalApp(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Anda sedang membuka gerbang akses digital menuju <strong>{activeModalApp.title}</strong> resmi SMA Negeri 1 Julok.
            </p>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-600">
                <span>Sasaran Pengguna:</span>
                <span className="font-semibold text-slate-800">{activeModalApp.target}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Autentikasi:</span>
                <span className="font-mono text-emerald-700 font-semibold">SSO Terverifikasi</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Lokasi Hosting:</span>
                <span className="font-mono text-slate-700">Data Center Pendidikan Aceh</span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setActiveModalApp(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setActiveModalApp(null);
                  if (!isLoggedIn) {
                    onOpenLogin();
                  } else {
                    onNavigate('dashboard');
                  }
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-sky-900 hover:bg-sky-800 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <span>Masuk Sekarang</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
