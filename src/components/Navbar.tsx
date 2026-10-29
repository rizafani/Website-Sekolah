import React, { useState, useEffect } from 'react';
import { 
  Menu, 
  X, 
  ChevronDown, 
  Search, 
  Sparkles, 
  Lock, 
  GraduationCap, 
  BookOpen, 
  Building2, 
  Award, 
  FileText, 
  Phone, 
  Globe,
  User as UserIcon,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  KeyRound,
  Bell,
  Clock
} from 'lucide-react';
import { SchoolSettings, User } from '../types/index.ts';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, param?: string) => void;
  settings: SchoolSettings;
  onOpenSearch: () => void;
  onOpenDigitalServices: () => void;
  currentUser: User | null;
  onOpenLogin: () => void;
  onLogout: () => void;
  onOpenDashboard: () => void;
  unreadNotificationsCount?: number;
  onOpenNotifications?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  settings,
  onOpenSearch,
  onOpenDigitalServices,
  currentUser,
  onOpenLogin,
  onLogout,
  onOpenDashboard,
  unreadNotificationsCount = 0,
  onOpenNotifications
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (view: string, param?: string) => {
    onNavigate(view, param);
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setUserDropdownOpen(false);
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin_sekolah': return 'Admin Sekolah';
      case 'editor': return 'Editor Redaksi';
      case 'guru': return 'Guru & Pendidik';
      case 'siswa': return 'Siswa';
      case 'operator_tu': return 'Operator Dapodik';
      default: return role.replace(/_/g, ' ').toUpperCase();
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin': return 'bg-rose-900/80 text-rose-200 border-rose-700';
      case 'admin_sekolah': return 'bg-indigo-900/80 text-indigo-200 border-indigo-700';
      case 'editor': return 'bg-amber-900/80 text-amber-200 border-amber-700';
      case 'guru': return 'bg-emerald-900/80 text-emerald-200 border-emerald-700';
      case 'siswa': return 'bg-sky-900/80 text-sky-200 border-sky-700';
      case 'operator_tu': return 'bg-cyan-900/80 text-cyan-200 border-cyan-700';
      default: return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-200">
      {/* Top Notification & Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-slate-300 text-xs">
            <span className="font-semibold text-sky-400">NPSN: {settings.npsn}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="hidden sm:inline">Akreditasi: {settings.accreditation}</span>
            <span aria-hidden="true" className="hidden sm:inline text-slate-600">·</span>
            <span className="hidden md:inline">{settings.village}, {settings.district}, {settings.regency}</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs font-medium">
            <button
              onClick={onOpenDigitalServices}
              className="text-amber-300 hover:text-amber-200 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Portal Layanan Digital</span>
            </button>
            <span aria-hidden="true" className="text-slate-700">·</span>

            {/* Authentication status on top bar */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer py-0.5"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-bold truncate max-w-[130px] sm:max-w-[180px]">{currentUser.fullName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded border hidden sm:inline ${getRoleBadgeColor(currentUser.role)}`}>
                    {getRoleLabel(currentUser.role)}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-56 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                    <div className="px-3.5 py-2 border-b border-slate-100">
                      <div className="font-bold text-xs text-slate-900 truncate">{currentUser.fullName}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                      <div className="mt-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
                          Role: {getRoleLabel(currentUser.role)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onOpenDashboard();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-900 flex items-center gap-2 cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-sky-700" />
                      <span>Buka Dashboard Saya</span>
                    </button>

                    <button
                      onClick={() => {
                        onLogout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 flex items-center gap-2 cursor-pointer border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Keluar (Logout)</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded-md"
              >
                <KeyRound className="w-3 h-3 text-amber-300" />
                <span className="font-semibold">Masuk Akun / RBAC</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className={`w-full transition-all duration-200 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-2.5' 
          : 'bg-white border-b border-slate-200 py-3.5'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-8">
          
          {/* Zone 1: Brand Wordmark */}
          <button 
            onClick={() => handleLinkClick('beranda')}
            className="flex items-center gap-3 text-left whitespace-nowrap shrink-0 group cursor-pointer"
          >
            <div className="w-10 h-10 rounded-lg bg-sky-900 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-sky-800 transition-colors">
              <GraduationCap className="w-6 h-6 text-sky-300" />
            </div>
            <div>
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 group-hover:text-sky-950 transition-colors block leading-tight">
                SMA Negeri 1 Julok
              </span>
              <span className="text-[11px] font-medium text-slate-500 block leading-tight">
                Aceh Timur · Serambi Mekkah
              </span>
            </div>
          </button>

          {/* Zone 2: Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-700 whitespace-nowrap">
            <button 
              onClick={() => handleLinkClick('beranda')}
              className={`transition-colors hover:text-sky-900 cursor-pointer ${currentView === 'beranda' ? 'text-sky-800 font-semibold' : ''}`}
            >
              Beranda
            </button>

            {/* Dropdown: Profil */}
            <div 
              className="relative group"
              onMouseEnter={() => setOpenDropdown('profil')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button 
                className="flex items-center gap-1 hover:text-sky-900 transition-colors py-1 cursor-pointer"
                onClick={() => handleLinkClick('profil')}
              >
                <span>Profil Sekolah</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200" />
              </button>
              
              {openDropdown === 'profil' && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button 
                    onClick={() => handleLinkClick('profil')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900 flex items-center gap-2"
                  >
                    <Building2 className="w-4 h-4 text-sky-700" />
                    <span>Identitas & Profil Lengkap</span>
                  </button>
                  <button 
                    onClick={() => handleLinkClick('sejarah')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Sejarah Singkat Sekolah
                  </button>
                  <button 
                    onClick={() => handleLinkClick('visi-misi')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Visi, Misi & Tujuan
                  </button>
                  <button 
                    onClick={() => handleLinkClick('sambutan')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Sambutan Kepala Sekolah
                  </button>
                  <button 
                    onClick={() => handleLinkClick('organisasi')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Struktur Organisasi & Komite
                  </button>
                  <button 
                    onClick={() => handleLinkClick('guru')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Data Guru & Tenaga Kependidikan
                  </button>
                  <button 
                    onClick={() => handleLinkClick('fasilitas')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Sarana & Fasilitas Kampus
                  </button>
                  <button 
                    onClick={() => handleLinkClick('program-unggulan')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-sky-800 bg-sky-50/60 hover:bg-sky-50 hover:text-sky-950 flex items-center gap-2 border-t border-slate-100"
                  >
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="font-semibold">Program Unggulan Sekolah</span>
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown: Akademik */}
            <div 
              className="relative group"
              onMouseEnter={() => setOpenDropdown('akademik')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button 
                className="flex items-center gap-1 hover:text-sky-900 transition-colors py-1 cursor-pointer"
                onClick={() => handleLinkClick('kurikulum')}
              >
                <span>Akademik</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200" />
              </button>

              {openDropdown === 'akademik' && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button 
                    onClick={() => handleLinkClick('kurikulum')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-sky-700" />
                    <span>Kurikulum Merdeka & P5</span>
                  </button>
                  <button 
                    onClick={() => handleLinkClick('jadwal')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900 flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-sky-700" />
                    <span>Jadwal Pelajaran Rombel</span>
                  </button>
                  <button 
                    onClick={() => handleLinkClick('materi-belajar')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-sky-700" />
                    <span>Bank Materi & Modul Ajar</span>
                  </button>
                  <button 
                    onClick={() => handleLinkClick('kelas')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Data Kelas & Rombongan Belajar
                  </button>
                  <button 
                    onClick={() => handleLinkClick('asesmen')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Asesmen & Ujian CBT
                  </button>
                  <button 
                    onClick={() => handleLinkClick('agenda')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Kalender Pendidikan & Agenda
                  </button>
                  <button 
                    onClick={() => handleLinkClick('prestasi')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900 flex items-center gap-2"
                  >
                    <Award className="w-4 h-4 text-sky-700" />
                    <span>Prestasi Siswa & Guru</span>
                  </button>
                  <button 
                    onClick={() => handleLinkClick('ekstrakurikuler')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Kegiatan Ekstrakurikuler
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown: Informasi */}
            <div 
              className="relative group"
              onMouseEnter={() => setOpenDropdown('informasi')}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              <button 
                className="flex items-center gap-1 hover:text-sky-900 transition-colors py-1 cursor-pointer"
                onClick={() => handleLinkClick('berita')}
              >
                <span>Informasi</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700 transition-transform duration-200" />
              </button>

              {openDropdown === 'informasi' && (
                <div className="absolute top-full left-0 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2 mt-1 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <button 
                    onClick={() => handleLinkClick('berita')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Berita & Artikel Sekolah
                  </button>
                  <button 
                    onClick={() => handleLinkClick('pengumuman')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Pengumuman Resmi
                  </button>
                  <button 
                    onClick={() => handleLinkClick('beasiswa')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Beasiswa & Bantuan Siswa
                  </button>
                  <button 
                    onClick={() => handleLinkClick('galeri')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Galeri Foto & Video
                  </button>
                  <button 
                    onClick={() => handleLinkClick('unduhan')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4 text-sky-700" />
                    <span>Pusat Unduhan Dokumen</span>
                  </button>
                  <button 
                    onClick={() => handleLinkClick('faq')}
                    className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-sky-900"
                  >
                    Tanya Jawab (FAQ)
                  </button>
                </div>
              )}
            </div>

            <button 
              onClick={() => handleLinkClick('kontak')}
              className={`transition-colors hover:text-sky-900 cursor-pointer ${currentView === 'kontak' ? 'text-sky-800 font-semibold' : ''}`}
            >
              Kontak & Lokasi
            </button>
          </div>

          {/* Zone 3: Actions + Search + Notifications */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={onOpenSearch}
              className="p-2 text-slate-600 hover:text-sky-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Pencarian cepat"
              aria-label="Buka pencarian"
            >
              <Search className="w-4 h-4" />
            </button>

            {onOpenNotifications && (
              <button
                onClick={onOpenNotifications}
                className="relative p-2 text-slate-600 hover:text-sky-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Pusat Notifikasi Sekolah"
                aria-label="Buka notifikasi"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                  </span>
                )}
              </button>
            )}

            {currentUser ? (
              <button
                onClick={onOpenDashboard}
                className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-sky-950 rounded-lg hover:bg-sky-900 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-sky-300" />
                <span>Dashboard ({getRoleLabel(currentUser.role)})</span>
              </button>
            ) : (
              <button
                onClick={() => handleLinkClick('spmb')}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-900 rounded-lg hover:bg-sky-800 transition-colors shadow-sm cursor-pointer whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Pendaftaran SPMB</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Buka menu navigasi"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 max-h-[80vh] overflow-y-auto">
            {currentUser ? (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="text-xs font-bold text-slate-900">{currentUser.fullName}</div>
                <div className="text-[11px] text-slate-500">Role: {getRoleLabel(currentUser.role)}</div>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      onOpenDashboard();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 py-2 px-3 text-xs font-bold text-white bg-sky-900 rounded-lg text-center"
                  >
                    Buka Dashboard
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="py-2 px-3 text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 rounded-lg"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <button
                  onClick={() => {
                    onOpenLogin();
                    setMobileMenuOpen(false);
                  }}
                  className="w-1/2 py-2.5 px-3 text-xs font-bold text-center text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Masuk Akun / RBAC
                </button>
                <button
                  onClick={() => handleLinkClick('spmb')}
                  className="w-1/2 py-2.5 px-3 text-xs font-bold text-center text-white bg-sky-900 rounded-lg hover:bg-sky-800"
                >
                  SPMB Online
                </button>
              </div>
            )}

            <div className="space-y-1 text-sm font-medium text-slate-800">
              <button 
                onClick={() => handleLinkClick('beranda')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-sky-900"
              >
                Beranda
              </button>

              <div className="pt-2 pb-1 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Profil Sekolah
              </div>
              <button onClick={() => handleLinkClick('profil')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Identitas Sekolah
              </button>
              <button onClick={() => handleLinkClick('sejarah')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Sejarah Sekolah
              </button>
              <button onClick={() => handleLinkClick('visi-misi')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Visi, Misi & Tujuan
              </button>
              <button onClick={() => handleLinkClick('program-unggulan')} className="w-full text-left pl-6 py-1.5 text-xs font-semibold text-sky-800 hover:text-sky-950">
                Program Unggulan Sekolah ✨
              </button>
              <button onClick={() => handleLinkClick('sambutan')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Sambutan Kepala Sekolah
              </button>
              <button onClick={() => handleLinkClick('organisasi')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Struktur Organisasi
              </button>
              <button onClick={() => handleLinkClick('guru')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Data Guru & Tenaga Kependidikan
              </button>
              <button onClick={() => handleLinkClick('fasilitas')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Fasilitas & Kampus
              </button>

              <div className="pt-2 pb-1 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Akademik & Siswa
              </div>
              <button onClick={() => handleLinkClick('kurikulum')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Kurikulum Merdeka & P5
              </button>
              <button onClick={() => handleLinkClick('jadwal')} className="w-full text-left pl-6 py-1.5 text-xs font-semibold text-sky-800 hover:text-sky-950">
                Jadwal Pelajaran Rombel ⏱️
              </button>
              <button onClick={() => handleLinkClick('materi-belajar')} className="w-full text-left pl-6 py-1.5 text-xs font-semibold text-sky-800 hover:text-sky-950">
                Bank Modul & Materi Ajar 📚
              </button>
              <button onClick={() => handleLinkClick('kelas')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Data Kelas & Rombel
              </button>
              <button onClick={() => handleLinkClick('asesmen')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Ujian & Asesmen (ANBK / CBT)
              </button>
              <button onClick={() => handleLinkClick('agenda')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Agenda & Kalender
              </button>
              <button onClick={() => handleLinkClick('prestasi')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Prestasi Siswa & Guru
              </button>
              <button onClick={() => handleLinkClick('ekstrakurikuler')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Ekstrakurikuler
              </button>

              <div className="pt-2 pb-1 px-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Publikasi & Dokumen
              </div>
              <button onClick={() => handleLinkClick('berita')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Berita & Artikel
              </button>
              <button onClick={() => handleLinkClick('pengumuman')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Pengumuman Resmi
              </button>
              <button onClick={() => handleLinkClick('beasiswa')} className="w-full text-left pl-6 py-1.5 text-xs font-semibold text-sky-800 hover:text-sky-950">
                Beasiswa & Bantuan Siswa 🎓
              </button>
              <button onClick={() => handleLinkClick('galeri')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Galeri Foto & Video
              </button>
              <button onClick={() => handleLinkClick('unduhan')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Pusat Unduhan Dokumen
              </button>
              <button onClick={() => handleLinkClick('kontak')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Kontak & Lokasi Buket Seuraja
              </button>
              <button onClick={() => handleLinkClick('faq')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Tanya Jawab (FAQ)
              </button>
              <button onClick={() => handleLinkClick('privasi-ketentuan')} className="w-full text-left pl-6 py-1.5 text-xs text-slate-700 hover:text-sky-900">
                Kebijakan Privasi
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
