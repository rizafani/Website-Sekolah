import React, { useState, useEffect } from 'react';
import { initialData } from './data/initialData.ts';
import { 
  DatabaseSchema, 
  GalleryItem, 
  NewsItem, 
  SpmbRegistration, 
  ContactMessage, 
  User, 
  PermissionKey 
} from './types/index.ts';
import { api, getStoredUser, getStoredPermissions } from './services/api.ts';

// Global Modals
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { DigitalServicesModal } from './components/DigitalServicesModal.tsx';
import { LightboxModal } from './components/LightboxModal.tsx';
import { LoginModal } from './components/LoginModal.tsx';
import { ResetPasswordModal } from './components/ResetPasswordModal.tsx';
import { SuperAdminProvisionModal } from './components/SuperAdminProvisionModal.tsx';
import { NotificationModal } from './components/NotificationModal.tsx';
import { GoogleSearchSitelinksModal } from './components/GoogleSearchSitelinksModal.tsx';
import { ScrollToTop } from './components/ScrollToTop.tsx';

// Public Views
import { HomeView } from './views/HomeView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { HistoryView } from './views/HistoryView.tsx';
import { VisionMissionView } from './views/VisionMissionView.tsx';
import { PrincipalSpeechView } from './views/PrincipalSpeechView.tsx';
import { OrganizationView } from './views/OrganizationView.tsx';
import { TeachersView } from './views/TeachersView.tsx';
import { ClassesView } from './views/ClassesView.tsx';
import { FacilitiesView } from './views/FacilitiesView.tsx';
import { CurriculumView } from './views/CurriculumView.tsx';
import { SchedulesView } from './views/SchedulesView.tsx';
import { LearningMaterialsView } from './views/LearningMaterialsView.tsx';
import { CustomPageView } from './views/CustomPageView.tsx';
import { NewsView } from './views/NewsView.tsx';
import { NewsDetailView } from './views/NewsDetailView.tsx';
import { AnnouncementsView } from './views/AnnouncementsView.tsx';
import { AgendaView } from './views/AgendaView.tsx';
import { AchievementsView } from './views/AchievementsView.tsx';
import { GalleryView } from './views/GalleryView.tsx';
import { ExtracurricularView } from './views/ExtracurricularView.tsx';
import { SpmbView } from './views/SpmbView.tsx';
import { AssessmentView } from './views/AssessmentView.tsx';
import { DownloadsView } from './views/DownloadsView.tsx';
import { ContactView } from './views/ContactView.tsx';
import { FaqView } from './views/FaqView.tsx';
import { PrivacyTermsView } from './views/PrivacyTermsView.tsx';
import { DigitalServicesView } from './views/DigitalServicesView.tsx';
import { ProgramUnggulanView } from './views/ProgramUnggulanView.tsx';
import { BeasiswaView } from './views/BeasiswaView.tsx';
import { NotificationsPageView } from './views/NotificationsPageView.tsx';
import { AdminDashboard } from './views/AdminDashboard.tsx';

// Role-Based Dashboards
import { SuperAdminDashboard } from './views/dashboards/SuperAdminDashboard.tsx';
import { AdminSekolahDashboard } from './views/dashboards/AdminSekolahDashboard.tsx';
import { EditorDashboard } from './views/dashboards/EditorDashboard.tsx';
import { GuruDashboard } from './views/dashboards/GuruDashboard.tsx';
import { SiswaDashboard } from './views/dashboards/SiswaDashboard.tsx';
import { OperatorTuDashboard } from './views/dashboards/OperatorTuDashboard.tsx';
import { SaaSDashboard, DashboardMenuId } from './views/SaaSDashboard.tsx';

import { KeyRound, ShieldAlert, ArrowRight, UserCheck, ShieldCheck, LayoutGrid } from 'lucide-react';

export default function App() {
  const [data, setData] = useState<DatabaseSchema>(initialData);
  const [currentView, setCurrentView] = useState<string>('beranda');
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [dashboardTab, setDashboardTab] = useState<DashboardMenuId>('ringkasan');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDigitalServicesOpen, setIsDigitalServicesOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isGoogleSitelinksOpen, setIsGoogleSitelinksOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  // Dynamic CMS Page view slug
  const [selectedPageSlug, setSelectedPageSlug] = useState<string | null>(null);

  // RBAC Auth Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);

  // Authenticated State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getStoredUser());
  const [userPermissions, setUserPermissions] = useState<PermissionKey[]>(() => getStoredPermissions());
  const [dashboardLayout, setDashboardLayout] = useState<'saas' | 'role_specific'>('saas');

  // Synchronize route with window.location.hash for individual page URL
  const syncRouteFromHash = () => {
    const rawHash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!rawHash || rawHash === 'beranda') {
      setCurrentView('beranda');
      return;
    }

    const segments = rawHash.split('/');
    const mainRoute = segments[0] || 'beranda';
    const subRoute = segments[1] || '';

    if (mainRoute === 'google-search' || mainRoute === 'pencarian-google' || mainRoute === 'sitelinks') {
      setIsGoogleSitelinksOpen(true);
      setCurrentView('beranda');
      return;
    }

    if (mainRoute === 'dashboard') {
      setCurrentView('dashboard');
      if (subRoute) {
        setDashboardTab(subRoute as DashboardMenuId);
      }
      return;
    }

    // Direct unique URL for published articles: #/berita/:slug or #/artikel/:slug or #/berita-detail/:id
    if ((mainRoute === 'berita-detail' || mainRoute === 'berita' || mainRoute === 'artikel') && subRoute) {
      setSelectedNewsId(subRoute);
      api.recordNewsView(subRoute);
      setCurrentView('berita-detail');
      return;
    }

    if (mainRoute === 'halaman' && subRoute) {
      setSelectedPageSlug(subRoute);
      setCurrentView('halaman-kustom');
      return;
    }

    setCurrentView(mainRoute);
  };

  // Hash listener for browser Back / Forward buttons and direct URL visits
  useEffect(() => {
    syncRouteFromHash();
    const handleHashChange = () => {
      syncRouteFromHash();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update dynamic document title on each individual page view
  useEffect(() => {
    const titles: Record<string, string> = {
      'beranda': 'Beranda Resmi',
      'profil': 'Profil & Identitas Sekolah',
      'sejarah': 'Sejarah Singkat Sekolah',
      'visi-misi': 'Visi, Misi & Tujuan Institusi',
      'sambutan': 'Sambutan Kepala Sekolah',
      'organisasi': 'Struktur Organisasi & Komite',
      'guru': 'Data Guru & Tenaga Kependidikan',
      'kelas': 'Data Kelas & Rombongan Belajar',
      'fasilitas': 'Sarana & Fasilitas Kampus',
      'program-unggulan': 'Program Unggulan Sekolah',
      'kurikulum': 'Kurikulum Merdeka & Projek P5',
      'jadwal': 'Jadwal Pelajaran Rombel',
      'materi-belajar': 'Bank Modul & Bahan Ajar',
      'asesmen': 'Asesmen & Ujian CBT Mandiri',
      'agenda': 'Kalender Akademik & Agenda',
      'prestasi': 'Prestasi Siswa & Guru',
      'ekstrakurikuler': 'Kegiatan Ekstrakurikuler',
      'berita': 'Berita & Artikel Sekolah',
      'berita-detail': 'Rincian Berita & Wawasan',
      'pengumuman': 'Pengumuman Resmi Kedinasan',
      'beasiswa': 'Informasi Beasiswa & Bantuan Siswa',
      'galeri': 'Galeri Dokumentasi Foto & Video',
      'unduhan': 'Pusat Unduhan Dokumen',
      'layanan-digital': 'Portal Layanan Digital Terpadu',
      'spmb': 'Penerimaan Siswa Baru (SPMB)',
      'kontak': 'Kontak & Lokasi Buket Seuraja',
      'faq': 'Tanya Jawab (FAQ)',
      'privasi-ketentuan': 'Kebijakan Privasi & Ketentuan',
      'notifikasi': 'Pusat Notifikasi & Siaran Resmi',
      'dashboard': `Dasbor Manajemen (${dashboardTab.toUpperCase()})`
    };

    const currentTitle = titles[currentView] || 'Portal Sekolah';
    document.title = `${currentTitle} - SMA Negeri 1 Julok`;
  }, [currentView, dashboardTab]);

  // Check server session on load
  useEffect(() => {
    async function checkAuth() {
      try {
        const session = await api.getMe();
        if (session) {
          setCurrentUser(session.user);
          setUserPermissions(session.permissions);
        }
      } catch {
        // quiet
      }
    }
    checkAuth();
  }, []);

  // Fetch initial public data
  useEffect(() => {
    async function load() {
      try {
        const fetched = await api.fetchAllData();
        if (fetched) {
          setData(fetched);
        }
      } catch (err) {
        console.warn('Menggunakan data awal lokal', err);
      }
    }
    load();
  }, []);

  const handleNavigate = (view: string, param?: string) => {
    if ((view === 'berita-detail' || view === 'berita') && param) {
      const item = data.news.find((n) => n.id === param || n.slug === param) ||
        data.articles?.find((a) => a.id === param || a.slug === param);
      const targetSlug = item?.slug || param;
      setSelectedNewsId(targetSlug);
      api.recordNewsView(targetSlug);
      window.location.hash = `#/berita/${targetSlug}`;
      setCurrentView('berita-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    } else if (view === 'halaman-kustom' && param) {
      setSelectedPageSlug(param);
      window.location.hash = `#/halaman/${param}`;
    } else if (view === 'google-search' || view === 'sitelinks') {
      setIsGoogleSitelinksOpen(true);
      return;
    } else if (view === 'dashboard') {
      const tab = (param as DashboardMenuId) || dashboardTab || 'ringkasan';
      setDashboardTab(tab);
      window.location.hash = `#/dashboard/${tab}`;
    } else if (view === 'beranda') {
      window.location.hash = '#/beranda';
    } else {
      window.location.hash = `#/${view}`;
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setData((prev) => ({
      ...prev,
      notifications: (prev.notifications || []).map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      )
    }));
  };

  const handleMarkAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    setData((prev) => ({
      ...prev,
      notifications: (prev.notifications || []).map((n) => ({ ...n, isRead: true }))
    }));
  };

  const handleLoginSuccess = (user: User, perms: PermissionKey[]) => {
    setCurrentUser(user);
    setUserPermissions(perms);
    setCurrentView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setUserPermissions([]);
    setCurrentView('beranda');
  };

  const handleDataRefresh = (freshData: DatabaseSchema) => {
    setData(freshData);
  };

  // Quick switch role for evaluators
  const handleQuickSwitchRole = async (targetRole: string) => {
    let identifier = '';
    switch (targetRole) {
      case 'super_admin': identifier = 'superadmin'; break;
      case 'admin_sekolah': identifier = 'admin.sekolah'; break;
      case 'editor': identifier = 'editor.redaksi'; break;
      case 'guru': identifier = 'guru.biologi'; break;
      case 'siswa': identifier = 'siswa.rayhan'; break;
      case 'operator_tu': identifier = 'operator.dapodik'; break;
      default: identifier = 'superadmin'; break;
    }

    const res = await api.login(identifier, 'Password123!');
    if (res.success && res.user && res.permissions) {
      handleLoginSuccess(res.user, res.permissions);
    }
  };

  // Render role dashboard based on RBAC role
  const renderDashboardView = () => {
    if (!currentUser) {
      return (
        <div className="py-20 px-4 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-200 text-sky-900 mx-auto flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-sky-800" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Autentikasi Diperlukan</h2>
          <p className="text-sm text-slate-600 mt-2">
            Silakan masuk dengan kredensial akun terdaftar Anda untuk membuka dasbor portal SMA Negeri 1 Julok.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setIsLoginOpen(true)}
              className="w-full sm:w-auto px-6 py-2.5 text-xs font-bold text-white bg-sky-900 hover:bg-sky-800 rounded-lg shadow-sm cursor-pointer"
            >
              Masuk Akun Sekarang
            </button>
            <button
              onClick={() => handleNavigate('beranda')}
              className="w-full sm:w-auto px-5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      );
    }

    // Mode 1: Modern SaaS Dashboard with 18 Menus (Default)
    if (dashboardLayout === 'saas') {
      return (
        <SaaSDashboard
          currentUser={currentUser}
          userPermissions={userPermissions}
          data={data}
          onRefresh={handleDataRefresh}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          initialTab={dashboardTab}
          onTabChange={(tab) => {
            setDashboardTab(tab);
            window.location.hash = `#/dashboard/${tab}`;
          }}
        />
      );
    }

    // Mode 2: Legacy Role-Specific Dashboards
    switch (currentUser.role) {
      case 'super_admin':
        return (
          <SuperAdminDashboard
            currentUser={currentUser}
            data={data}
            onRefresh={handleDataRefresh}
            onNavigate={handleNavigate}
          />
        );
      case 'admin_sekolah':
        return (
          <AdminSekolahDashboard
            currentUser={currentUser}
            data={data}
            onRefresh={handleDataRefresh}
            onNavigate={handleNavigate}
          />
        );
      case 'editor':
        return (
          <EditorDashboard
            currentUser={currentUser}
            data={data}
            onRefresh={handleDataRefresh}
            onNavigate={handleNavigate}
          />
        );
      case 'guru':
        return (
          <GuruDashboard
            currentUser={currentUser}
            data={data}
            onRefresh={handleDataRefresh}
            onNavigate={handleNavigate}
          />
        );
      case 'siswa':
        return (
          <SiswaDashboard
            currentUser={currentUser}
            data={data}
            onRefresh={handleDataRefresh}
            onNavigate={handleNavigate}
          />
        );
      case 'operator_tu':
        return (
          <OperatorTuDashboard
            currentUser={currentUser}
            data={data}
            onRefresh={handleDataRefresh}
            onNavigate={handleNavigate}
          />
        );
      default:
        return (
          <AdminSekolahDashboard
            currentUser={currentUser}
            data={data}
            onRefresh={handleDataRefresh}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  // Render view router
  const renderCurrentView = () => {
    switch (currentView) {
      case 'beranda':
        return (
          <HomeView
            data={data}
            onNavigate={handleNavigate}
            onOpenLightbox={(item) => setLightboxItem(item)}
            onOpenDigitalServices={() => setIsDigitalServicesOpen(true)}
          />
        );
      case 'profil':
        return <ProfileView settings={data.settings} onNavigate={handleNavigate} />;
      case 'sejarah':
        return <HistoryView onNavigate={handleNavigate} />;
      case 'visi-misi':
        return <VisionMissionView settings={data.settings} onNavigate={handleNavigate} />;
      case 'sambutan':
        return <PrincipalSpeechView settings={data.settings} onNavigate={handleNavigate} />;
      case 'organisasi':
        return <OrganizationView settings={data.settings} onNavigate={handleNavigate} />;
      case 'guru':
        return <TeachersView staffList={data.staff} onNavigate={handleNavigate} />;
      case 'kelas':
        return <ClassesView classes={data.classes} onNavigate={handleNavigate} />;
      case 'fasilitas':
        return <FacilitiesView facilities={data.facilities} onNavigate={handleNavigate} />;
      case 'kurikulum':
        return <CurriculumView onNavigate={handleNavigate} />;
      case 'berita':
        return (
          <NewsView
            newsList={data.news}
            onSelectNews={(id) => handleNavigate('berita-detail', id)}
          />
        );
      case 'berita-detail': {
        const found = 
          data.news.find((n) => n.id === selectedNewsId || n.slug === selectedNewsId) ||
          data.articles?.find((a) => a.id === selectedNewsId || a.slug === selectedNewsId) as unknown as NewsItem ||
          data.news[0];
        return (
          <NewsDetailView
            newsItem={found}
            allNews={data.news}
            onBack={() => handleNavigate('berita')}
            onSelectNews={(id) => handleNavigate('berita-detail', id)}
          />
        );
      }
      case 'pengumuman':
        return <AnnouncementsView announcements={data.announcements} onNavigate={handleNavigate} />;
      case 'agenda':
        return <AgendaView events={data.events} onNavigate={handleNavigate} />;
      case 'prestasi':
        return <AchievementsView achievements={data.achievements} onNavigate={handleNavigate} />;
      case 'galeri':
        return (
          <GalleryView
            galleries={data.galleries}
            onOpenLightbox={(item) => setLightboxItem(item)}
          />
        );
      case 'ekstrakurikuler':
        return <ExtracurricularView items={data.extracurriculars} onNavigate={handleNavigate} />;
      case 'spmb':
        return (
          <SpmbView
            existingRegistrations={data.spmb}
            onRegistrationAdded={(newReg) => {
              setData((prev) => ({
                ...prev,
                spmb: [newReg, ...prev.spmb]
              }));
            }}
          />
        );
      case 'asesmen':
        return (
          <AssessmentView
            onNavigate={handleNavigate}
            onOpenDigitalServices={() => setIsDigitalServicesOpen(true)}
          />
        );
      case 'unduhan':
        return (
          <DownloadsView
            downloads={data.downloads}
            onDownloadTracked={(id) => {
              setData((prev) => ({
                ...prev,
                downloads: prev.downloads.map((d) =>
                  d.id === id ? { ...d, downloadCount: (d.downloadCount || 0) + 1 } : d
                )
              }));
            }}
          />
        );
      case 'kontak':
        return (
          <ContactView
            settings={data.settings}
            onMessageSent={(newMsg) => {
              setData((prev) => ({
                ...prev,
                messages: [newMsg, ...prev.messages]
              }));
            }}
          />
        );
      case 'faq':
        return <FaqView faqs={data.faqs} onNavigate={handleNavigate} />;
      case 'privasi-ketentuan':
        return <PrivacyTermsView settings={data.settings} onNavigate={handleNavigate} />;

      // New Academic & Information Modules
      case 'jadwal':
        return <SchedulesView schedules={data.schedules || []} onNavigate={handleNavigate} />;

      case 'materi-belajar':
        return (
          <LearningMaterialsView
            materials={data.learningMaterials || []}
            onNavigate={handleNavigate}
            onOpenLogin={() => setIsLoginOpen(true)}
            isLoggedIn={!!currentUser}
          />
        );

      case 'program-unggulan':
        return <ProgramUnggulanView onNavigate={handleNavigate} />;

      case 'beasiswa':
        return <BeasiswaView onNavigate={handleNavigate} />;

      case 'layanan-digital':
        return (
          <DigitalServicesView
            onNavigate={handleNavigate}
            onOpenLogin={() => setIsLoginOpen(true)}
            isLoggedIn={!!currentUser}
          />
        );

      case 'notifikasi':
        return (
          <NotificationsPageView
            notifications={data.notifications || []}
            onMarkRead={handleMarkNotificationRead}
            onMarkAllRead={handleMarkAllNotificationsRead}
            onNavigate={handleNavigate}
          />
        );

      case 'halaman-kustom': {
        const page = data.pages?.find((p) => p.slug === selectedPageSlug || p.id === selectedPageSlug) || data.pages?.[0];
        if (!page) {
          return (
            <HomeView
              data={data}
              onNavigate={handleNavigate}
              onOpenLightbox={(item) => setLightboxItem(item)}
              onOpenDigitalServices={() => setIsDigitalServicesOpen(true)}
            />
          );
        }
        return <CustomPageView page={page} onNavigate={handleNavigate} />;
      }
      
      // RBAC Dashboard Router
      case 'dashboard':
      case 'admin':
        return renderDashboardView();

      default:
        return (
          <HomeView
            data={data}
            onNavigate={handleNavigate}
            onOpenLightbox={(item) => setLightboxItem(item)}
            onOpenDigitalServices={() => setIsDigitalServicesOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased selection:bg-sky-600 selection:text-white">
      
      {/* Quick Evaluator Role Switcher Bar - Available in Dashboard or when logged in */}
      {currentView === 'dashboard' && (
        <div className="bg-sky-950 text-sky-100 text-xs py-2 px-4 border-b border-sky-800 shadow-inner z-50">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Evaluator Role Switcher (1-Klik):</span>
              </div>
              <span className="text-sky-300 text-[11px] hidden lg:inline">
                Uji akses 18 menu SaaS Dashboard sesuai izin peran
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-sky-900/90 p-0.5 rounded-lg border border-sky-700/60 text-[11px]">
                <button
                  onClick={() => setDashboardLayout('saas')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                    dashboardLayout === 'saas'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : 'text-sky-200 hover:text-white'
                  }`}
                  title="SaaS Dashboard Modern dengan 18 Menu Terpadu"
                >
                  SaaS (18 Menu)
                </button>
                <button
                  onClick={() => setDashboardLayout('role_specific')}
                  className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer transition-colors ${
                    dashboardLayout === 'role_specific'
                      ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                      : 'text-sky-200 hover:text-white'
                  }`}
                  title="Tampilan Khusus Peran Tertentu"
                >
                  Khusus Peran
                </button>
              </div>

              <div className="h-4 w-px bg-sky-800 hidden sm:block" />

              <div className="flex flex-wrap items-center gap-1.5">
                {[
                  { role: 'super_admin', label: 'Super Admin' },
                  { role: 'admin_sekolah', label: 'Admin Sekolah' },
                  { role: 'editor', label: 'Editor' },
                  { role: 'guru', label: 'Guru' },
                  { role: 'siswa', label: 'Siswa' },
                  { role: 'operator_tu', label: 'Operator TU' }
                ].map(({ role, label }) => {
                  const isActive = currentUser?.role === role;
                  return (
                    <button
                      key={role}
                      onClick={() => handleQuickSwitchRole(role)}
                      className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-emerald-400 text-slate-950 font-bold shadow-xs' 
                          : 'bg-sky-900/80 hover:bg-sky-800 text-sky-200'
                      }`}
                    >
                      {label} {isActive && '✓'}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handleNavigate('beranda')}
                className="ml-2 px-2.5 py-1 text-[11px] font-semibold text-sky-200 hover:text-white hover:bg-sky-800 rounded-md border border-sky-700 cursor-pointer flex items-center gap-1"
              >
                <span>← Web Publik</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation - shown only on public pages */}
      {currentView !== 'dashboard' && (
        <Navbar
          currentView={currentView}
          onNavigate={handleNavigate}
          settings={data.settings}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenDigitalServices={() => setIsDigitalServicesOpen(true)}
          currentUser={currentUser}
          onOpenLogin={() => setIsLoginOpen(true)}
          onLogout={handleLogout}
          onOpenDashboard={() => handleNavigate('dashboard')}
          unreadNotificationsCount={(data.notifications || []).filter(n => !n.isRead).length}
          onOpenNotifications={() => setIsNotificationOpen(true)}
          onOpenGoogleSitelinks={() => setIsGoogleSitelinksOpen(true)}
        />
      )}

      {/* Main View Area */}
      <main className="flex-1 w-full">
        {renderCurrentView()}
      </main>

      {/* Footer - shown only on public pages */}
      {currentView !== 'dashboard' && (
        <Footer
          settings={data.settings}
          onNavigate={handleNavigate}
          onOpenDigitalServices={() => setIsDigitalServicesOpen(true)}
          onOpenGoogleSitelinks={() => setIsGoogleSitelinksOpen(true)}
        />
      )}

      {/* Global Modals */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        data={data}
        onSelectResult={(view, id) => handleNavigate(view, id)}
      />

      <DigitalServicesModal
        isOpen={isDigitalServicesOpen}
        onClose={() => setIsDigitalServicesOpen(false)}
        onNavigateToSpmb={() => handleNavigate('spmb')}
      />

      <LightboxModal
        item={lightboxItem}
        onClose={() => setLightboxItem(null)}
      />

      {/* In-App Notifications Modal */}
      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={data.notifications || []}
        onMarkRead={handleMarkNotificationRead}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onNavigate={(view) => {
          setIsNotificationOpen(false);
          handleNavigate(view);
        }}
      />

      {/* Smooth Scroll-To-Top Button */}
      <ScrollToTop />

      {/* Google Search Results & Sitelinks Interactive Simulator Modal */}
      <GoogleSearchSitelinksModal
        isOpen={isGoogleSitelinksOpen}
        onClose={() => setIsGoogleSitelinksOpen(false)}
        settings={data.settings}
        onNavigate={(view, param) => handleNavigate(view, param)}
      />

      {/* RBAC Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onOpenForgotPassword={() => {
          setIsLoginOpen(false);
          setIsResetPasswordOpen(true);
        }}
        onOpenProvisioning={() => {
          setIsLoginOpen(false);
          setIsProvisionOpen(true);
        }}
      />

      <ResetPasswordModal
        isOpen={isResetPasswordOpen}
        onClose={() => setIsResetPasswordOpen(false)}
        onSuccessRedirectLogin={() => {
          setIsResetPasswordOpen(false);
          setIsLoginOpen(true);
        }}
      />

      <SuperAdminProvisionModal
        isOpen={isProvisionOpen}
        onClose={() => setIsProvisionOpen(false)}
        onSuccess={() => {
          setIsProvisionOpen(false);
          setIsLoginOpen(true);
        }}
      />

    </div>
  );
}
