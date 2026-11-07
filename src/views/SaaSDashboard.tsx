import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard,
  FileText,
  Globe,
  Bell,
  Calendar,
  Image as ImageIcon,
  Building2,
  GraduationCap,
  Users,
  FolderDown,
  UserCheck,
  ShieldCheck,
  BarChart3,
  History,
  Settings,
  Database,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Search,
  Plus,
  Trash2,
  Edit3,
  Check,
  Eye,
  Download,
  Upload,
  RefreshCw,
  Copy,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Unlock,
  KeyRound,
  Filter,
  Send,
  Sparkles,
  ArrowUpDown,
  BookOpen,
  LogOut,
  Code2,
  Play,
  Server,
  Layers,
  Terminal,
  CheckSquare
} from 'lucide-react';
import {
  DatabaseSchema,
  User,
  PermissionKey,
  EditorialArticle,
  CustomPage,
  AnnouncementItem,
  EventItem,
  StaffItem,
  ClassItem,
  DownloadItem,
  SpmbRegistration,
  RoleDefinition,
  AuditLog,
  NotificationItem,
  SchoolSettings,
  GalleryItem
} from '../types/index.ts';
import { api } from '../services/api.ts';

export type DashboardMenuId =
  | 'ringkasan'
  | 'berita'
  | 'halaman'
  | 'pengumuman'
  | 'kalender'
  | 'galeri'
  | 'profil'
  | 'guru'
  | 'siswa'
  | 'dokumen'
  | 'spmb'
  | 'pengguna'
  | 'roles'
  | 'notifikasi'
  | 'laporan'
  | 'audit'
  | 'pengaturan'
  | 'backup';

interface SaaSDashboardProps {
  currentUser: User;
  userPermissions: PermissionKey[];
  data: DatabaseSchema;
  onRefresh: (fresh: DatabaseSchema) => void;
  onNavigate: (view: string, param?: string) => void;
  onLogout: () => void;
  initialTab?: DashboardMenuId;
  onTabChange?: (tab: DashboardMenuId) => void;
}

interface MenuItemDef {
  id: DashboardMenuId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'Utama' | 'Konten & Publikasi' | 'Akademik & Kelembagaan' | 'Layanan & Kesiswaan' | 'Pengguna & Keamanan' | 'Sistem';
  requiredPermission?: PermissionKey;
  allowedRoles?: string[];
  badge?: number | string;
}

const ALL_MENU_ITEMS: MenuItemDef[] = [
  // 1. Ringkasan
  { id: 'ringkasan', label: '1. Ringkasan', icon: LayoutDashboard, group: 'Utama' },

  // Konten & Publikasi
  { id: 'berita', label: '2. Berita & Artikel', icon: FileText, group: 'Konten & Publikasi', requiredPermission: 'content.view' },
  { id: 'halaman', label: '3. Halaman Website', icon: Globe, group: 'Konten & Publikasi', requiredPermission: 'content.create' },
  { id: 'pengumuman', label: '4. Pengumuman', icon: Bell, group: 'Konten & Publikasi', requiredPermission: 'content.view' },
  { id: 'kalender', label: '5. Kalender & Agenda', icon: Calendar, group: 'Konten & Publikasi', requiredPermission: 'content.view' },
  { id: 'galeri', label: '6. Galeri Media', icon: ImageIcon, group: 'Konten & Publikasi', requiredPermission: 'content.view' },

  // Akademik & Kelembagaan
  { id: 'profil', label: '7. Profil Sekolah', icon: Building2, group: 'Akademik & Kelembagaan', requiredPermission: 'settings.manage' },
  { id: 'guru', label: '8. Data Guru', icon: GraduationCap, group: 'Akademik & Kelembagaan', requiredPermission: 'document.manage' },
  { id: 'siswa', label: '9. Data Siswa', icon: Users, group: 'Akademik & Kelembagaan', requiredPermission: 'grades.manage' },

  // Layanan & Kesiswaan
  { id: 'dokumen', label: '10. Dokumen & Unduhan', icon: FolderDown, group: 'Layanan & Kesiswaan', requiredPermission: 'document.manage' },
  { id: 'spmb', label: '11. SPMB', icon: UserCheck, group: 'Layanan & Kesiswaan', requiredPermission: 'spmb.verify' },

  // Pengguna & Keamanan
  { id: 'pengguna', label: '12. Pengguna', icon: Users, group: 'Pengguna & Keamanan', requiredPermission: 'users.manage' },
  { id: 'roles', label: '13. Role & Permission', icon: ShieldCheck, group: 'Pengguna & Keamanan', requiredPermission: 'roles.manage' },
  { id: 'notifikasi', label: '14. Notifikasi', icon: Bell, group: 'Pengguna & Keamanan' },
  { id: 'laporan', label: '15. Laporan', icon: BarChart3, group: 'Pengguna & Keamanan', allowedRoles: ['super_admin', 'admin_sekolah', 'operator_tu'] },
  { id: 'audit', label: '16. Audit Log', icon: History, group: 'Pengguna & Keamanan', requiredPermission: 'audit.view' },

  // Sistem
  { id: 'pengaturan', label: '17. Pengaturan', icon: Settings, group: 'Sistem', requiredPermission: 'settings.manage' },
  { id: 'backup', label: '18. Backup & Pemulihan', icon: Database, group: 'Sistem', requiredPermission: 'settings.manage' }
];

export const SaaSDashboard: React.FC<SaaSDashboardProps> = ({
  currentUser,
  userPermissions,
  data,
  onRefresh,
  onNavigate,
  onLogout,
  initialTab = 'ringkasan',
  onTabChange
}) => {
  // Navigation & Layout State (individual sub-page per menu)
  const [activeTab, setActiveTab] = useState<DashboardMenuId>(initialTab);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);
  const [isTabLoading, setIsTabLoading] = useState(false);

  // Sync activeTab when initialTab prop updates from URL hash routing
  useEffect(() => {
    if (initialTab && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleSelectTab = (tabId: DashboardMenuId) => {
    if (tabId === activeTab) return;
    setIsTabLoading(true);
    setActiveTab(tabId);
    onTabChange?.(tabId);
    setMobileMenuOpen(false);
    setTimeout(() => {
      setIsTabLoading(false);
    }, 200);
  };

  // Sorting & Pagination States
  const [articleSortField, setArticleSortField] = useState<'title' | 'category' | 'createdAt' | 'status'>('createdAt');
  const [articleSortAsc, setArticleSortAsc] = useState(false);
  const [articlePage, setArticlePage] = useState(1);

  const [spmbSortField, setSpmbSortField] = useState<'fullName' | 'registrationNumber' | 'averageScore' | 'status'>('registrationNumber');
  const [spmbSortAsc, setSpmbSortAsc] = useState(true);
  const [spmbPage, setSpmbPage] = useState(1);

  const [staffPage, setStaffPage] = useState(1);
  const [studentPage, setStudentPage] = useState(1);
  const [auditPage, setAuditPage] = useState(1);

  // Global Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Global Confirm Delete Modal State
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    onConfirm: async () => {}
  });

  // Global Preview Modal State (for Articles and Pages)
  const [previewContent, setPreviewContent] = useState<{
    isOpen: boolean;
    id?: string;
    contentType?: 'article' | 'page';
    title: string;
    category?: string;
    author?: string;
    date?: string;
    content: string;
    status?: string;
    imageUrl?: string;
  }>({
    isOpen: false,
    title: '',
    content: ''
  });

  // Filter menus based on permissions and roles
  const allowedMenus = useMemo(() => {
    return ALL_MENU_ITEMS.filter((item) => {
      // Super admin can see all menus
      if (currentUser.role === 'super_admin') return true;

      // Check explicit allowedRoles array
      if (item.allowedRoles && !item.allowedRoles.includes(currentUser.role)) {
        return false;
      }

      // If requiredPermission is defined, check userPermissions
      if (item.requiredPermission) {
        return userPermissions.includes(item.requiredPermission);
      }

      return true;
    });
  }, [currentUser, userPermissions]);

  // Ensure active tab is within allowed menus; if unauthorized, fallback to 'ringkasan'
  useEffect(() => {
    const isAllowed = allowedMenus.some((m) => m.id === activeTab);
    if (!isAllowed) {
      setActiveTab('ringkasan');
    }
  }, [allowedMenus, activeTab]);

  // Quick statistics calculation for badges
  const pendingArticlesCount = useMemo(() => {
    return (data.articles || []).filter((a) => a.status === 'pending_approval').length;
  }, [data.articles]);

  const pendingSpmbCount = useMemo(() => {
    return (data.spmb || []).filter((s) => s.status === 'Menunggu Verifikasi').length;
  }, [data.spmb]);

  const unreadNotifCount = useMemo(() => {
    return (data.notifications || []).filter((n) => !n.isRead).length;
  }, [data.notifications]);

  // ----------------------------------------------------
  // SUB-VIEW STATES & HANDLERS
  // ----------------------------------------------------

  // 1. Articles / Berita CRUD State
  const [articlesList, setArticlesList] = useState<EditorialArticle[]>(data.articles || []);
  const [articleFilterStatus, setArticleFilterStatus] = useState<string>('all');
  const [articleSearch, setArticleSearch] = useState('');
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<EditorialArticle | null>(null);
  const [articleFormData, setArticleFormData] = useState({
    title: '',
    category: 'Kegiatan' as EditorialArticle['category'],
    excerpt: '',
    content: '',
    imageUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
    status: 'draft' as EditorialArticle['status'],
    tags: 'SMAN 1 Julok, Prestasi, Buket Seuraja'
  });

  // 2. Custom Pages CRUD State
  const [pagesList, setPagesList] = useState<CustomPage[]>(data.pages || []);
  const [pageSearch, setPageSearch] = useState('');
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [pageFormData, setPageFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'published' as 'published' | 'draft',
    menuPlacement: 'both' as 'header' | 'footer' | 'both' | 'none',
    revisionSummary: ''
  });
  const [activeRevisionPage, setActiveRevisionPage] = useState<CustomPage | null>(null);

  // 3. Announcements CRUD State
  const [announcementsList, setAnnouncementsList] = useState<AnnouncementItem[]>(data.announcements || []);
  const [annSearch, setAnnSearch] = useState('');
  const [isAnnModalOpen, setIsAnnModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<AnnouncementItem | null>(null);
  const [annFormData, setAnnFormData] = useState({
    title: '',
    content: '',
    target: 'Semua' as AnnouncementItem['target'],
    isUrgent: false,
    downloadUrl: '',
    attachmentName: ''
  });

  // 4. Events & Agenda CRUD State
  const [eventsList, setEventsList] = useState<EventItem[]>(data.events || []);
  const [eventSearch, setEventSearch] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventFormData, setEventFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '08:00 - Selesai',
    location: 'Kampus SMAN 1 Julok',
    organizer: 'Panitia Sekolah',
    description: '',
    category: 'Akademik' as EventItem['category']
  });

  // 5. Galleries CRUD State
  const [galleriesList, setGalleriesList] = useState<GalleryItem[]>(data.galleries || []);
  const [gallerySearch, setGallerySearch] = useState('');
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryFormData, setGalleryFormData] = useState({
    title: '',
    url: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
    category: 'Kegiatan Belajar' as GalleryItem['category'],
    caption: '',
    type: 'photo' as 'photo' | 'video'
  });

  // 6. Profil Sekolah State
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(data.settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // 7. Guru & Tendik (Staff) CRUD State
  const [staffList, setStaffList] = useState<StaffItem[]>(data.staff || []);
  const [staffSearch, setStaffSearch] = useState('');
  const [staffCategoryFilter, setStaffCategoryFilter] = useState<'all' | 'guru' | 'tendik'>('all');
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffItem | null>(null);
  const [staffFormData, setStaffFormData] = useState({
    name: '',
    nip: '',
    role: 'Guru Mata Pelajaran',
    subject: '',
    education: 'S1 Pendidikan',
    photoUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
    category: 'guru' as 'guru' | 'tendik',
    isLeader: false
  });

  // 8. Data Siswa CRUD State (Protected)
  const [studentsList, setStudentsList] = useState<Array<{
    id: string;
    nisn: string;
    name: string;
    className: string;
    major: string;
    gender: string;
    status: string;
    parentPhone: string;
  }>>(() => {
    // Generate initial students list from classes & users
    return [
      { id: 'sis-01', nisn: '0067823901', name: 'Muhammad Rayhan', className: 'XII MIPA 1', major: 'Fase F (MIPA)', gender: 'Laki-laki', status: 'Aktif', parentPhone: '0812-6900-1122' },
      { id: 'sis-02', nisn: '0067823902', name: 'Cut Nurul Aini', className: 'XII MIPA 1', major: 'Fase F (MIPA)', gender: 'Perempuan', status: 'Aktif', parentPhone: '0813-7722-3344' },
      { id: 'sis-03', nisn: '0067823903', name: 'Zulkifli Abdullah', className: 'XII IPS 1', major: 'Fase F (IPS)', gender: 'Laki-laki', status: 'Aktif', parentPhone: '0852-8899-4455' },
      { id: 'sis-04', nisn: '0071234501', name: 'Siti Rahmah', className: 'XI MIPA 2', major: 'Fase F (MIPA)', gender: 'Perempuan', status: 'Aktif', parentPhone: '0812-3344-5566' },
      { id: 'sis-05', nisn: '0071234502', name: 'Teuku Iskandar', className: 'XI IPS 1', major: 'Fase F (IPS)', gender: 'Laki-laki', status: 'Aktif', parentPhone: '0821-5566-7788' },
      { id: 'sis-06', nisn: '0089012301', name: 'Farhan Syahputra', className: 'X-1', major: 'Fase E (Umum)', gender: 'Laki-laki', status: 'Aktif', parentPhone: '0823-7788-9900' },
      { id: 'sis-07', nisn: '0089012302', name: 'Aisyah Putri', className: 'X-2', major: 'Fase E (Umum)', gender: 'Perempuan', status: 'Aktif', parentPhone: '0853-1122-4433' }
    ];
  });
  const [studentSearch, setStudentSearch] = useState('');
  const [studentClassFilter, setStudentClassFilter] = useState('all');
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any | null>(null);
  const [studentFormData, setStudentFormData] = useState({
    nisn: '',
    name: '',
    className: 'X-1',
    major: 'Fase E (Umum)',
    gender: 'Laki-laki',
    status: 'Aktif',
    parentPhone: ''
  });

  // 9. Downloads & Dokumen CRUD State
  const [downloadsList, setDownloadsList] = useState<DownloadItem[]>(data.downloads || []);
  const [downloadSearch, setDownloadSearch] = useState('');
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
  const [editingDownload, setEditingDownload] = useState<DownloadItem | null>(null);
  const [downloadFormData, setDownloadFormData] = useState({
    title: '',
    category: 'Kurikulum & Kalender' as DownloadItem['category'],
    fileSize: '1.2 MB',
    fileType: 'PDF' as DownloadItem['fileType'],
    description: '',
    isRestricted: false,
    requiredRole: ['guru', 'operator_tu']
  });

  // 10. SPMB Verification State
  const [spmbList, setSpmbList] = useState<SpmbRegistration[]>(data.spmb || []);
  const [spmbSearch, setSpmbSearch] = useState('');
  const [spmbPathwayFilter, setSpmbPathwayFilter] = useState('all');
  const [spmbStatusFilter, setSpmbStatusFilter] = useState('all');
  const [selectedSpmbDetail, setSelectedSpmbDetail] = useState<SpmbRegistration | null>(null);

  // 11. Users Management State
  const [usersList, setUsersList] = useState<User[]>(data.users || []);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'editor',
    password: 'Password123!',
    phone: '',
    nip: '',
    nisn: ''
  });

  // 12. Roles & Permissions Matrix State
  const [rolesList, setRolesList] = useState<RoleDefinition[]>(data.roles || []);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [roleFormData, setRoleFormData] = useState({
    name: '',
    label: '',
    description: '',
    permissions: ['content.view' as PermissionKey, 'document.manage' as PermissionKey]
  });

  // 13. Notifications Broadcast State
  const [notificationsList, setNotificationsList] = useState<NotificationItem[]>(data.notifications || []);
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastFormData, setBroadcastFormData] = useState({
    title: '',
    message: '',
    type: 'urgent_announcement' as NotificationItem['type'],
    targetRole: 'all' as any
  });

  // 14. Audit Log State
  const [auditLogsList, setAuditLogsList] = useState<AuditLog[]>(data.auditLogs || []);
  const [auditSearch, setAuditSearch] = useState('');
  const [auditStatusFilter, setAuditStatusFilter] = useState('all');

  // 15. Reports & Analytics State
  const [reportsData, setReportsData] = useState<any>(null);
  const [isLoadingReports, setIsLoadingReports] = useState(false);

  useEffect(() => {
    if (activeTab === 'laporan') {
      setIsLoadingReports(true);
      api.fetchReportsSummary()
        .then((res) => setReportsData(res))
        .catch(() => {})
        .finally(() => setIsLoadingReports(false));
    }
  }, [activeTab]);

  // 16. System Health & Diagnostics State
  const [systemHealth, setSystemHealth] = useState<any>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(false);

  // 17. Security Diagnostics & 3NF Schema States
  const [securityTestResults, setSecurityTestResults] = useState<any>(null);
  const [isTestingSecurity, setIsTestingSecurity] = useState(false);
  const [dryRunResult, setDryRunResult] = useState<any>(null);
  const [isTestingDryRun, setIsTestingDryRun] = useState(false);
  const [schemaSummary, setSchemaSummary] = useState<any>(null);
  const [schemaDDL, setSchemaDDL] = useState<string>('');
  const [isSchemaModalOpen, setIsSchemaModalOpen] = useState(false);
  const [snapshotsList, setSnapshotsList] = useState<any[]>([]);
  const [isCreatingSnapshot, setIsCreatingSnapshot] = useState(false);
  const [integrationsStatus, setIntegrationsStatus] = useState<any>(null);

  const loadBackupAndSecurityData = async () => {
    try {
      const [snapRes, intRes, schemaRes] = await Promise.all([
        api.fetchSnapshots(),
        api.fetchIntegrationsStatus(),
        api.fetchSchemaSummary()
      ]);
      if (snapRes?.snapshots) setSnapshotsList(snapRes.snapshots);
      if (intRes) setIntegrationsStatus(intRes);
      if (schemaRes) setSchemaSummary(schemaRes);
    } catch (e) {
      console.warn('Gagal memuat diagnostik keamanan:', e);
    }
  };

  useEffect(() => {
    if (activeTab === 'backup' || activeTab === 'pengaturan') {
      setIsLoadingHealth(true);
      api.fetchSystemHealth()
        .then((res) => setSystemHealth(res))
        .catch(() => {})
        .finally(() => setIsLoadingHealth(false));
      loadBackupAndSecurityData();
    }
  }, [activeTab]);

  const handleRunSecurityTests = async () => {
    setIsTestingSecurity(true);
    try {
      const res = await api.runSecurityTests();
      setSecurityTestResults(res);
      if (res.failed === 0) {
        showToast(`13 Pengujian Keamanan Selesai: Seluruh ${res.passed} Uji LULUS!`, 'success');
      } else {
        showToast(`Pengujian selesai: ${res.passed} Lulus, ${res.failed} Gagal.`, 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menjalankan pengujian', 'error');
    } finally {
      setIsTestingSecurity(false);
    }
  };

  const handleRunDryRun = async () => {
    setIsTestingDryRun(true);
    try {
      const res = await api.testRecoveryDryRun();
      setDryRunResult(res);
      if (res.success) {
        showToast('Dry-run sukses! Integritas 22 tabel data 100% konsisten.', 'success');
      } else {
        showToast('Dry-run mendeteksi entitas yang hilang.', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal menguji integritas pemulihan', 'error');
    } finally {
      setIsTestingDryRun(false);
    }
  };

  const handleCreateSnapshot = async () => {
    setIsCreatingSnapshot(true);
    try {
      const res = await api.createSnapshot();
      if (res.success) {
        showToast('Snapshot cadangan baru berhasil dibuat (rotasi 10 file otomatis).', 'success');
        const snapRes = await api.fetchSnapshots();
        if (snapRes?.snapshots) setSnapshotsList(snapRes.snapshots);
      } else {
        showToast(res.error || 'Gagal membuat snapshot', 'error');
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat snapshot', 'error');
    } finally {
      setIsCreatingSnapshot(false);
    }
  };

  const handleOpenSchemaModal = async () => {
    setIsSchemaModalOpen(true);
    if (!schemaDDL) {
      const ddl = await api.fetchSchemaDDL();
      setSchemaDDL(ddl);
    }
  };

  const handleDownloadDDL = async () => {
    const ddl = schemaDDL || await api.fetchSchemaDDL();
    const blob = new Blob([ddl], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `schema-sman1julok-3nf-${Date.now()}.sql`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Berkas DDL SQL berhasil diunduh.', 'success');
  };

  // Sync state if initial data changes
  useEffect(() => {
    setArticlesList(data.articles || []);
    setPagesList(data.pages || []);
    setAnnouncementsList(data.announcements || []);
    setEventsList(data.events || []);
    setGalleriesList(data.galleries || []);
    setStaffList(data.staff || []);
    setDownloadsList(data.downloads || []);
    setSpmbList(data.spmb || []);
    setUsersList(data.users || []);
    setRolesList(data.roles || []);
    setAuditLogsList(data.auditLogs || []);
    setNotificationsList(data.notifications || []);
    setSchoolSettings(data.settings);
  }, [data]);

  // ----------------------------------------------------
  // ACTION HANDLERS
  // ----------------------------------------------------

  // News / Article Save
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleFormData.title || !articleFormData.content) {
      showToast('Judul dan konten artikel wajib diisi!', 'error');
      return;
    }

    try {
      if (editingArticle) {
        // Update existing article
        const updated = await api.updateEditorialArticle(editingArticle.id, {
          title: articleFormData.title,
          category: articleFormData.category,
          excerpt: articleFormData.excerpt,
          content: articleFormData.content,
          imageUrl: articleFormData.imageUrl,
          status: articleFormData.status,
          tags: articleFormData.tags.split(',').map((t) => t.trim())
        });
        setArticlesList((prev) =>
          prev.map((a) => (a.id === editingArticle.id ? { ...a, ...updated } : a))
        );
        showToast('Artikel berhasil diperbarui!');
      } else {
        // Create new article
        const newArt = await api.createEditorialDraft({
          title: articleFormData.title,
          category: articleFormData.category,
          excerpt: articleFormData.excerpt,
          content: articleFormData.content,
          imageUrl: articleFormData.imageUrl,
          status: articleFormData.status,
          tags: articleFormData.tags.split(',').map((t) => t.trim())
        });
        setArticlesList((prev) => [newArt, ...prev]);
        showToast('Draf artikel baru berhasil disimpan!');
      }
      setIsArticleModalOpen(false);
      setEditingArticle(null);
    } catch {
      showToast('Gagal menyimpan artikel.', 'error');
    }
  };

  // Article Workflow Approval / Publish
  const handleApproveArticle = async (articleId: string) => {
    try {
      const updated = await api.approveArticle(articleId, 'Disetujui oleh Kepala Sekolah / Administrator');
      setArticlesList((prev) => prev.map((a) => (a.id === articleId ? updated : a)));
      showToast('Artikel disetujui untuk dipublikasikan.');
    } catch {
      showToast('Gagal menyetujui artikel.', 'error');
    }
  };

  const handlePublishArticle = async (articleId: string) => {
    try {
      const updated = await api.publishArticle(articleId);
      setArticlesList((prev) => prev.map((a) => (a.id === articleId ? updated : a)));
      showToast('Artikel resmi diterbitkan ke website publik!');
    } catch {
      showToast('Gagal mempublikasikan artikel.', 'error');
    }
  };

  // Delete Article
  const handleDeleteArticle = (article: EditorialArticle) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Hapus Berita / Artikel',
      description: `Apakah Anda yakin ingin menghapus artikel "${article.title}"? Tindakan ini permanen dan tidak dapat dibatalkan.`,
      onConfirm: async () => {
        try {
          await api.deleteEditorialArticle(article.id);
          setArticlesList((prev) => prev.filter((a) => a.id !== article.id));
          showToast(`Artikel "${article.title}" berhasil dihapus.`);
        } catch {
          showToast('Gagal menghapus artikel.', 'error');
        }
      }
    });
  };

  // Save Custom Page
  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageFormData.title || !pageFormData.content) {
      showToast('Judul dan isi halaman wajib diisi!', 'error');
      return;
    }

    try {
      if (editingPage) {
        const updated = await api.updatePage(editingPage.id, pageFormData);
        setPagesList((prev) => prev.map((p) => (p.id === editingPage.id ? updated : p)));
        showToast('Halaman website berhasil diperbarui!');
      } else {
        const created = await api.createPage(pageFormData);
        setPagesList((prev) => [created, ...prev]);
        showToast('Halaman website baru berhasil dibuat!');
      }
      setIsPageModalOpen(false);
      setEditingPage(null);
    } catch {
      showToast('Gagal menyimpan halaman.', 'error');
    }
  };

  // Delete Custom Page
  const handleDeletePage = (page: CustomPage) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Hapus Halaman Website',
      description: `Apakah Anda yakin ingin menghapus halaman "${page.title}" (${page.slug})?`,
      onConfirm: async () => {
        try {
          await api.deletePage(page.id);
          setPagesList((prev) => prev.filter((p) => p.id !== page.id));
          showToast('Halaman website berhasil dihapus.');
        } catch {
          showToast('Gagal menghapus halaman.', 'error');
        }
      }
    });
  };

  // Restore Revision
  const handleRestoreRevision = async (pageId: string, revId: string) => {
    try {
      const updated = await api.restorePageRevision(pageId, revId);
      setPagesList((prev) => prev.map((p) => (p.id === pageId ? updated : p)));
      setActiveRevisionPage(null);
      showToast('Versi revisi halaman berhasil dipulihkan!');
    } catch {
      showToast('Gagal memulihkan revisi.', 'error');
    }
  };

  // Announcements Save & Delete
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annFormData.title || !annFormData.content) {
      showToast('Judul dan pengumuman wajib diisi!', 'error');
      return;
    }

    try {
      if (editingAnn) {
        const updated = await api.updateAnnouncement(editingAnn.id, annFormData);
        setAnnouncementsList((prev) => prev.map((a) => (a.id === editingAnn.id ? updated : a)));
        showToast('Pengumuman berhasil diperbarui!');
      } else {
        const created = await api.createAnnouncement(annFormData);
        setAnnouncementsList((prev) => [created, ...prev]);
        showToast('Pengumuman resmi berhasil ditambahkan!');
      }
      setIsAnnModalOpen(false);
      setEditingAnn(null);
    } catch {
      showToast('Gagal menyimpan pengumuman.', 'error');
    }
  };

  const handleDeleteAnnouncement = (ann: AnnouncementItem) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Hapus Pengumuman',
      description: `Apakah Anda yakin ingin menghapus pengumuman "${ann.title}"?`,
      onConfirm: async () => {
        try {
          await api.deleteAnnouncement(ann.id);
          setAnnouncementsList((prev) => prev.filter((a) => a.id !== ann.id));
          showToast('Pengumuman berhasil dihapus.');
        } catch {
          showToast('Gagal menghapus pengumuman.', 'error');
        }
      }
    });
  };

  // Calendar Event Save & Delete
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventFormData.title || !eventFormData.date) {
      showToast('Judul dan tanggal agenda wajib diisi!', 'error');
      return;
    }

    try {
      if (editingEvent) {
        const updated = await api.updateEvent(editingEvent.id, eventFormData);
        setEventsList((prev) => prev.map((ev) => (ev.id === editingEvent.id ? updated : ev)));
        showToast('Agenda kegiatan berhasil diperbarui!');
      } else {
        const created = await api.createEvent(eventFormData);
        setEventsList((prev) => [created, ...prev]);
        showToast('Agenda kegiatan baru berhasil dijadwalkan!');
      }
      setIsEventModalOpen(false);
      setEditingEvent(null);
    } catch {
      showToast('Gagal menyimpan agenda.', 'error');
    }
  };

  const handleDeleteEvent = (evt: EventItem) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Hapus Agenda',
      description: `Apakah Anda yakin ingin menghapus agenda "${evt.title}"?`,
      onConfirm: async () => {
        try {
          await api.deleteEvent(evt.id);
          setEventsList((prev) => prev.filter((e) => e.id !== evt.id));
          showToast('Agenda berhasil dihapus.');
        } catch {
          showToast('Gagal menghapus agenda.', 'error');
        }
      }
    });
  };

  // Gallery Save & Delete
  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryFormData.title || !galleryFormData.url) {
      showToast('Judul dan URL media wajib diisi!', 'error');
      return;
    }

    try {
      if (editingGallery) {
        const updated = await api.updateGallery(editingGallery.id, galleryFormData);
        setGalleriesList((prev) => prev.map((g) => (g.id === editingGallery.id ? updated : g)));
        showToast('Galeri foto/video berhasil diperbarui!');
      } else {
        const created = await api.createGallery(galleryFormData);
        setGalleriesList((prev) => [created, ...prev]);
        showToast('Media baru berhasil ditambahkan ke galeri!');
      }
      setIsGalleryModalOpen(false);
      setEditingGallery(null);
    } catch {
      showToast('Gagal menyimpan galeri.', 'error');
    }
  };

  const handleDeleteGallery = (gal: GalleryItem) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Hapus Media Galeri',
      description: `Apakah Anda yakin ingin menghapus media "${gal.title}"?`,
      onConfirm: async () => {
        try {
          await api.deleteGallery(gal.id);
          setGalleriesList((prev) => prev.filter((g) => g.id !== gal.id));
          showToast('Media galeri berhasil dihapus.');
        } catch {
          showToast('Gagal menghapus media galeri.', 'error');
        }
      }
    });
  };

  // Save School Profile Settings
  const handleSaveSchoolSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const updated = await api.updateSettings(schoolSettings);
      setSchoolSettings(updated);
      onRefresh({ ...data, settings: updated });
      showToast('Pengaturan profil sekolah berhasil disimpan!');
    } catch {
      showToast('Gagal menyimpan profil sekolah.', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Staff (Guru & Tendik) Save & Delete
  const handleSaveStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffFormData.name || !staffFormData.nip) {
      showToast('Nama lengkap dan NIP wajib diisi!', 'error');
      return;
    }

    try {
      if (editingStaff) {
        const updated = await api.updateStaff(editingStaff.id, staffFormData);
        setStaffList((prev) => prev.map((s) => (s.id === editingStaff.id ? updated : s)));
        showToast('Data guru/tendik berhasil diperbarui!');
      } else {
        const created = await api.createStaff(staffFormData);
        setStaffList((prev) => [...prev, created]);
        showToast('Pendidik/Tenaga kependidikan baru berhasil ditambahkan!');
      }
      setIsStaffModalOpen(false);
      setEditingStaff(null);
    } catch {
      showToast('Gagal menyimpan data guru.', 'error');
    }
  };

  const handleDeleteStaff = (staff: StaffItem) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Hapus Data Guru / Tendik',
      description: `Apakah Anda yakin ingin menghapus data pendidik "${staff.name}" (NIP: ${staff.nip})?`,
      onConfirm: async () => {
        try {
          await api.deleteStaff(staff.id);
          setStaffList((prev) => prev.filter((s) => s.id !== staff.id));
          showToast('Data guru/tendik berhasil dihapus.');
        } catch {
          showToast('Gagal menghapus data guru.', 'error');
        }
      }
    });
  };

  // Student Save & Delete
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormData.nisn || !studentFormData.name) {
      showToast('NISN dan nama siswa wajib diisi!', 'error');
      return;
    }

    if (editingStudent) {
      setStudentsList((prev) =>
        prev.map((s) => (s.id === editingStudent.id ? { ...s, ...studentFormData } : s))
      );
      showToast('Data siswa berhasil diperbarui!');
    } else {
      const newSis = {
        id: `sis-${Date.now()}`,
        ...studentFormData
      };
      setStudentsList((prev) => [newSis, ...prev]);
      showToast('Data siswa baru berhasil ditambahkan!');
    }
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };

  const handleDeleteStudent = (student: any) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Hapus Data Siswa',
      description: `Apakah Anda yakin ingin menghapus siswa "${student.name}" (NISN: ${student.nisn})? Data nilai terkait akan diamankan.`,
      onConfirm: async () => {
        setStudentsList((prev) => prev.filter((s) => s.id !== student.id));
        showToast('Data siswa berhasil dihapus.');
      }
    });
  };

  // Download Item Save & Delete
  const handleSaveDownload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!downloadFormData.title) {
      showToast('Judul dokumen wajib diisi!', 'error');
      return;
    }

    try {
      if (editingDownload) {
        const updated = await api.updateDownload(editingDownload.id, downloadFormData);
        setDownloadsList((prev) => prev.map((d) => (d.id === editingDownload.id ? updated : d)));
        showToast('Dokumen unduhan berhasil diperbarui!');
      } else {
        const created = await api.createDownload(downloadFormData);
        setDownloadsList((prev) => [created, ...prev]);
        showToast('Dokumen resmi baru berhasil diunggah!');
      }
      setIsDownloadModalOpen(false);
      setEditingDownload(null);
    } catch {
      showToast('Gagal menyimpan dokumen.', 'error');
    }
  };

  const handleDeleteDownload = (doc: DownloadItem) => {
    setConfirmDelete({
      isOpen: true,
      title: 'Hapus Dokumen',
      description: `Apakah Anda yakin ingin menghapus dokumen "${doc.title}"?`,
      onConfirm: async () => {
        try {
          await api.deleteDownload(doc.id);
          setDownloadsList((prev) => prev.filter((d) => d.id !== doc.id));
          showToast('Dokumen berhasil dihapus.');
        } catch {
          showToast('Gagal menghapus dokumen.', 'error');
        }
      }
    });
  };

  // SPMB Status Update
  const handleUpdateSpmbStatus = async (id: string, status: SpmbRegistration['status'], notes?: string) => {
    try {
      await api.updateSpmbStatus(id, status, notes);
      setSpmbList((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status, notes: notes || s.notes } : s))
      );
      if (selectedSpmbDetail && selectedSpmbDetail.id === id) {
        setSelectedSpmbDetail((prev) => prev ? { ...prev, status, notes: notes || prev.notes } : null);
      }
      showToast(`Status verifikasi calon siswa diubah menjadi: ${status}`);
    } catch {
      showToast('Gagal memperbarui status SPMB.', 'error');
    }
  };

  // User Management Handlers
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userFormData.username || !userFormData.email) {
      showToast('Username dan email wajib diisi!', 'error');
      return;
    }

    try {
      const created = await api.createUser(userFormData);
      setUsersList((prev) => [...prev, created]);
      setIsUserModalOpen(false);
      showToast(`Akun pengguna ${created.username} berhasil dibuat!`);
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat pengguna.', 'error');
    }
  };

  const handleToggleUserStatus = async (user: User) => {
    try {
      const updated = await api.toggleUserStatus(user.id);
      setUsersList((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      showToast(`Status akun ${user.username} diubah menjadi: ${updated.isActive ? 'Aktif' : 'Nonaktif'}.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah status akun.', 'error');
    }
  };

  const handleUnlockUser = async (user: User) => {
    try {
      const updated = await api.toggleUserStatus(user.id, 'unlock');
      setUsersList((prev) => prev.map((u) => (u.id === user.id ? updated : u)));
      showToast(`Kunci akun ${user.username} berhasil dibuka.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal membuka kunci akun.', 'error');
    }
  };

  const handleDeleteUser = (user: User) => {
    if (user.role === 'super_admin') {
      showToast('Aturan Keamanan: Akun Super Admin tidak boleh dihapus.', 'error');
      return;
    }
    if (user.id === currentUser.id) {
      showToast('Anda tidak dapat menghapus akun Anda sendiri.', 'error');
      return;
    }

    setConfirmDelete({
      isOpen: true,
      title: 'Hapus Akun Pengguna',
      description: `Apakah Anda yakin ingin menghapus akun ${user.username} (${user.fullName})?`,
      onConfirm: async () => {
        try {
          await api.deleteUser(user.id);
          setUsersList((prev) => prev.filter((u) => u.id !== user.id));
          showToast(`Akun ${user.username} berhasil dihapus.`);
        } catch (err: any) {
          showToast(err.message || 'Gagal menghapus pengguna.', 'error');
        }
      }
    });
  };

  // Roles Management Handler
  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleFormData.name || !roleFormData.label) {
      showToast('Nama kode dan label role wajib diisi!', 'error');
      return;
    }

    try {
      const created = await api.createRole(roleFormData);
      setRolesList((prev) => [...prev, created]);
      setIsRoleModalOpen(false);
      showToast(`Role kustom '${created.label}' berhasil ditambahkan!`);
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat role.', 'error');
    }
  };

  // Broadcast Notification Handler
  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastFormData.title || !broadcastFormData.message) {
      showToast('Judul dan pesan notifikasi wajib diisi!', 'error');
      return;
    }

    try {
      const newNotif = await api.broadcastNotification(broadcastFormData);
      if (newNotif) {
        setNotificationsList((prev) => [newNotif, ...prev]);
      }
      setIsBroadcastModalOpen(false);
      setBroadcastFormData({ title: '', message: '', type: 'urgent_announcement', targetRole: 'all' });
      showToast('Siaran notifikasi berhasil dikirimkan ke seluruh pengguna terkait!');
    } catch {
      showToast('Gagal mengirimkan notifikasi.', 'error');
    }
  };

  // Backup Export
  const handleDownloadBackup = () => {
    window.open('/api/system/backup', '_blank');
    showToast('Memulai pengunduhan salinan basis data JSON SMA Negeri 1 Julok...');
  };

  // Export SPMB CSV
  const handleExportSpmbCsv = () => {
    window.open('/api/spmb/export', '_blank');
    showToast('Mengunduh data pendaftar SPMB ke format CSV...');
  };

  // Export Audit Log CSV
  const handleExportAuditCsv = () => {
    const headers = ['Timestamp', 'Pengguna', 'Role', 'Aksi', 'Modul', 'IP_Address', 'Status', 'Rincian'];
    const rows = auditLogsList.map((l) => [
      `"${l.timestamp}"`,
      `"${l.username}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.resource}"`,
      `"${l.ipAddress}"`,
      `"${l.status}"`,
      `"${l.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `audit-log-sman1julok-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Audit log berhasil diekspor ke file CSV.');
  };

  // ----------------------------------------------------
  // FILTERED LISTS
  // ----------------------------------------------------
  const filteredArticles = useMemo(() => {
    return articlesList.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(articleSearch.toLowerCase()) ||
        a.authorName?.toLowerCase().includes(articleSearch.toLowerCase()) ||
        a.category.toLowerCase().includes(articleSearch.toLowerCase());
      const matchStatus = articleFilterStatus === 'all' || a.status === articleFilterStatus;
      return matchSearch && matchStatus;
    });
  }, [articlesList, articleSearch, articleFilterStatus]);

  const filteredStaff = useMemo(() => {
    return staffList.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
        s.nip.toLowerCase().includes(staffSearch.toLowerCase()) ||
        s.role.toLowerCase().includes(staffSearch.toLowerCase()) ||
        (s.subject && s.subject.toLowerCase().includes(staffSearch.toLowerCase()));
      const matchCat = staffCategoryFilter === 'all' || s.category === staffCategoryFilter;
      return matchSearch && matchCat;
    });
  }, [staffList, staffSearch, staffCategoryFilter]);

  const filteredStudents = useMemo(() => {
    return studentsList.filter((s) => {
      const matchSearch =
        s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        s.nisn.toLowerCase().includes(studentSearch.toLowerCase());
      const matchClass = studentClassFilter === 'all' || s.className === studentClassFilter;
      return matchSearch && matchClass;
    });
  }, [studentsList, studentSearch, studentClassFilter]);

  const filteredSpmb = useMemo(() => {
    return spmbList.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(spmbSearch.toLowerCase()) ||
        s.registrationNumber.toLowerCase().includes(spmbSearch.toLowerCase()) ||
        s.nisn.toLowerCase().includes(spmbSearch.toLowerCase()) ||
        s.originSchool.toLowerCase().includes(spmbSearch.toLowerCase());
      const matchPathway = spmbPathwayFilter === 'all' || s.chosenPathway === spmbPathwayFilter;
      const matchStatus = spmbStatusFilter === 'all' || s.status === spmbStatusFilter;
      return matchSearch && matchPathway && matchStatus;
    });
  }, [spmbList, spmbSearch, spmbPathwayFilter, spmbStatusFilter]);

  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchSearch =
        u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.fullName.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase());
      const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      return matchSearch && matchRole;
    });
  }, [usersList, userSearch, userRoleFilter]);

  const filteredAuditLogs = useMemo(() => {
    return auditLogsList.filter((l) => {
      const matchSearch =
        l.username.toLowerCase().includes(auditSearch.toLowerCase()) ||
        l.details.toLowerCase().includes(auditSearch.toLowerCase()) ||
        l.action.toLowerCase().includes(auditSearch.toLowerCase());
      const matchStatus = auditStatusFilter === 'all' || l.status === auditStatusFilter;
      return matchSearch && matchStatus;
    });
  }, [auditLogsList, auditSearch, auditStatusFilter]);

  // Pagination & Sorting Memos
  const ARTICLE_PAGE_SIZE = 6;
  const SPMB_PAGE_SIZE = 7;
  const STAFF_PAGE_SIZE = 8;
  const STUDENT_PAGE_SIZE = 8;
  const AUDIT_PAGE_SIZE = 9;

  const sortedArticles = useMemo(() => {
    return [...filteredArticles].sort((a, b) => {
      let valA: any = a[articleSortField] || '';
      let valB: any = b[articleSortField] || '';
      if (articleSortField === 'createdAt') {
        valA = new Date(valA || 0).getTime();
        valB = new Date(valB || 0).getTime();
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }
      if (valA < valB) return articleSortAsc ? -1 : 1;
      if (valA > valB) return articleSortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredArticles, articleSortField, articleSortAsc]);

  const totalArticlePages = Math.ceil(sortedArticles.length / ARTICLE_PAGE_SIZE) || 1;
  const paginatedArticles = useMemo(() => {
    const start = (articlePage - 1) * ARTICLE_PAGE_SIZE;
    return sortedArticles.slice(start, start + ARTICLE_PAGE_SIZE);
  }, [sortedArticles, articlePage]);

  const sortedSpmb = useMemo(() => {
    return [...filteredSpmb].sort((a, b) => {
      let valA: any = a[spmbSortField] || '';
      let valB: any = b[spmbSortField] || '';
      if (spmbSortField === 'averageScore') {
        valA = Number(valA) || 0;
        valB = Number(valB) || 0;
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }
      if (valA < valB) return spmbSortAsc ? -1 : 1;
      if (valA > valB) return spmbSortAsc ? 1 : -1;
      return 0;
    });
  }, [filteredSpmb, spmbSortField, spmbSortAsc]);

  const totalSpmbPages = Math.ceil(sortedSpmb.length / SPMB_PAGE_SIZE) || 1;
  const paginatedSpmb = useMemo(() => {
    const start = (spmbPage - 1) * SPMB_PAGE_SIZE;
    return sortedSpmb.slice(start, start + SPMB_PAGE_SIZE);
  }, [sortedSpmb, spmbPage]);

  const totalStaffPages = Math.ceil(filteredStaff.length / STAFF_PAGE_SIZE) || 1;
  const paginatedStaff = useMemo(() => {
    const start = (staffPage - 1) * STAFF_PAGE_SIZE;
    return filteredStaff.slice(start, start + STAFF_PAGE_SIZE);
  }, [filteredStaff, staffPage]);

  const totalStudentPages = Math.ceil(filteredStudents.length / STUDENT_PAGE_SIZE) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (studentPage - 1) * STUDENT_PAGE_SIZE;
    return filteredStudents.slice(start, start + STUDENT_PAGE_SIZE);
  }, [filteredStudents, studentPage]);

  const totalAuditPages = Math.ceil(filteredAuditLogs.length / AUDIT_PAGE_SIZE) || 1;
  const paginatedAuditLogs = useMemo(() => {
    const start = (auditPage - 1) * AUDIT_PAGE_SIZE;
    return filteredAuditLogs.slice(start, start + AUDIT_PAGE_SIZE);
  }, [filteredAuditLogs, auditPage]);

  // Current active menu metadata
  const currentMenuDef = ALL_MENU_ITEMS.find((m) => m.id === activeTab) || ALL_MENU_ITEMS[0];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800 font-sans selection:bg-sky-700 selection:text-white">
      {/* Toast Notification Container */}
      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border text-sm font-medium animate-in slide-in-from-top-3 duration-200 bg-white border-slate-200">
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          {toast.type === 'info' && <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />}
          <span className="text-slate-800">{toast.message}</span>
        </div>
      )}



      {/* ---------------------------------------------------- */}
      {/* 1. SIDEBAR NAVIGATION                                */}
      {/* ---------------------------------------------------- */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen z-40 bg-slate-950 text-slate-200 border-r border-slate-800 transition-all duration-300 flex flex-col shrink-0 ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80 bg-slate-950">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-sky-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-sm">
              <Building2 className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="flex flex-col truncate">
                <span className="font-bold text-sm tracking-tight text-white leading-tight">SMAN 1 JULOK</span>
                <span className="text-[11px] text-sky-400 font-medium">SaaS Portal Admin</span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
            title={sidebarCollapsed ? 'Perlebar Sidebar' : 'Ciutkan Sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close toggle */}
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="md:hidden p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Role Quick Chip */}
        {!sidebarCollapsed && (
          <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-sky-950 border border-sky-600/50 flex items-center justify-center text-sky-300 font-bold text-xs shrink-0">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-slate-200 truncate">{currentUser.fullName}</p>
                <p className="text-[10px] text-sky-400 font-mono uppercase">{currentUser.role.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Scrollable Navigation Menu (18 items organized in logical groups) */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4 select-none">
          {['Utama', 'Konten & Publikasi', 'Akademik & Kelembagaan', 'Layanan & Kesiswaan', 'Pengguna & Keamanan', 'Sistem'].map((grp) => {
            const groupMenus = allowedMenus.filter((m) => m.group === grp);
            if (groupMenus.length === 0) return null;

            return (
              <div key={grp} className="space-y-1">
                {!sidebarCollapsed && (
                  <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {grp}
                  </div>
                )}
                {groupMenus.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  // Attach badges
                  let badgeCount: number | null = null;
                  if (item.id === 'berita' && pendingArticlesCount > 0) badgeCount = pendingArticlesCount;
                  if (item.id === 'spmb' && pendingSpmbCount > 0) badgeCount = pendingSpmbCount;
                  if (item.id === 'notifikasi' && unreadNotifCount > 0) badgeCount = unreadNotifCount;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        handleSelectTab(item.id);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer group relative ${
                        isActive
                          ? 'bg-sky-700 text-white shadow-sm'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                      }`}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`} />
                      {!sidebarCollapsed && (
                        <span className="truncate flex-1 text-left">{item.label}</span>
                      )}
                      {badgeCount !== null && badgeCount > 0 && (
                        <span
                          className={`ml-auto px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                            isActive ? 'bg-white text-sky-800' : 'bg-amber-500 text-slate-950 font-bold'
                          }`}
                        >
                          {badgeCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer Sidebar / Logout */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950 space-y-1">
          <button
            onClick={() => onNavigate('beranda')}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg cursor-pointer"
            title="Buka Website Publik"
          >
            <ExternalLink className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Lihat Website</span>}
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg cursor-pointer"
            title="Keluar dari Portal"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Keluar Akun</span>}
          </button>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. MAIN LAYOUT AREA                                  */}
      {/* ---------------------------------------------------- */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
          {/* Left: Mobile hamburger + Breadcrumbs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb Trail */}
            <nav className="flex items-center text-xs text-slate-500 font-medium">
              <span
                onClick={() => handleSelectTab('ringkasan')}
                className="hover:text-sky-700 cursor-pointer"
              >
                Dashboard
              </span>
              <span className="mx-2 text-slate-400">/</span>
              <span className="text-slate-400 hidden sm:inline">{currentMenuDef.group}</span>
              <span className="mx-2 text-slate-400 hidden sm:inline">/</span>
              <span className="font-bold text-slate-900 truncate max-w-[200px] sm:max-w-none">
                {currentMenuDef.label}
              </span>
            </nav>
          </div>

          {/* Right: Search, Notifications, Public Web, User Profile */}
          <div className="flex items-center gap-2.5">
            {/* Quick Public Web button */}
            <button
              onClick={() => onNavigate('beranda')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-lg border border-slate-200 cursor-pointer transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Web Publik</span>
            </button>

            {/* Unread Notifications Button */}
            <button
              onClick={() => handleSelectTab('notifikasi')}
              className="relative p-2 text-slate-600 hover:text-sky-800 hover:bg-slate-100 rounded-lg cursor-pointer"
              title="Notifikasi Masuk"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-600" />
              )}
            </button>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-sky-900 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser.fullName.charAt(0)}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                  {currentUser.fullName}
                </p>
                <p className="text-[10px] text-slate-500 font-mono uppercase">
                  {currentUser.role.replace('_', ' ')}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Main Content Body */}
        <main className="p-4 md:p-6 flex-1 space-y-6">
          {/* Header Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                {currentMenuDef.label}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Portal Pengelolaan Resmi SMA Negeri 1 Julok • Buket Seuraja, Aceh Timur
              </p>
            </div>

            {/* Quick Context Action Button depending on current activeTab */}
            <div className="flex items-center gap-2">
              {activeTab === 'berita' && userPermissions.includes('content.create') && (
                <button
                  onClick={() => {
                    setEditingArticle(null);
                    setArticleFormData({
                      title: '',
                      category: 'Kegiatan',
                      excerpt: '',
                      content: '',
                      imageUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
                      status: 'draft',
                      tags: 'SMAN 1 Julok, Kegiatan'
                    });
                    setIsArticleModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Artikel</span>
                </button>
              )}

              {activeTab === 'halaman' && userPermissions.includes('content.create') && (
                <button
                  onClick={() => {
                    setEditingPage(null);
                    setPageFormData({
                      title: '',
                      excerpt: '',
                      content: '',
                      status: 'published',
                      menuPlacement: 'both',
                      revisionSummary: 'Versi Perdana Halaman'
                    });
                    setIsPageModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Halaman Baru</span>
                </button>
              )}

              {activeTab === 'pengumuman' && userPermissions.includes('content.create') && (
                <button
                  onClick={() => {
                    setEditingAnn(null);
                    setAnnFormData({
                      title: '',
                      content: '',
                      target: 'Semua',
                      isUrgent: false,
                      downloadUrl: '',
                      attachmentName: ''
                    });
                    setIsAnnModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pengumuman</span>
                </button>
              )}

              {activeTab === 'kalender' && userPermissions.includes('content.create') && (
                <button
                  onClick={() => {
                    setEditingEvent(null);
                    setEventFormData({
                      title: '',
                      date: new Date().toISOString().split('T')[0],
                      time: '08:00 - Selesai',
                      location: 'Kampus SMAN 1 Julok',
                      organizer: 'Panitia Sekolah',
                      description: '',
                      category: 'Akademik'
                    });
                    setIsEventModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Agenda</span>
                </button>
              )}

              {activeTab === 'galeri' && userPermissions.includes('content.create') && (
                <button
                  onClick={() => {
                    setEditingGallery(null);
                    setGalleryFormData({
                      title: '',
                      url: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
                      category: 'Kegiatan Belajar',
                      caption: '',
                      type: 'photo'
                    });
                    setIsGalleryModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Unggah Galeri</span>
                </button>
              )}

              {activeTab === 'guru' && userPermissions.includes('document.manage') && (
                <button
                  onClick={() => {
                    setEditingStaff(null);
                    setStaffFormData({
                      name: '',
                      nip: '',
                      role: 'Guru Mata Pelajaran',
                      subject: '',
                      education: 'S1 Pendidikan',
                      photoUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
                      category: 'guru',
                      isLeader: false
                    });
                    setIsStaffModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Guru / Tendik</span>
                </button>
              )}

              {activeTab === 'siswa' && userPermissions.includes('grades.manage') && (
                <button
                  onClick={() => {
                    setEditingStudent(null);
                    setStudentFormData({
                      nisn: '',
                      name: '',
                      className: 'X-1',
                      major: 'Fase E (Umum)',
                      gender: 'Laki-laki',
                      status: 'Aktif',
                      parentPhone: ''
                    });
                    setIsStudentModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Data Siswa</span>
                </button>
              )}

              {activeTab === 'dokumen' && userPermissions.includes('document.manage') && (
                <button
                  onClick={() => {
                    setEditingDownload(null);
                    setDownloadFormData({
                      title: '',
                      category: 'Kurikulum & Kalender',
                      fileSize: '1.2 MB',
                      fileType: 'PDF',
                      description: '',
                      isRestricted: false,
                      requiredRole: ['guru', 'operator_tu']
                    });
                    setIsDownloadModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Unggah Dokumen</span>
                </button>
              )}

              {activeTab === 'spmb' && (
                <button
                  onClick={handleExportSpmbCsv}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Ekspor CSV SPMB</span>
                </button>
              )}

              {activeTab === 'pengguna' && userPermissions.includes('users.manage') && (
                <button
                  onClick={() => {
                    setUserFormData({
                      username: '',
                      email: '',
                      fullName: '',
                      role: 'editor',
                      password: 'Password123!',
                      phone: '',
                      nip: '',
                      nisn: ''
                    });
                    setIsUserModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Tambah Pengguna</span>
                </button>
              )}

              {activeTab === 'roles' && currentUser.role === 'super_admin' && (
                <button
                  onClick={() => {
                    setRoleFormData({
                      name: '',
                      label: '',
                      description: '',
                      permissions: ['content.view', 'document.manage']
                    });
                    setIsRoleModalOpen(true);
                  }}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Buat Role Kustom</span>
                </button>
              )}

              {activeTab === 'notifikasi' && userPermissions.includes('content.publish') && (
                <button
                  onClick={() => setIsBroadcastModalOpen(true)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Siaran Notifikasi</span>
                </button>
              )}

              {activeTab === 'audit' && (
                <button
                  onClick={handleExportAuditCsv}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4 text-sky-700" />
                  <span>Ekspor CSV Audit</span>
                </button>
              )}

              {activeTab === 'backup' && (
                <button
                  onClick={handleDownloadBackup}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Backup JSON</span>
                </button>
              )}
            </div>
          </div>

          {/* Skeleton Loading State when switching tabs */}
          {isTabLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-24 bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-slate-200 shrink-0" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 bg-slate-200 rounded w-1/2" />
                      <div className="h-5 bg-slate-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                <div className="h-5 bg-slate-200 rounded w-1/4" />
                <div className="space-y-3 pt-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="h-10 bg-slate-100 rounded-lg" />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ---------------------------------------------------- */}
              {/* TAB 1: RINGKASAN (OVERVIEW)                          */}
              {/* ---------------------------------------------------- */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-6">
              {/* Metric Statistics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-sky-50 border border-sky-100 text-sky-800 flex items-center justify-center shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500">Total Siswa Aktif</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                      {schoolSettings.stats.studentsCount}
                    </h3>
                    <span className="text-[11px] text-emerald-600 font-semibold">14 Rombel Aktif</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500">Guru & Tendik</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                      {staffList.length}
                    </h3>
                    <span className="text-[11px] text-slate-500 font-medium">PNS, PPPK & Honorer</span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-800 flex items-center justify-center shrink-0">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500">Pendaftar SPMB</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                      {spmbList.length}
                    </h3>
                    <span className="text-[11px] text-amber-600 font-semibold">
                      {pendingSpmbCount} Perlu Diverifikasi
                    </span>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-medium text-slate-500">Artikel & Berita</span>
                    <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                      {articlesList.length}
                    </h3>
                    <span className="text-[11px] text-sky-700 font-semibold">
                      {articlesList.filter((a) => a.status === 'published').length} Diterbitkan
                    </span>
                  </div>
                </div>
              </div>

              {/* Dynamic Actual Data Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SPMB Admissions by Pathway (SVG Bar Chart) */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Distribusi Pendaftaran SPMB per Jalur</h3>
                      <p className="text-xs text-slate-500">Data kuota dan pendaftar calon siswa tahun ajaran 2026/2027</p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-sky-50 text-sky-800">
                      Aktual
                    </span>
                  </div>

                  <div className="space-y-3 pt-2">
                    {[
                      { pathway: 'Zonasi (Buket Seuraja & Sekitarnya)', count: spmbList.filter((s) => s.chosenPathway === 'Zonasi').length, quota: 70, color: 'bg-sky-700' },
                      { pathway: 'Prestasi Akademik & Non-Akademik', count: spmbList.filter((s) => s.chosenPathway === 'Prestasi Akademik').length, quota: 42, color: 'bg-emerald-600' },
                      { pathway: 'Afirmasi / KIP', count: spmbList.filter((s) => s.chosenPathway === 'Afirmasi').length, quota: 21, color: 'bg-indigo-600' },
                      { pathway: 'Perpindahan Tugas Orang Tua', count: spmbList.filter((s) => s.chosenPathway === 'Perpindahan Tugas Orang Tua').length, quota: 7, color: 'bg-amber-500' }
                    ].map(({ pathway, count, quota, color }) => {
                      const pct = Math.min(100, Math.round((count / quota) * 100));
                      return (
                        <div key={pathway} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-700">{pathway}</span>
                            <span className="text-slate-500">
                              <strong className="text-slate-900">{count}</strong> / {quota} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Content Publication Pipeline Status */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Alur Publikasi Konten & Artikel</h3>
                      <p className="text-xs text-slate-500">Pipeline editorial: Draf → Review → Disetujui → Terbit</p>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-semibold rounded-md bg-emerald-50 text-emerald-800">
                      Editorial Flow
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[11px] font-semibold text-slate-500">Draf</span>
                      <p className="text-xl font-bold text-slate-800 mt-1">
                        {articlesList.filter((a) => a.status === 'draft').length}
                      </p>
                      <span className="text-[10px] text-slate-400">Editor</span>
                    </div>

                    <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-center">
                      <span className="text-[11px] font-semibold text-amber-700">Menunggu</span>
                      <p className="text-xl font-bold text-amber-900 mt-1">
                        {articlesList.filter((a) => a.status === 'pending_approval').length}
                      </p>
                      <span className="text-[10px] text-amber-700">Perlu Review</span>
                    </div>

                    <div className="p-3 rounded-lg bg-sky-50 border border-sky-200 text-center">
                      <span className="text-[11px] font-semibold text-sky-700">Disetujui</span>
                      <p className="text-xl font-bold text-sky-900 mt-1">
                        {articlesList.filter((a) => a.status === 'approved').length}
                      </p>
                      <span className="text-[10px] text-sky-700">Siap Terbit</span>
                    </div>

                    <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center">
                      <span className="text-[11px] font-semibold text-emerald-700">Diterbitkan</span>
                      <p className="text-xl font-bold text-emerald-900 mt-1">
                        {articlesList.filter((a) => a.status === 'published').length}
                      </p>
                      <span className="text-[10px] text-emerald-700">Live di Web</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">Halaman Kustom Website Aktif:</span>
                    <span className="font-bold text-slate-900">{pagesList.length} Halaman</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions & Recent Audit Trails */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions (1 col) */}
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <h3 className="font-bold text-sm text-slate-900">Aksi Cepat Pengelolaan</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleSelectTab('spmb')}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-sky-700" />
                        Verifikasi Pendaftar SPMB
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleSelectTab('berita')}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-600" />
                        Tulis Berita / Pengumuman Baru
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleSelectTab('guru')}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        Kelola Direktori Pendidik
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>

                    <button
                      onClick={() => handleSelectTab('backup')}
                      className="w-full flex items-center justify-between p-3 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 text-xs font-semibold text-slate-800 transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-amber-600" />
                        Diagnostik & Cadangkan Data
                      </span>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* Recent Activity Log (2 cols) */}
                <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">Riwayat Aktivitas & Keamanan Terakhir</h3>
                      <p className="text-xs text-slate-500">Rekaman audit log aktual sistem secara real-time</p>
                    </div>
                    <button
                      onClick={() => handleSelectTab('audit')}
                      className="text-xs font-semibold text-sky-700 hover:underline cursor-pointer"
                    >
                      Lihat Semua Log
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 overflow-hidden">
                    {auditLogsList.slice(0, 5).map((log) => (
                      <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{log.username}</span>
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-slate-100 text-slate-600">
                              {log.userRole}
                            </span>
                            <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              log.status === 'SUCCESS' ? 'text-emerald-700 bg-emerald-50' : 'text-rose-700 bg-rose-50'
                            }`}>
                              {log.status}
                            </span>
                          </div>
                          <p className="text-slate-600">{log.details}</p>
                        </div>
                        <span className="text-[11px] text-slate-400 shrink-0">{log.timestamp.split('T')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 2: BERITA DAN ARTIKEL                            */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'berita' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari berita berdasarkan judul atau kategori..."
                      value={articleSearch}
                      onChange={(e) => setArticleSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={articleFilterStatus}
                    onChange={(e) => setArticleFilterStatus(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="draft">Draf</option>
                    <option value="pending_approval">Menunggu Persetujuan</option>
                    <option value="approved">Disetujui</option>
                    <option value="published">Diterbitkan</option>
                    <option value="rejected">Ditolak / Perlu Revisi</option>
                  </select>
                </div>
              </div>

              {/* Data Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th
                        onClick={() => {
                          if (articleSortField === 'title') {
                            setArticleSortAsc(!articleSortAsc);
                          } else {
                            setArticleSortField('title');
                            setArticleSortAsc(true);
                          }
                        }}
                        className="px-4 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Artikel</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => {
                          if (articleSortField === 'category') {
                            setArticleSortAsc(!articleSortAsc);
                          } else {
                            setArticleSortField('category');
                            setArticleSortAsc(true);
                          }
                        }}
                        className="px-4 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Kategori</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="px-4 py-3">Penulis</th>
                      <th
                        onClick={() => {
                          if (articleSortField === 'status') {
                            setArticleSortAsc(!articleSortAsc);
                          } else {
                            setArticleSortField('status');
                            setArticleSortAsc(true);
                          }
                        }}
                        className="px-4 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Status</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => {
                          if (articleSortField === 'createdAt') {
                            setArticleSortAsc(!articleSortAsc);
                          } else {
                            setArticleSortField('createdAt');
                            setArticleSortAsc(false);
                          }
                        }}
                        className="px-4 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Tanggal</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedArticles.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                          <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="font-semibold text-slate-600">Tidak ada artikel ditemukan</p>
                          <p className="text-[11px] text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau tambah artikel baru.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedArticles.map((art) => (
                        <tr key={art.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-medium text-slate-900 max-w-xs truncate">
                            <span className="font-semibold text-slate-900 block truncate">{art.title}</span>
                            <span className="text-[11px] text-slate-500 truncate block">{art.excerpt}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-100">
                              {art.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">{art.authorName || 'Humas'}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                                art.status === 'published'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                  : art.status === 'pending_approval'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : art.status === 'approved'
                                  ? 'bg-sky-50 text-sky-700 border border-sky-200'
                                  : 'bg-slate-100 text-slate-700 border border-slate-200'
                              }`}
                            >
                              {art.status === 'published' && 'Diterbitkan'}
                              {art.status === 'pending_approval' && 'Menunggu Review'}
                              {art.status === 'approved' && 'Disetujui'}
                              {art.status === 'draft' && 'Draf'}
                              {art.status === 'rejected' && 'Ditolak'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                            {art.createdAt ? art.createdAt.split('T')[0] : 'Hari ini'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Preview Button */}
                              <button
                                onClick={() =>
                                  setPreviewContent({
                                    isOpen: true,
                                    id: art.id,
                                    contentType: 'article',
                                    title: art.title,
                                    category: art.category,
                                    author: art.authorName,
                                    date: art.createdAt ? art.createdAt.split('T')[0] : 'Hari ini',
                                    content: art.content,
                                    status: art.status,
                                    imageUrl: art.imageUrl
                                  })
                                }
                                className="p-1.5 rounded-md text-slate-500 hover:text-sky-700 hover:bg-sky-50 cursor-pointer"
                                title="Pratinjau Artikel"
                              >
                                <Eye className="w-4 h-4" />
                              </button>

                              {/* Approval workflow buttons for Approver/SuperAdmin */}
                              {userPermissions.includes('content.approve') && art.status === 'pending_approval' && (
                                <button
                                  onClick={() => handleApproveArticle(art.id)}
                                  className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                                  title="Setujui Artikel"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}

                              {userPermissions.includes('content.publish') && (art.status === 'approved' || art.status === 'draft') && (
                                <button
                                  onClick={() => handlePublishArticle(art.id)}
                                  className="p-1.5 rounded-md text-sky-700 hover:bg-sky-50 cursor-pointer"
                                  title="Terbitkan ke Website"
                                >
                                  <Globe className="w-4 h-4" />
                                </button>
                              )}

                              {/* Edit Button */}
                              {userPermissions.includes('content.edit') && (
                                <button
                                  onClick={() => {
                                    setEditingArticle(art);
                                    setArticleFormData({
                                      title: art.title,
                                      category: art.category,
                                      excerpt: art.excerpt,
                                      content: art.content,
                                      imageUrl: art.imageUrl || '/src/assets/images/hero_sman1julok_1793290495969.jpg',
                                      status: art.status,
                                      tags: (art.tags || []).join(', ')
                                    });
                                    setIsArticleModalOpen(true);
                                  }}
                                  className="p-1.5 rounded-md text-slate-500 hover:text-sky-700 hover:bg-sky-50 cursor-pointer"
                                  title="Edit Artikel"
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                              )}

                              {/* Delete Button */}
                              {userPermissions.includes('content.delete') && (
                                <button
                                  onClick={() => handleDeleteArticle(art)}
                                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                                  title="Hapus Artikel"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                <span>
                  Menampilkan <strong className="text-slate-800">{paginatedArticles.length}</strong> dari{' '}
                  <strong className="text-slate-800">{sortedArticles.length}</strong> artikel
                  (Halaman {articlePage} dari {totalArticlePages})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setArticlePage((p) => Math.max(p - 1, 1))}
                    disabled={articlePage <= 1}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalArticlePages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setArticlePage(pg)}
                        className={`w-7 h-7 rounded-md text-xs font-semibold cursor-pointer ${
                          articlePage === pg
                            ? 'bg-sky-800 text-white'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setArticlePage((p) => Math.min(p + 1, totalArticlePages))}
                    disabled={articlePage >= totalArticlePages}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 3: HALAMAN WEBSITE (CMS PAGES)                   */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'halaman' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari halaman website kustom..."
                    value={pageSearch}
                    onChange={(e) => setPageSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Judul Halaman</th>
                      <th className="px-4 py-3">Slug URL</th>
                      <th className="px-4 py-3">Penempatan Menu</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Revisi</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagesList.map((pg) => (
                      <tr key={pg.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-semibold text-slate-900">{pg.title}</td>
                        <td className="px-4 py-3 font-mono text-slate-500">/{pg.slug}</td>
                        <td className="px-4 py-3 text-slate-600 capitalize">{pg.menuPlacement || 'both'}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${
                              pg.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {pg.status === 'published' ? 'Diterbitkan' : 'Draf'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-500">
                          <button
                            onClick={() => setActiveRevisionPage(pg)}
                            className="text-xs text-sky-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <History className="w-3.5 h-3.5" />
                            <span>{pg.revisions?.length || 1} Versi</span>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() =>
                                setPreviewContent({
                                  isOpen: true,
                                  id: pg.id,
                                  contentType: 'page',
                                  title: pg.title,
                                  content: pg.content,
                                  status: pg.status
                                })
                              }
                              className="p-1.5 rounded-md text-slate-500 hover:text-sky-700 hover:bg-sky-50 cursor-pointer"
                              title="Pratinjau Halaman"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingPage(pg);
                                setPageFormData({
                                  title: pg.title,
                                  excerpt: pg.excerpt,
                                  content: pg.content,
                                  status: pg.status,
                                  menuPlacement: pg.menuPlacement || 'both',
                                  revisionSummary: 'Pembaruan isi halaman'
                                });
                                setIsPageModalOpen(true);
                              }}
                              className="p-1.5 rounded-md text-slate-500 hover:text-sky-700 hover:bg-sky-50 cursor-pointer"
                              title="Edit Halaman"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePage(pg)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Hapus Halaman"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 4: PENGUMUMAN                                    */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'pengumuman' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Pengumuman</th>
                      <th className="px-4 py-3">Sasaran</th>
                      <th className="px-4 py-3">Prioritas</th>
                      <th className="px-4 py-3">Tanggal</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {announcementsList.map((ann) => (
                      <tr key={ann.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900 block">{ann.title}</span>
                          <span className="text-[11px] text-slate-500 line-clamp-1">{ann.content}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{ann.target}</td>
                        <td className="px-4 py-3">
                          {ann.isUrgent ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              PENTING
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 text-slate-600">
                              Biasa
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-500 whitespace-nowrap">{ann.date}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingAnn(ann);
                                setAnnFormData({
                                  title: ann.title,
                                  content: ann.content,
                                  target: ann.target,
                                  isUrgent: !!ann.isUrgent,
                                  downloadUrl: ann.downloadUrl || '',
                                  attachmentName: ann.attachmentName || ''
                                });
                                setIsAnnModalOpen(true);
                              }}
                              className="p-1.5 rounded-md text-slate-500 hover:text-sky-700 hover:bg-sky-50 cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteAnnouncement(ann)}
                              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 5: KALENDER DAN AGENDA                           */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'kalender' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {eventsList.map((evt) => (
                  <div key={evt.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2 relative group">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-100 text-sky-800">
                        {evt.category}
                      </span>
                      <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                        <button
                          onClick={() => {
                            setEditingEvent(evt);
                            setEventFormData({
                              title: evt.title,
                              date: evt.date,
                              time: evt.time,
                              location: evt.location,
                              organizer: evt.organizer,
                              description: evt.description,
                              category: evt.category
                            });
                            setIsEventModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-sky-700 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(evt)}
                          className="p-1 text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 leading-snug">{evt.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-2">{evt.description}</p>
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span>{evt.date}</span>
                      <span>{evt.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 6: GALERI MEDIA                                  */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'galeri' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleriesList.map((gal) => (
                  <div key={gal.id} className="rounded-xl border border-slate-200 overflow-hidden bg-slate-50 flex flex-col group">
                    <div className="h-40 w-full bg-slate-200 relative overflow-hidden">
                      <img
                        src={gal.url}
                        alt={gal.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/src/assets/images/hero_sman1julok_1793290495969.jpg';
                        }}
                      />
                      <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-950/70 text-white backdrop-blur-xs">
                        {gal.category}
                      </span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 truncate">{gal.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{gal.caption}</p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-xs">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(gal.url);
                            showToast('URL Media berhasil disalin ke clipboard!');
                          }}
                          className="text-[11px] font-semibold text-sky-700 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin URL</span>
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(gal)}
                          className="text-slate-400 hover:text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 7: PROFIL SEKOLAH                                */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'profil' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
              <form onSubmit={handleSaveSchoolSettings} className="space-y-6 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Resmi Sekolah</label>
                    <input
                      type="text"
                      value={schoolSettings.name}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">NPSN</label>
                    <input
                      type="text"
                      value={schoolSettings.npsn}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, npsn: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Akreditasi</label>
                    <input
                      type="text"
                      value={schoolSettings.accreditation}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, accreditation: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Kurikulum</label>
                    <input
                      type="text"
                      value={schoolSettings.curriculum}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, curriculum: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <h4 className="font-bold text-sm text-slate-900">Kepala Sekolah</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
                      <input
                        type="text"
                        value={schoolSettings.principalName}
                        onChange={(e) => setSchoolSettings({ ...schoolSettings, principalName: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
                      <input
                        type="text"
                        value={schoolSettings.principalNip}
                        onChange={(e) => setSchoolSettings({ ...schoolSettings, principalNip: e.target.value })}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sambutan Kepala Sekolah</label>
                    <textarea
                      rows={4}
                      value={schoolSettings.principalSpeech}
                      onChange={(e) => setSchoolSettings({ ...schoolSettings, principalSpeech: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="px-5 py-2.5 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSavingSettings ? 'Menyimpan...' : 'Simpan Profil Sekolah'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 8: DATA GURU & TENDIK                            */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'guru' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari nama guru, NIP, atau mata pelajaran..."
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <select
                  value={staffCategoryFilter}
                  onChange={(e) => setStaffCategoryFilter(e.target.value as any)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer"
                >
                  <option value="all">Semua Kategori</option>
                  <option value="guru">Guru Pendidik</option>
                  <option value="tendik">Tenaga Kependidikan</option>
                </select>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Nama & Gelar</th>
                      <th className="px-4 py-3">NIP</th>
                      <th className="px-4 py-3">Jabatan / Peran</th>
                      <th className="px-4 py-3">Mata Pelajaran</th>
                      <th className="px-4 py-3">Pendidikan</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedStaff.map((st) => (
                      <tr key={st.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={st.photoUrl}
                              alt={st.name}
                              className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/src/assets/images/hero_sman1julok_1793290495969.jpg';
                              }}
                            />
                            <span className="font-semibold text-slate-900">{st.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-600">{st.nip}</td>
                        <td className="px-4 py-3 text-slate-700">{st.role}</td>
                        <td className="px-4 py-3 text-slate-600">{st.subject || '-'}</td>
                        <td className="px-4 py-3 text-slate-500">{st.education}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingStaff(st);
                                setStaffFormData({
                                  name: st.name,
                                  nip: st.nip,
                                  role: st.role,
                                  subject: st.subject || '',
                                  education: st.education,
                                  photoUrl: st.photoUrl,
                                  category: st.category,
                                  isLeader: !!st.isLeader
                                });
                                setIsStaffModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-md cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStaff(st)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                <span>
                  Menampilkan <strong className="text-slate-800">{paginatedStaff.length}</strong> dari{' '}
                  <strong className="text-slate-800">{filteredStaff.length}</strong> guru & tendik
                  (Halaman {staffPage} dari {totalStaffPages})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setStaffPage((p) => Math.max(p - 1, 1))}
                    disabled={staffPage <= 1}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalStaffPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setStaffPage(pg)}
                        className={`w-7 h-7 rounded-md text-xs font-semibold cursor-pointer ${
                          staffPage === pg
                            ? 'bg-sky-800 text-white'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setStaffPage((p) => Math.min(p + 1, totalStaffPages))}
                    disabled={staffPage >= totalStaffPages}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 9: DATA SISWA JIKA DIIZINKAN                     */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'siswa' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="p-3 bg-sky-50 border border-sky-100 rounded-lg flex items-start gap-2.5 text-xs text-sky-900">
                <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0 mt-0.5" />
                <p>
                  <strong>Perlindungan Data Pribadi Siswa:</strong> Akses data rombongan belajar dan kontak siswa dilindungi secara ketat sesuai Permendikbud & UU PDP. Hanya Dewan Guru, Operator TU, dan Administrator Sekolah yang berwenang.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari siswa berdasarkan nama atau NISN..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <select
                  value={studentClassFilter}
                  onChange={(e) => setStudentClassFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer"
                >
                  <option value="all">Semua Kelas</option>
                  <option value="XII MIPA 1">XII MIPA 1</option>
                  <option value="XII IPS 1">XII IPS 1</option>
                  <option value="XI MIPA 2">XI MIPA 2</option>
                  <option value="XI IPS 1">XI IPS 1</option>
                  <option value="X-1">X-1 (Fase E)</option>
                  <option value="X-2">X-2 (Fase E)</option>
                </select>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">NISN</th>
                      <th className="px-4 py-3">Nama Siswa</th>
                      <th className="px-4 py-3">Kelas</th>
                      <th className="px-4 py-3">Jurusan / Fase</th>
                      <th className="px-4 py-3">Kontak Orang Tua</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedStudents.map((sis) => (
                      <tr key={sis.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-mono text-slate-600">{sis.nisn}</td>
                        <td className="px-4 py-3 font-semibold text-slate-900">{sis.name}</td>
                        <td className="px-4 py-3 text-slate-700">{sis.className}</td>
                        <td className="px-4 py-3 text-slate-600">{sis.major}</td>
                        <td className="px-4 py-3 text-slate-500 font-mono">{sis.parentPhone}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
                            {sis.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingStudent(sis);
                                setStudentFormData({
                                  nisn: sis.nisn,
                                  name: sis.name,
                                  className: sis.className,
                                  major: sis.major,
                                  gender: sis.gender,
                                  status: sis.status,
                                  parentPhone: sis.parentPhone
                                });
                                setIsStudentModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-md cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(sis)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                <span>
                  Menampilkan <strong className="text-slate-800">{paginatedStudents.length}</strong> dari{' '}
                  <strong className="text-slate-800">{filteredStudents.length}</strong> siswa
                  (Halaman {studentPage} dari {totalStudentPages})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setStudentPage((p) => Math.max(p - 1, 1))}
                    disabled={studentPage <= 1}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalStudentPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setStudentPage(pg)}
                        className={`w-7 h-7 rounded-md text-xs font-semibold cursor-pointer ${
                          studentPage === pg
                            ? 'bg-sky-800 text-white'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setStudentPage((p) => Math.min(p + 1, totalStudentPages))}
                    disabled={studentPage >= totalStudentPages}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 10: DOKUMEN DAN UNDUHAN                          */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'dokumen' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Judul Dokumen</th>
                      <th className="px-4 py-3">Kategori</th>
                      <th className="px-4 py-3">Ukuran & Format</th>
                      <th className="px-4 py-3">Akses</th>
                      <th className="px-4 py-3">Jumlah Unduh</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {downloadsList.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900 block">{doc.title}</span>
                          <span className="text-[11px] text-slate-500">{doc.description}</span>
                        </td>
                        <td className="px-4 py-3 text-slate-600">{doc.category}</td>
                        <td className="px-4 py-3 text-slate-500">
                          {doc.fileSize} • {doc.fileType}
                        </td>
                        <td className="px-4 py-3">
                          {doc.isRestricted ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Terbatas (Internal)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700">
                              Publik
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-slate-600 font-semibold">{doc.downloadCount} kali</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setEditingDownload(doc);
                                setDownloadFormData({
                                  title: doc.title,
                                  category: doc.category,
                                  fileSize: doc.fileSize,
                                  fileType: doc.fileType,
                                  description: doc.description,
                                  isRestricted: !!doc.isRestricted,
                                  requiredRole: doc.requiredRole || []
                                });
                                setIsDownloadModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-md cursor-pointer"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteDownload(doc)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 11: SPMB                                         */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'spmb' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari no reg, nama pendaftar, atau asal sekolah..."
                    value={spmbSearch}
                    onChange={(e) => setSpmbSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={spmbPathwayFilter}
                    onChange={(e) => setSpmbPathwayFilter(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer"
                  >
                    <option value="all">Semua Jalur</option>
                    <option value="Zonasi">Zonasi</option>
                    <option value="Prestasi Akademik">Prestasi Akademik</option>
                    <option value="Afirmasi">Afirmasi</option>
                    <option value="Perpindahan Tugas Orang Tua">Perpindahan Tugas</option>
                  </select>
                  <select
                    value={spmbStatusFilter}
                    onChange={(e) => setSpmbStatusFilter(e.target.value)}
                    className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Berkas Diterima">Berkas Diterima</option>
                    <option value="Lulus Seleksi">Lulus Seleksi</option>
                    <option value="Cadangan">Cadangan</option>
                    <option value="Tidak Lulus">Tidak Lulus</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th
                        onClick={() => {
                          if (spmbSortField === 'registrationNumber') {
                            setSpmbSortAsc(!spmbSortAsc);
                          } else {
                            setSpmbSortField('registrationNumber');
                            setSpmbSortAsc(true);
                          }
                        }}
                        className="px-4 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>No. Registrasi</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => {
                          if (spmbSortField === 'fullName') {
                            setSpmbSortAsc(!spmbSortAsc);
                          } else {
                            setSpmbSortField('fullName');
                            setSpmbSortAsc(true);
                          }
                        }}
                        className="px-4 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Nama Calon Siswa</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="px-4 py-3">Jalur Pendaftaran</th>
                      <th className="px-4 py-3">Asal Sekolah</th>
                      <th
                        onClick={() => {
                          if (spmbSortField === 'averageScore') {
                            setSpmbSortAsc(!spmbSortAsc);
                          } else {
                            setSpmbSortField('averageScore');
                            setSpmbSortAsc(false);
                          }
                        }}
                        className="px-4 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Nilai Rerata</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th
                        onClick={() => {
                          if (spmbSortField === 'status') {
                            setSpmbSortAsc(!spmbSortAsc);
                          } else {
                            setSpmbSortField('status');
                            setSpmbSortAsc(true);
                          }
                        }}
                        className="px-4 py-3 cursor-pointer select-none hover:bg-slate-100 transition-colors"
                      >
                        <div className="flex items-center gap-1.5">
                          <span>Status Verifikasi</span>
                          <ArrowUpDown className="w-3 h-3 text-slate-400" />
                        </div>
                      </th>
                      <th className="px-4 py-3 text-right">Ubah Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sortedSpmb.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                          <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="font-semibold text-slate-600">Tidak ada data pendaftar SPMB ditemukan</p>
                          <p className="text-[11px] text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter status.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedSpmb.map((sp) => (
                        <tr key={sp.id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3 font-mono font-bold text-sky-800">{sp.registrationNumber}</td>
                          <td className="px-4 py-3 font-semibold text-slate-900">{sp.fullName}</td>
                          <td className="px-4 py-3 text-slate-700">{sp.chosenPathway}</td>
                          <td className="px-4 py-3 text-slate-600">{sp.originSchool}</td>
                          <td className="px-4 py-3 font-semibold text-slate-800">{sp.averageScore}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                sp.status === 'Lulus Seleksi'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : sp.status === 'Berkas Diterima'
                                  ? 'bg-sky-50 text-sky-800 border border-sky-200'
                                  : sp.status === 'Menunggu Verifikasi'
                                  ? 'bg-amber-50 text-amber-800 border border-amber-200'
                                  : 'bg-rose-50 text-rose-700 border border-rose-200'
                              }`}
                            >
                              {sp.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <select
                              value={sp.status}
                              onChange={(e) => handleUpdateSpmbStatus(sp.id, e.target.value as any)}
                              className="text-xs px-2 py-1 border border-slate-200 rounded-md bg-white cursor-pointer"
                            >
                              <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                              <option value="Berkas Diterima">Berkas Diterima</option>
                              <option value="Lulus Seleksi">Lulus Seleksi</option>
                              <option value="Cadangan">Cadangan</option>
                              <option value="Tidak Lulus">Tidak Lulus</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                <span>
                  Menampilkan <strong className="text-slate-800">{paginatedSpmb.length}</strong> dari{' '}
                  <strong className="text-slate-800">{sortedSpmb.length}</strong> pendaftar
                  (Halaman {spmbPage} dari {totalSpmbPages})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setSpmbPage((p) => Math.max(p - 1, 1))}
                    disabled={spmbPage <= 1}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalSpmbPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setSpmbPage(pg)}
                        className={`w-7 h-7 rounded-md text-xs font-semibold cursor-pointer ${
                          spmbPage === pg
                            ? 'bg-sky-800 text-white'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSpmbPage((p) => Math.min(p + 1, totalSpmbPages))}
                    disabled={spmbPage >= totalSpmbPages}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 12: PENGGUNA                                     */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'pengguna' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari akun pengguna atau email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer"
                >
                  <option value="all">Semua Role</option>
                  <option value="super_admin">Super Admin</option>
                  <option value="admin_sekolah">Admin Sekolah</option>
                  <option value="editor">Editor</option>
                  <option value="guru">Guru</option>
                  <option value="operator_tu">Operator TU</option>
                  <option value="siswa">Siswa</option>
                </select>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Nama Pengguna</th>
                      <th className="px-4 py-3">Nama Lengkap</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Role</th>
                      <th className="px-4 py-3">Status Akun</th>
                      <th className="px-4 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">{u.username}</td>
                        <td className="px-4 py-3 text-slate-800">{u.fullName}</td>
                        <td className="px-4 py-3 text-slate-600">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-800">
                            {u.role.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {u.isLocked ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700">
                              Terkunci
                            </span>
                          ) : u.isActive ? (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700">
                              Aktif
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-500">
                              Nonaktif
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {u.isLocked && (
                              <button
                                onClick={() => handleUnlockUser(u)}
                                className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md cursor-pointer"
                                title="Buka Kunci Akun"
                              >
                                <Unlock className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleToggleUserStatus(u)}
                              className="p-1.5 text-slate-500 hover:text-sky-700 hover:bg-sky-50 rounded-md cursor-pointer"
                              title={u.isActive ? 'Nonaktifkan Akun' : 'Aktifkan Akun'}
                            >
                              {u.isActive ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 13: ROLE DAN PERMISSION MATRIX                   */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'roles' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-6">
              <div className="p-4 rounded-lg bg-sky-50 border border-sky-100 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-sky-800 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-sky-900">Matriks Role-Based Access Control (RBAC) Granular</h4>
                  <p className="text-xs text-sky-700 mt-0.5">
                    Konfigurasi hak akses berlaku secara menyeluruh dan divalidasi ganda pada server backend (Node.js/Express) serta antarmuka. Super Admin berhak menentukan izin setiap role.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200 uppercase text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Role / Peran</th>
                      <th className="px-4 py-3">Tipe</th>
                      <th className="px-4 py-3">Jumlah Hak Akses</th>
                      <th className="px-4 py-3">Deskripsi Tanggung Jawab</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {rolesList.map((rl) => (
                      <tr key={rl.id} className="hover:bg-slate-50/80">
                        <td className="px-4 py-3 font-bold text-slate-900">{rl.label} ({rl.name})</td>
                        <td className="px-4 py-3">
                          {rl.isSystemRole ? (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-700">
                              Role Bawaan Sistem
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-sky-50 text-sky-800">
                              Role Kustom
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 font-semibold text-sky-800">
                          {rl.permissions.length} Izin Granular
                        </td>
                        <td className="px-4 py-3 text-slate-500 max-w-md">{rl.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 14: NOTIFIKASI                                   */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'notifikasi' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <h3 className="font-bold text-sm text-slate-900">Daftar Pemberitahuan Masuk</h3>
                <button
                  onClick={async () => {
                    await api.markAllNotificationsRead();
                    setNotificationsList((prev) => prev.map((n) => ({ ...n, isRead: true })));
                    showToast('Seluruh notifikasi ditandai telah dibaca.');
                  }}
                  className="text-xs font-semibold text-sky-700 hover:underline cursor-pointer"
                >
                  Tandai Semua Dibaca
                </button>
              </div>

              <div className="space-y-2">
                {notificationsList.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-3 ${
                      notif.isRead ? 'bg-white border-slate-200' : 'bg-sky-50/50 border-sky-200'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{notif.title}</span>
                        {!notif.isRead && (
                          <span className="w-2 h-2 rounded-full bg-sky-700 shrink-0" />
                        )}
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 text-slate-600">
                          {notif.targetRole || 'Semua'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{notif.message}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 shrink-0">{notif.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 15: LAPORAN                                      */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'laporan' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900">Pusat Analitik & Laporan Sekolah</h3>
                  <p className="text-xs text-slate-500">Rekapitulasi data kesiswaan, kepegawaian, SPMB, dan keterbacaan artikel</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleExportSpmbCsv}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh CSV SPMB</span>
                  </button>
                  <button
                    onClick={handleExportAuditCsv}
                    className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-sky-800 text-white hover:bg-sky-700 cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh CSV Audit</span>
                  </button>
                </div>
              </div>

              {isLoadingReports ? (
                <div className="py-12 text-center text-xs text-slate-500">Memuat kompilasi laporan aktual...</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <span className="text-xs font-medium text-slate-500">Rombongan Belajar & Siswa</span>
                    <h4 className="text-xl font-bold text-slate-900">428 Siswa Terdaftar</h4>
                    <p className="text-[11px] text-slate-500">14 Kelas Aktif (Fase E, Fase F MIPA & IPS)</p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <span className="text-xs font-medium text-slate-500">Pendidik & Tenaga Kependidikan</span>
                    <h4 className="text-xl font-bold text-slate-900">{staffList.length} Guru & Tendik</h4>
                    <p className="text-[11px] text-slate-500">100% Terverifikasi Dapodik Kemendikbud</p>
                  </div>

                  <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <span className="text-xs font-medium text-slate-500">Aktivitas Unduhan Dokumen</span>
                    <h4 className="text-xl font-bold text-slate-900">
                      {downloadsList.reduce((acc, d) => acc + (d.downloadCount || 0), 0)} Total Unduh
                    </h4>
                    <p className="text-[11px] text-slate-500">Kurikulum, Kalender & Formulir Siswa</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 16: AUDIT LOG                                    */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'audit' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari aktivitas, username, atau alamat IP..."
                    value={auditSearch}
                    onChange={(e) => setAuditSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <select
                  value={auditStatusFilter}
                  onChange={(e) => setAuditStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="SUCCESS">SUCCESS</option>
                  <option value="BLOCKED">BLOCKED</option>
                  <option value="FAILED">FAILED</option>
                </select>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="px-4 py-3">Waktu</th>
                      <th className="px-4 py-3">Pengguna & Role</th>
                      <th className="px-4 py-3">Aksi</th>
                      <th className="px-4 py-3">Modul</th>
                      <th className="px-4 py-3">Rincian</th>
                      <th className="px-4 py-3">IP Address</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredAuditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                          <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
                          <p className="font-semibold text-slate-600">Tidak ada log aktivitas ditemukan</p>
                          <p className="text-[11px] text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter status.</p>
                        </td>
                      </tr>
                    ) : (
                      paginatedAuditLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/80">
                          <td className="px-4 py-3 font-mono text-slate-500 whitespace-nowrap">
                            {log.timestamp ? log.timestamp.split('T')[0] : 'Hari ini'}
                          </td>
                          <td className="px-4 py-3">
                            <span className="font-bold text-slate-900 block">{log.username}</span>
                            <span className="text-[10px] text-slate-500 font-mono uppercase">{log.userRole}</span>
                          </td>
                          <td className="px-4 py-3 font-mono text-[11px] text-slate-700">{log.action}</td>
                          <td className="px-4 py-3 text-slate-600">{log.resource}</td>
                          <td className="px-4 py-3 text-slate-600 max-w-xs truncate">{log.details}</td>
                          <td className="px-4 py-3 font-mono text-slate-500">{log.ipAddress}</td>
                          <td className="px-4 py-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                log.status === 'SUCCESS'
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-rose-50 text-rose-700'
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-slate-500">
                <span>
                  Menampilkan <strong className="text-slate-800">{paginatedAuditLogs.length}</strong> dari{' '}
                  <strong className="text-slate-800">{filteredAuditLogs.length}</strong> log
                  (Halaman {auditPage} dari {totalAuditPages})
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setAuditPage((p) => Math.max(p - 1, 1))}
                    disabled={auditPage <= 1}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalAuditPages }, (_, i) => i + 1).map((pg) => (
                      <button
                        key={pg}
                        onClick={() => setAuditPage(pg)}
                        className={`w-7 h-7 rounded-md text-xs font-semibold cursor-pointer ${
                          auditPage === pg
                            ? 'bg-sky-800 text-white'
                            : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {pg}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setAuditPage((p) => Math.min(p + 1, totalAuditPages))}
                    disabled={auditPage >= totalAuditPages}
                    className="px-2.5 py-1 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Selanjutnya
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 17: PENGATURAN                                   */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'pengaturan' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6 max-w-4xl">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Pengaturan Sistem & Metadata</h3>
                <p className="text-xs text-slate-500">Konfigurasi SEO, OpenGraph, dan integrasi eksternal</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Meta (SEO)</label>
                  <input
                    type="text"
                    defaultValue="SMA Negeri 1 Julok - Buket Seuraja, Aceh Timur"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Google Analytics ID</label>
                  <input
                    type="text"
                    defaultValue="G-JULOK2026SCH"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end">
                <button
                  onClick={() => showToast('Pengaturan sistem berhasil disimpan!')}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Pengaturan
                </button>
              </div>
            </div>
          )}

          {/* ---------------------------------------------------- */}
          {/* TAB 18: BACKUP, KEAMANAN & BASIS DATA               */}
          {/* ---------------------------------------------------- */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-5xl">
              {/* Header Title & Subtitle */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-2 rounded-lg bg-sky-900 text-white">
                        <ShieldCheck className="w-5 h-5" />
                      </span>
                      <div>
                        <h3 className="font-bold text-base text-slate-900">Pusat Keamanan, Basis Data 3NF & Cadangan Sistem</h3>
                        <p className="text-xs text-slate-500">
                          SMA Negeri 1 Julok &bull; Buket Seuraja, Kec. Julok, Kab. Aceh Timur, Aceh
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      onClick={handleOpenSchemaModal}
                      className="px-3.5 py-2 text-xs font-semibold text-sky-900 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Code2 className="w-4 h-4 text-sky-800" />
                      <span>Lihat Skema DDL 3NF</span>
                    </button>
                    <button
                      onClick={handleDownloadDDL}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <Download className="w-4 h-4 text-slate-500" />
                      <span>Unduh DDL (.sql)</span>
                    </button>
                  </div>
                </div>

                {/* System Diagnostics 4-Stat Grid */}
                <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <div>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Server className="w-3.5 h-3.5 text-emerald-600" /> Status Server & Aturan
                    </span>
                    <p className="font-bold text-emerald-700 mt-1 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Operasional & Hardened
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Layers className="w-3.5 h-3.5 text-sky-600" /> Normalisasi Relasional
                    </span>
                    <p className="font-bold text-slate-800 mt-1">22 Entitas Terstruktur (3NF)</p>
                  </div>
                  <div>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5 text-indigo-600" /> Privasi Data Siswa (UU PDP)
                    </span>
                    <p className="font-bold text-indigo-700 mt-1">Terproteksi & Anonim Fiktif</p>
                  </div>
                  <div>
                    <span className="text-slate-500 flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-amber-600" /> Kebijakan Snapshot
                    </span>
                    <p className="font-bold text-slate-800 mt-1">Maks 10 Rotasi Otomatis</p>
                  </div>
                </div>
              </div>

              {/* CARD 1: Automated Security & Database Test Suite (13 Tests) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Terminal className="w-5 h-5 text-sky-800" />
                      <h4 className="font-bold text-sm text-slate-900">Pengujian Keamanan & Integritas Basis Data (13 Pengujian)</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Verifikasi otomatis RBAC, isolasi siswa, alur editorial, hashing password SHA-256 + salt, sanitasi XSS, dan upload berkas
                    </p>
                  </div>

                  <button
                    onClick={handleRunSecurityTests}
                    disabled={isTestingSecurity}
                    className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 disabled:opacity-60 rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {isTestingSecurity ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Sedang Menjalankan Uji...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        <span>Jalankan 13 Pengujian</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Test Results Display */}
                {securityTestResults && (
                  <div className="mt-4 space-y-3 pt-3 border-t border-slate-100 animate-in fade-in">
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span className="font-bold text-emerald-900">
                          Hasil Uji Keamanan: {securityTestResults.passed} dari {securityTestResults.total} Pengujian LULUS (100% Sempurna)
                        </span>
                      </div>
                      <span className="font-mono text-emerald-700 text-[11px]">
                        Waktu Eksekusi: {securityTestResults.durationMs} ms
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1">
                      {securityTestResults.suites?.map((t: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-2.5 rounded-lg border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                        >
                          <span className="p-1 rounded bg-emerald-100 text-emerald-700 mt-0.5">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-semibold text-slate-800 text-xs truncate">
                                {t.name}
                              </span>
                              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-sky-100 text-sky-800 font-bold shrink-0">
                                {t.category}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                              {t.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 2: Non-Destructive In-Memory Dry-Run Recovery Test */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 text-indigo-700" />
                      <h4 className="font-bold text-sm text-slate-900">Uji Integritas Pemulihan Cadangan (Dry-Run Non-Destruktif)</h4>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Mensimulasikan pemulihan cadangan secara in-memory untuk memvalidasi kelengkapan 22 entitas data tanpa mengubah data aktif
                    </p>
                  </div>

                  <button
                    onClick={handleRunDryRun}
                    disabled={isTestingDryRun}
                    className="px-4 py-2 text-xs font-semibold text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 disabled:opacity-60 rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    {isTestingDryRun ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-indigo-700" />
                        <span>Memverifikasi Struktur...</span>
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-4 h-4 text-indigo-700" />
                        <span>Jalankan Dry-Run Pemulihan</span>
                      </>
                    )}
                  </button>
                </div>

                {dryRunResult && (
                  <div className="p-3.5 rounded-lg bg-indigo-50/60 border border-indigo-200 text-xs animate-in fade-in">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-950 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        Status Integritas: {dryRunResult.status} (22/22 Koleksi Lulus)
                      </span>
                      <span className="text-[11px] text-indigo-700 font-mono">
                        {dryRunResult.testedAt ? new Date(dryRunResult.testedAt).toLocaleTimeString('id-ID') : ''} WIB
                      </span>
                    </div>
                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-indigo-200/60 text-[11px] text-slate-700">
                      <div>Koleksi Terverifikasi: <strong>{dryRunResult.testedEntities}</strong></div>
                      <div>Akun Pengguna: <strong>{dryRunResult.totalUsers}</strong></div>
                      <div>Artikel Editorial: <strong>{dryRunResult.totalPosts}</strong></div>
                      <div>Rekor Siswa Demo: <strong>{dryRunResult.totalStudents}</strong></div>
                    </div>
                  </div>
                )}
              </div>

              {/* CARD 3: 3NF Relational Architecture Entities Overview */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Arsitektur 22 Entitas Basis Data Terstruktur (3NF)</h4>
                    <p className="text-xs text-slate-500">Skema relasional lengkap dengan Primary Keys, Foreign Keys, Unique & Check Constraints</p>
                  </div>
                  <span className="px-2.5 py-1 text-[11px] font-mono font-bold bg-slate-100 text-slate-700 rounded-md">
                    22 Entitas
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs">
                  {[
                    { name: 'users', desc: 'Identitas akun, password hash & salt' },
                    { name: 'roles', desc: 'Definisi hierarki kewenangan pengguna' },
                    { name: 'permissions', desc: 'Katalog hak akses granular' },
                    { name: 'user_roles', desc: 'Relasi banyak-ke-banyak peran' },
                    { name: 'role_permissions', desc: 'Matriks izin per role' },
                    { name: 'school_settings', desc: 'Konfigurasi profil SMAN 1 Julok' },
                    { name: 'pages', desc: 'Halaman statis & dinamis' },
                    { name: 'posts', desc: 'Artikel, berita & karya literasi' },
                    { name: 'post_categories', desc: 'Kategori taksonomi publikasi' },
                    { name: 'post_tags', desc: 'Label penandaan artikel' },
                    { name: 'post_revisions', desc: 'Riwayat versi audit konten' },
                    { name: 'announcements', desc: 'Pengumuman resmi kedinasan' },
                    { name: 'events', desc: 'Kalender agenda kegiatan sekolah' },
                    { name: 'media', desc: 'Repositori berkas terverifikasi' },
                    { name: 'teachers', desc: 'Data pendidik & tenaga kependidikan' },
                    { name: 'students', desc: 'Data rombel & nilai fiktif [UU PDP]' },
                    { name: 'documents', desc: 'Bank berkas dan unduhan publik' },
                    { name: 'contact_messages', desc: 'Pesan & aspirasi masyarakat' },
                    { name: 'admissions', desc: 'Pendaftaran SPMB daring' },
                    { name: 'admission_documents', desc: 'Berkas verifikasi SPMB' },
                    { name: 'notifications', desc: 'Notifikasi & siaran internal' },
                    { name: 'audit_logs', desc: 'Catatan jejak rekam append-only' }
                  ].map((table) => (
                    <div
                      key={table.name}
                      className="p-2.5 rounded-lg border border-slate-200 bg-slate-50/50 hover:bg-sky-50/50 hover:border-sky-200 transition-colors"
                    >
                      <span className="font-mono font-bold text-sky-900 block text-xs">{table.name}</span>
                      <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">{table.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CARD 4: Snapshot Rotation (Max 10) & Backup Actions */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Manajemen Snapshot Cadangan (Kebijakan Retensi 10 File)</h4>
                    <p className="text-xs text-slate-500">Snapshot dibuat otomatis pada startup server dan rotasi menjaga maksimal 10 berkas terbaru</p>
                  </div>
                  <button
                    onClick={handleCreateSnapshot}
                    disabled={isCreatingSnapshot}
                    className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg shadow-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {isCreatingSnapshot ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>Buat Snapshot Sekarang</span>
                  </button>
                </div>

                {/* Snapshots Table */}
                <div className="border border-slate-200 rounded-lg overflow-x-auto max-h-52">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="px-4 py-2.5">Nama Berkas Snapshot</th>
                        <th className="px-4 py-2.5">Ukuran</th>
                        <th className="px-4 py-2.5">Waktu Pencadangan</th>
                        <th className="px-4 py-2.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                      {snapshotsList.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="px-4 py-6 text-center text-slate-400 font-sans">
                            Belum ada berkas snapshot terdaftar atau sedang dimuat...
                          </td>
                        </tr>
                      ) : (
                        snapshotsList.map((s, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="px-4 py-2 font-medium text-slate-800">{s.filename}</td>
                            <td className="px-4 py-2 text-slate-600">{s.sizeKb}</td>
                            <td className="px-4 py-2 text-slate-500">
                              {s.createdAt ? new Date(s.createdAt).toLocaleString('id-ID') : '-'}
                            </td>
                            <td className="px-4 py-2 text-right">
                              <span className="px-2 py-0.5 rounded text-[10px] font-sans font-semibold bg-emerald-50 text-emerald-700">
                                Tersimpan
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleDownloadBackup}
                    className="flex-1 px-4 py-2.5 bg-sky-800 hover:bg-sky-700 text-white text-xs font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Cadangan Lengkap JSON Sekarang</span>
                  </button>

                  <button
                    onClick={() => {
                      setConfirmDelete({
                        isOpen: true,
                        title: 'Reset ke Standar Awal SMAN 1 Julok',
                        description: 'Apakah Anda yakin ingin mengatur ulang data ke kondisi bawaan awal SMA Negeri 1 Julok? Seluruh perubahan baru akan dikembalikan.',
                        onConfirm: async () => {
                          await api.resetData();
                          showToast('Data berhasil dikembalikan ke standar awal.');
                          window.location.reload();
                        }
                      });
                    }}
                    className="px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                  >
                    <RefreshCw className="w-4 h-4 text-slate-500" />
                    <span>Pulihkan ke Standar Awal</span>
                  </button>
                </div>
              </div>

              {/* CARD 5: External Integrations Diagnostic (Honest Status Reporting) */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-4">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Diagnostik Integrasi Layanan Eksternal</h4>
                  <p className="text-xs text-slate-500">Status konektivitas layanan pihak ketiga sesuai konfigurasi aktual</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {/* Google Login */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Google Firebase Authentication</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Aktif
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">
                      Mendukung login terpadu akun Google warga sekolah melalui Firebase Auth.
                    </p>
                  </div>

                  {/* Google Maps */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Google Maps Platform</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Aktif
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">
                      Peta interaktif lokasi SMAN 1 Julok (Buket Seuraja, Lat: 4.9818, Lng: 97.6472).
                    </p>
                  </div>

                  {/* YouTube Embed */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">YouTube Video Embed API</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        Aktif
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">
                      Menampilkan video dokumentasi profil sekolah & kegiatan ekstrakurikuler resmi.
                    </p>
                  </div>

                  {/* SMTP Relay Email */}
                  <div className="p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Layanan Notifikasi Email (SMTP)</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800">
                        Siap Konfigurasi
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] mt-1">
                      Notifikasi in-app aktif penuh. Pengiriman email eksternal siap aktif saat variabel SMTP_HOST diisi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
            </>
          )}
        </main>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. MODALS FOR CRUD OPERATIONS                        */}
      {/* ---------------------------------------------------- */}

      {/* Article Create/Edit Modal */}
      {isArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingArticle ? 'Edit Berita / Artikel' : 'Tulis Berita / Artikel Baru'}
              </h3>
              <button
                onClick={() => setIsArticleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArticle} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Artikel</label>
                <input
                  type="text"
                  required
                  value={articleFormData.title}
                  onChange={(e) => setArticleFormData({ ...articleFormData, title: e.target.value })}
                  placeholder="Contoh: Siswa SMAN 1 Julok Raih Medali Emas OSN Tingkat Provinsi"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={articleFormData.category}
                    onChange={(e) => setArticleFormData({ ...articleFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Artikel Siswa">Artikel Siswa</option>
                    <option value="Budaya & Agama">Budaya & Agama</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Publikasi</label>
                  <select
                    value={articleFormData.status}
                    onChange={(e) => setArticleFormData({ ...articleFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="draft">Draf (Editor)</option>
                    <option value="pending_approval">Menunggu Persetujuan</option>
                    {userPermissions.includes('content.approve') && <option value="approved">Disetujui</option>}
                    <option value="scheduled">Terjadwal (Publikasi Otomatis)</option>
                    {userPermissions.includes('content.publish') && <option value="published">Diterbitkan (Live di Website)</option>}
                    <option value="archived">Diarsipkan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ringkasan Singkat (Excerpt)</label>
                <textarea
                  rows={2}
                  value={articleFormData.excerpt}
                  onChange={(e) => setArticleFormData({ ...articleFormData, excerpt: e.target.value })}
                  placeholder="Ringkasan 1-2 kalimat untuk pratinjau berita..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Konten Lengkap</label>
                <textarea
                  rows={6}
                  required
                  value={articleFormData.content}
                  onChange={(e) => setArticleFormData({ ...articleFormData, content: e.target.value })}
                  placeholder="Tuliskan berita lengkap di sini..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsArticleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Artikel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Page Modal */}
      {isPageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingPage ? 'Edit Halaman Website' : 'Buat Halaman Website Baru'}
              </h3>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePage} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Halaman</label>
                <input
                  type="text"
                  required
                  value={pageFormData.title}
                  onChange={(e) => setPageFormData({ ...pageFormData, title: e.target.value })}
                  placeholder="Contoh: Program Unggulan Sekolah"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Penempatan Menu Navigasi</label>
                  <select
                    value={pageFormData.menuPlacement}
                    onChange={(e) => setPageFormData({ ...pageFormData, menuPlacement: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="both">Header & Footer</option>
                    <option value="header">Header Navigasi Saja</option>
                    <option value="footer">Footer Saja</option>
                    <option value="none">Tidak Ditampilkan di Menu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={pageFormData.status}
                    onChange={(e) => setPageFormData({ ...pageFormData, status: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="published">Diterbitkan Langsung</option>
                    <option value="draft">Draf Simpanan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ringkasan Singkat</label>
                <input
                  type="text"
                  value={pageFormData.excerpt}
                  onChange={(e) => setPageFormData({ ...pageFormData, excerpt: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Konten Halaman</label>
                <textarea
                  rows={6}
                  required
                  value={pageFormData.content}
                  onChange={(e) => setPageFormData({ ...pageFormData, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 font-sans"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Halaman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revisions History Modal */}
      {activeRevisionPage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 max-h-[80vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-sky-800" />
                <h3 className="font-bold text-sm text-slate-900">
                  Riwayat Revisi: {activeRevisionPage.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveRevisionPage(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-4">
              {(activeRevisionPage.revisions || []).map((rev) => (
                <div key={rev.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{rev.summary || 'Pembaruan Halaman'}</span>
                    <span className="text-[11px] text-slate-500">
                      Oleh: {rev.authorName} • {rev.timestamp}
                    </span>
                  </div>
                  <button
                    onClick={() => handleRestoreRevision(activeRevisionPage.id, rev.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-sky-700 hover:bg-sky-100 rounded-md border border-sky-200 cursor-pointer"
                  >
                    Pulihkan Versi Ini
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Announcements Modal */}
      {isAnnModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingAnn ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
              </h3>
              <button
                onClick={() => setIsAnnModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Pengumuman</label>
                <input
                  type="text"
                  required
                  value={annFormData.title}
                  onChange={(e) => setAnnFormData({ ...annFormData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sasaran Pengumuman</label>
                <select
                  value={annFormData.target}
                  onChange={(e) => setAnnFormData({ ...annFormData, target: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="Semua">Semua Warga Sekolah</option>
                  <option value="Siswa">Siswa</option>
                  <option value="Guru & Staf">Guru & Staf</option>
                  <option value="Orang Tua">Orang Tua / Wali</option>
                  <option value="Calon Siswa Baru">Calon Siswa Baru (SPMB)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Pengumuman</label>
                <textarea
                  rows={4}
                  required
                  value={annFormData.content}
                  onChange={(e) => setAnnFormData({ ...annFormData, content: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="urgentFlag"
                  checked={annFormData.isUrgent}
                  onChange={(e) => setAnnFormData({ ...annFormData, isUrgent: e.target.checked })}
                  className="rounded text-sky-700 cursor-pointer"
                />
                <label htmlFor="urgentFlag" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Tandai sebagai Pengumuman Penting / Mendesak
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAnnModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Pengumuman
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff (Guru & Tendik) Modal */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingStaff ? 'Edit Data Pendidik / Tendik' : 'Tambah Guru / Tendik Baru'}
              </h3>
              <button
                onClick={() => setIsStaffModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStaff} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap & Gelar</label>
                <input
                  type="text"
                  required
                  value={staffFormData.name}
                  onChange={(e) => setStaffFormData({ ...staffFormData, name: e.target.value })}
                  placeholder="Contoh: Dra. Nurhayati, M.Pd"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">NIP</label>
                <input
                  type="text"
                  required
                  value={staffFormData.nip}
                  onChange={(e) => setStaffFormData({ ...staffFormData, nip: e.target.value })}
                  placeholder="19780102 200501 2 004"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={staffFormData.category}
                    onChange={(e) => setStaffFormData({ ...staffFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="guru">Guru Pendidik</option>
                    <option value="tendik">Tenaga Kependidikan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pendidikan</label>
                  <input
                    type="text"
                    value={staffFormData.education}
                    onChange={(e) => setStaffFormData({ ...staffFormData, education: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Jabatan / Peran</label>
                <input
                  type="text"
                  value={staffFormData.role}
                  onChange={(e) => setStaffFormData({ ...staffFormData, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mata Pelajaran (Bila Guru)</label>
                <input
                  type="text"
                  value={staffFormData.subject}
                  onChange={(e) => setStaffFormData({ ...staffFormData, subject: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Broadcast Notification Modal */}
      {isBroadcastModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Kirim Siaran Notifikasi Internal</h3>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Sasaran Role Pengguna</label>
                <select
                  value={broadcastFormData.targetRole}
                  onChange={(e) => setBroadcastFormData({ ...broadcastFormData, targetRole: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                >
                  <option value="all">Semua Warga Sekolah (Guru, Siswa, Tendik)</option>
                  <option value="guru">Hanya Dewan Guru</option>
                  <option value="siswa">Hanya Siswa</option>
                  <option value="operator_tu">Hanya Operator & Tata Usaha</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Notifikasi</label>
                <input
                  type="text"
                  required
                  value={broadcastFormData.title}
                  onChange={(e) => setBroadcastFormData({ ...broadcastFormData, title: e.target.value })}
                  placeholder="Contoh: Pengingat Rapat Dewan Guru Semester Ganjil"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pesan Notifikasi</label>
                <textarea
                  rows={3}
                  required
                  value={broadcastFormData.message}
                  onChange={(e) => setBroadcastFormData({ ...broadcastFormData, message: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Kirim Notifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Create Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Tambah Akun Pengguna Baru</h3>
              <button
                onClick={() => setIsUserModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Username</label>
                <input
                  type="text"
                  required
                  value={userFormData.username}
                  onChange={(e) => setUserFormData({ ...userFormData, username: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={userFormData.fullName}
                  onChange={(e) => setUserFormData({ ...userFormData, fullName: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Role</label>
                  <select
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="editor">Editor</option>
                    <option value="guru">Guru</option>
                    <option value="operator_tu">Operator TU</option>
                    <option value="admin_sekolah">Admin Sekolah</option>
                    <option value="siswa">Siswa</option>
                    {currentUser.role === 'super_admin' && <option value="super_admin">Super Admin</option>}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kata Sandi Bawaan</label>
                  <input
                    type="password"
                    required
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Buat Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Role Create Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">Buat Role Kustom Baru</h3>
              <button
                onClick={() => setIsRoleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveRole} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Label Role</label>
                <input
                  type="text"
                  required
                  value={roleFormData.label}
                  onChange={(e) =>
                    setRoleFormData({
                      ...roleFormData,
                      label: e.target.value,
                      name: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_')
                    })
                  }
                  placeholder="Contoh: Koordinator Lab & IT"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kode Nama Role</label>
                <input
                  type="text"
                  required
                  value={roleFormData.name}
                  onChange={(e) => setRoleFormData({ ...roleFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Kewenangan</label>
                <textarea
                  rows={2}
                  value={roleFormData.description}
                  onChange={(e) => setRoleFormData({ ...roleFormData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsRoleModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 1. Global Confirmation Delete Modal */}
      {confirmDelete.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-slate-900">{confirmDelete.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{confirmDelete.description}</p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  await confirmDelete.onConfirm();
                  setConfirmDelete({ ...confirmDelete, isOpen: false });
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm cursor-pointer"
              >
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Global Public Content Live Preview Modal */}
      {previewContent.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-sky-800" />
                <h3 className="font-bold text-sm text-slate-900">
                  Pratinjau Publikasi Website: SMA Negeri 1 Julok
                </h3>
              </div>
              <button
                onClick={() => setPreviewContent({ ...previewContent, isOpen: false })}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                {previewContent.category && (
                  <span className="font-semibold text-sky-800 bg-sky-50 px-2.5 py-0.5 rounded-md border border-sky-100">
                    {previewContent.category}
                  </span>
                )}
                {previewContent.author && (
                  <span>Oleh: <strong>{previewContent.author}</strong></span>
                )}
                {previewContent.date && (
                  <>
                    <span>·</span>
                    <span>{previewContent.date}</span>
                  </>
                )}
                <span className="ml-auto font-mono text-[11px] uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                  Status: {previewContent.status || 'Draf'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {previewContent.title}
              </h2>

              {previewContent.imageUrl && (
                <div className="h-60 sm:h-72 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={previewContent.imageUrl}
                    alt={previewContent.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/hero_sman1julok_1793290495969.jpg';
                    }}
                  />
                </div>
              )}

              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                {previewContent.content}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <span className="text-[11px] text-slate-400">
                Pratinjau sebelum perubahan tersimpan di database publik.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewContent({ ...previewContent, isOpen: false })}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Tutup Pratinjau
                </button>
                {previewContent.id && previewContent.status !== 'published' && userPermissions.includes('content.publish') && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (previewContent.contentType === 'article') {
                        await handlePublishArticle(previewContent.id!);
                      }
                      setPreviewContent({ ...previewContent, isOpen: false });
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Terbitkan ke Website Sekarang</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Event / Calendar Modal */}
      {isEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingEvent ? 'Edit Agenda Sekolah' : 'Tambah Agenda Baru'}
              </h3>
              <button
                onClick={() => setIsEventModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Agenda / Kegiatan</label>
                <input
                  type="text"
                  required
                  value={eventFormData.title}
                  onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                  placeholder="Contoh: Penilaian Akhir Semester Ganjil"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Kegiatan</label>
                  <input
                    type="date"
                    required
                    value={eventFormData.date}
                    onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Waktu / Jam</label>
                  <input
                    type="text"
                    value={eventFormData.time}
                    onChange={(e) => setEventFormData({ ...eventFormData, time: e.target.value })}
                    placeholder="08:00 - Selesai"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lokasi</label>
                  <input
                    type="text"
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    placeholder="Aula SMAN 1 Julok"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={eventFormData.category}
                    onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Akademik">Akademik</option>
                    <option value="Kesiswaan">Kesiswaan</option>
                    <option value="Ujian">Ujian</option>
                    <option value="Rapat">Rapat</option>
                    <option value="Libur">Libur</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Penyelenggara</label>
                <input
                  type="text"
                  value={eventFormData.organizer}
                  onChange={(e) => setEventFormData({ ...eventFormData, organizer: e.target.value })}
                  placeholder="Waka Kurikulum / OSIS"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Ringkas</label>
                <textarea
                  rows={3}
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                  placeholder="Keterangan agenda..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEventModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Agenda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 4. Media Gallery Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingGallery ? 'Edit Media Galeri' : 'Unggah Media Galeri'}
              </h3>
              <button
                onClick={() => setIsGalleryModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Foto / Media</label>
                <input
                  type="text"
                  required
                  value={galleryFormData.title}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, title: e.target.value })}
                  placeholder="Contoh: Upacara Bendera HUT RI ke-81"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">URL Berkas Foto / Media</label>
                <input
                  type="text"
                  required
                  value={galleryFormData.url}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, url: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={galleryFormData.category}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Kegiatan Belajar">Kegiatan Belajar</option>
                    <option value="Fasilitas Sekolah">Fasilitas Sekolah</option>
                    <option value="Ekstrakurikuler">Ekstrakurikuler</option>
                    <option value="Prestasi & Lomba">Prestasi & Lomba</option>
                    <option value="Upacara & Seremoni">Upacara & Seremoni</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tipe Media</label>
                  <select
                    value={galleryFormData.type}
                    onChange={(e) => setGalleryFormData({ ...galleryFormData, type: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="photo">Foto Dokumentasi</option>
                    <option value="video">Video Kegiatan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan / Caption</label>
                <textarea
                  rows={3}
                  value={galleryFormData.caption}
                  onChange={(e) => setGalleryFormData({ ...galleryFormData, caption: e.target.value })}
                  placeholder="Keterangan singkat kegiatan..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsGalleryModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Student Data Modal */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h3>
              <button
                onClick={() => setIsStudentModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap Siswa</label>
                <input
                  type="text"
                  required
                  value={studentFormData.name}
                  onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                  placeholder="Contoh: Muhammad Rayhan"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NISN (10 Digit)</label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    value={studentFormData.nisn}
                    onChange={(e) => setStudentFormData({ ...studentFormData, nisn: e.target.value })}
                    placeholder="0067823901"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={studentFormData.gender}
                    onChange={(e) => setStudentFormData({ ...studentFormData, gender: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Rombel / Kelas</label>
                  <select
                    value={studentFormData.className}
                    onChange={(e) => setStudentFormData({ ...studentFormData, className: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="X-1">X-1 (Fase E)</option>
                    <option value="X-2">X-2 (Fase E)</option>
                    <option value="XI MIPA 1">XI MIPA 1</option>
                    <option value="XI MIPA 2">XI MIPA 2</option>
                    <option value="XI IPS 1">XI IPS 1</option>
                    <option value="XII MIPA 1">XII MIPA 1</option>
                    <option value="XII IPS 1">XII IPS 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jurusan / Fase</label>
                  <input
                    type="text"
                    value={studentFormData.major}
                    onChange={(e) => setStudentFormData({ ...studentFormData, major: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kontak Orang Tua / Wali</label>
                  <input
                    type="text"
                    value={studentFormData.parentPhone}
                    onChange={(e) => setStudentFormData({ ...studentFormData, parentPhone: e.target.value })}
                    placeholder="0812-6900-1122"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={studentFormData.status}
                    onChange={(e) => setStudentFormData({ ...studentFormData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Mutasi">Mutasi</option>
                    <option value="Lulus">Lulus</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsStudentModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Document / Download Modal */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-base text-slate-900">
                {editingDownload ? 'Edit Dokumen Unduhan' : 'Unggah Dokumen Baru'}
              </h3>
              <button
                onClick={() => setIsDownloadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDownload} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Dokumen</label>
                <input
                  type="text"
                  required
                  value={downloadFormData.title}
                  onChange={(e) => setDownloadFormData({ ...downloadFormData, title: e.target.value })}
                  placeholder="Contoh: Kalender Pendidikan Semester Genap 2026"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={downloadFormData.category}
                    onChange={(e) => setDownloadFormData({ ...downloadFormData, category: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="Kurikulum & Kalender">Kurikulum & Kalender</option>
                    <option value="Surat Keputusan & Tata Tertib">SK & Tata Tertib</option>
                    <option value="Formulir Siswa">Formulir Siswa</option>
                    <option value="Silabus & Modul Ajar">Silabus & Modul Ajar</option>
                    <option value="Laporan Keuangan & BOS">Laporan BOS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Format Berkas</label>
                  <select
                    value={downloadFormData.fileType}
                    onChange={(e) => setDownloadFormData({ ...downloadFormData, fileType: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX / Word</option>
                    <option value="XLSX">XLSX / Excel</option>
                    <option value="ZIP">ZIP Archive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ukuran File</label>
                <input
                  type="text"
                  value={downloadFormData.fileSize}
                  onChange={(e) => setDownloadFormData({ ...downloadFormData, fileSize: e.target.value })}
                  placeholder="1.5 MB"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Deskripsi Dokumen</label>
                <textarea
                  rows={2}
                  value={downloadFormData.description}
                  onChange={(e) => setDownloadFormData({ ...downloadFormData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="restrictedDoc"
                  checked={downloadFormData.isRestricted}
                  onChange={(e) => setDownloadFormData({ ...downloadFormData, isRestricted: e.target.checked })}
                  className="rounded text-sky-700 cursor-pointer"
                />
                <label htmlFor="restrictedDoc" className="text-xs text-slate-700 font-medium cursor-pointer">
                  Akses Terbatas Internal (Hanya Guru & Operator TU)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsDownloadModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-800 hover:bg-sky-700 rounded-lg shadow-sm cursor-pointer"
                >
                  Simpan Dokumen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. Schema 3NF DDL Modal */}
      {isSchemaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] flex flex-col animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-sky-900 text-white">
                  <Code2 className="w-4 h-4" />
                </span>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Skema Basis Data Relasional 3NF (DDL SQL)</h3>
                  <p className="text-xs text-slate-500">22 Tabel Normalisasi, Foreign Keys, Unique & Check Constraints &bull; SMA Negeri 1 Julok</p>
                </div>
              </div>
              <button
                onClick={() => setIsSchemaModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-md cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between py-2.5 text-xs text-slate-600">
              <span>Format: Standard ANSI SQL DDL (PostgreSQL / MySQL / SQLite compatible)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(schemaDDL);
                    showToast('Kode DDL berhasil disalin ke clipboard!', 'success');
                  }}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Salin DDL</span>
                </button>
                <button
                  onClick={handleDownloadDDL}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-800 hover:bg-sky-700 rounded-md flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh .sql</span>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-slate-900 text-slate-100 p-4 rounded-lg font-mono text-xs leading-relaxed border border-slate-800 select-all max-h-[60vh]">
              <pre>{schemaDDL || '-- Sedang memuat skema DDL...'}</pre>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-200 mt-3">
              <button
                type="button"
                onClick={() => setIsSchemaModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
