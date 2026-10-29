import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShieldCheck, 
  KeyRound, 
  UserCheck, 
  UserX, 
  Lock, 
  Unlock, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ShieldAlert, 
  History, 
  Sliders, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  FileText,
  Image as ImageIcon,
  Globe,
  Server,
  Database,
  Download,
  RefreshCw,
  Copy,
  Eye,
  Calendar,
  Save,
  Send,
  Sparkles
} from 'lucide-react';
import { 
  User, 
  RoleDefinition, 
  PermissionKey, 
  AuditLog, 
  DatabaseSchema, 
  CustomPage, 
  MediaItem, 
  SeoSettings, 
  IntegrationSettings 
} from '../../types/index.ts';
import { api } from '../../services/api.ts';

interface SuperAdminDashboardProps {
  currentUser: User;
  data: DatabaseSchema;
  onRefresh: (fresh: DatabaseSchema) => void;
  onNavigate: (view: string, param?: string) => void;
}

const ALL_PERMISSIONS: Array<{ key: PermissionKey; label: string; desc: string }> = [
  { key: 'content.view', label: 'Melihat Konten Internal', desc: 'Akses melihat draf dan arsip konten sekolah' },
  { key: 'content.create', label: 'Membuat Draf Konten', desc: 'Menulis artikel berita dan pengumuman baru' },
  { key: 'content.edit', label: 'Mengedit Konten', desc: 'Memperbarui materi publikasi yang ada' },
  { key: 'content.delete', label: 'Menghapus Konten', desc: 'Menghapus artikel atau materi publikasi' },
  { key: 'content.approve', label: 'Menyetujui Artikel', desc: 'Menyetujui atau mengembalikan draf dari Editor' },
  { key: 'content.publish', label: 'Mempublikasikan Artikel', desc: 'Menerbitkan artikel langsung ke website publik' },
  { key: 'spmb.verify', label: 'Verifikasi & Putusan SPMB', desc: 'Menetapkan status kelulusan berkas calon murid baru' },
  { key: 'grades.manage', label: 'Kelola Nilai Siswa (E-Rapor)', desc: 'Mengisi dan mengubah capaian nilai rapor siswa' },
  { key: 'grades.view_own', label: 'Melihat Nilai Rapor Sendiri', desc: 'Akses privat siswa melihat rapor pribadi' },
  { key: 'document.manage', label: 'Kelola Berkas & Dokumen', desc: 'Mengunggah dan mengelola unduhan dokumen resmi' },
  { key: 'users.manage', label: 'Kelola Akun Pengguna', desc: 'Membuat, mengaktifkan/menonaktifkan akun warga sekolah' },
  { key: 'roles.manage', label: 'Kelola Role & Hak Akses', desc: 'Membuat role kustom dan mengatur matriks permission' },
  { key: 'audit.view', label: 'Melihat Audit Log Keamanan', desc: 'Memeriksa rekaman aktivitas dan log keamanan sistem' },
  { key: 'settings.manage', label: 'Pengaturan Pokok Sekolah', desc: 'Mengubah identitas pokok, kepala sekolah, dan statistik' }
];

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({
  currentUser,
  data,
  onRefresh,
  onNavigate
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'users' | 'roles' | 'cms_pages' | 'media' | 'seo' | 'integrations' | 'backup' | 'audit'
  >('overview');

  const [usersList, setUsersList] = useState<User[]>(data.users || []);
  const [rolesList, setRolesList] = useState<RoleDefinition[]>(data.roles || []);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(data.auditLogs || []);
  const [pagesList, setPagesList] = useState<CustomPage[]>(data.pages || []);
  const [mediaList, setMediaList] = useState<MediaItem[]>(data.media || []);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. User Management State
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('all');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState('editor');
  const [newPassword, setNewPassword] = useState('Password123!');
  const [newNipOrNisn, setNewNipOrNisn] = useState('');

  // 2. Custom Role State
  const [isAddingRole, setIsAddingRole] = useState(false);
  const [roleCodeName, setRoleCodeName] = useState('');
  const [roleLabel, setRoleLabel] = useState('');
  const [roleDesc, setRoleDesc] = useState('');
  const [selectedPerms, setSelectedPerms] = useState<PermissionKey[]>([
    'content.view',
    'document.manage'
  ]);

  // 3. CMS Pages State
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [editingPage, setEditingPage] = useState<CustomPage | null>(null);
  const [pageTitle, setPageTitle] = useState('');
  const [pageExcerpt, setPageExcerpt] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [pageStatus, setPageStatus] = useState<'draft' | 'published'>('published');
  const [pageMenuPlacement, setPageMenuPlacement] = useState<'header' | 'footer' | 'both' | 'none'>('both');
  const [pageRevisionSummary, setPageRevisionSummary] = useState('');

  // 4. Media Upload State
  const [isAddingMedia, setIsAddingMedia] = useState(false);
  const [mediaTitle, setMediaTitle] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'document' | 'video'>('image');

  // 5. SEO Settings State
  const [seoForm, setSeoForm] = useState<SeoSettings>(data.seoSettings || {
    metaTitle: 'SMA Negeri 1 Julok - Buket Seuraja, Aceh Timur',
    metaDescription: 'Website Resmi SMA Negeri 1 Julok, Desa Buket Seuraja, Kec. Julok, Kab. Aceh Timur, Aceh.',
    keywords: 'SMA Negeri 1 Julok, SMAN 1 Julok, Buket Seuraja, Sekolah Aceh Timur, SPMB SMAN 1 Julok',
    ogImageUrl: '/src/assets/images/hero_sman1julok_1793290495969.jpg',
    sitemapUrl: 'https://sman1julok.sch.id/sitemap.xml',
    googleAnalyticsId: 'G-JULOK2026SCH',
    searchConsoleCode: 'google-site-verification=julok-secure-2026-aceh'
  });

  // 6. Integrations State
  const [integrationForm, setIntegrationForm] = useState<IntegrationSettings>(data.integrationSettings || {
    dapodikUrl: 'https://dapo.kemdikbud.go.id',
    dapodikStatus: 'Tersinkronisasi',
    cbtExamUrl: 'https://cbt.sman1julok.sch.id',
    googleClassroomUrl: 'https://classroom.google.com',
    eraporUrl: 'https://erapor.kemdikbud.go.id',
    smtpConfigured: false,
    smtpHost: 'smtp.mailgun.org',
    smtpPort: 587,
    smtpUser: 'postmaster@sman1julok.sch.id'
  });

  // 7. Audit Filter State
  const [auditActionFilter, setAuditActionFilter] = useState('all');
  const [auditStatusFilter, setAuditStatusFilter] = useState('all');

  useEffect(() => {
    api.fetchUsers().then(res => setUsersList(res)).catch(() => {});
    api.fetchRoles().then(res => setRolesList(res)).catch(() => {});
    api.fetchAuditLogs().then(res => setAuditLogs(res)).catch(() => {});
    api.fetchPages().then(res => setPagesList(res)).catch(() => {});
    api.fetchMedia().then(res => setMediaList(res)).catch(() => {});
  }, []);

  // Handlers for User Management
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newEmail || !newFullName || !newPassword) {
      showToast('Mohon lengkapi seluruh kolom formulir.', 'error');
      return;
    }

    try {
      const created = await api.createUser({
        username: newUsername,
        email: newEmail,
        fullName: newFullName,
        role: newRole,
        password: newPassword,
        phone: '081269001122',
        nip: newRole === 'guru' ? newNipOrNisn : undefined,
        nisn: newRole === 'siswa' ? newNipOrNisn : undefined
      });

      setUsersList([created, ...usersList]);
      setIsAddingUser(false);
      setNewUsername('');
      setNewEmail('');
      setNewFullName('');
      setNewNipOrNisn('');
      showToast(`Akun pengguna ${created.fullName} (${created.username}) berhasil dibuat.`);
      api.fetchAuditLogs().then(l => setAuditLogs(l));
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat pengguna.', 'error');
    }
  };

  const handleToggleStatus = async (user: User, action?: 'unlock') => {
    if (user.id === currentUser.id && !action) {
      showToast('Anda tidak dapat menonaktifkan akun sendiri.', 'error');
      return;
    }
    try {
      const updated = await api.toggleUserStatus(user.id, action);
      setUsersList(usersList.map(u => u.id === updated.id ? updated : u));
      showToast(action === 'unlock' ? `Akun ${user.username} berhasil dibuka kuncinya.` : `Status akun ${user.username} diperbarui.`);
      api.fetchAuditLogs().then(l => setAuditLogs(l));
    } catch (err: any) {
      showToast(err.message || 'Gagal mengubah status akun.', 'error');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (user.role === 'super_admin') {
      showToast('Akun Super Admin sistem tidak dapat dihapus.', 'error');
      return;
    }
    if (!confirm(`Hapus permanen akun pengguna ${user.fullName} (${user.username})?`)) return;

    try {
      await api.deleteUser(user.id);
      setUsersList(usersList.filter(u => u.id !== user.id));
      showToast(`Akun ${user.username} berhasil dihapus.`);
      api.fetchAuditLogs().then(l => setAuditLogs(l));
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus akun.', 'error');
    }
  };

  // Handlers for Role Management
  const handleTogglePerm = (key: PermissionKey) => {
    if (selectedPerms.includes(key)) {
      setSelectedPerms(selectedPerms.filter(k => k !== key));
    } else {
      setSelectedPerms([...selectedPerms, key]);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roleCodeName || !roleLabel) {
      showToast('Kode role dan label tampilan wajib diisi.', 'error');
      return;
    }

    try {
      const created = await api.createRole({
        name: roleCodeName.toLowerCase().replace(/\s+/g, '_'),
        label: roleLabel,
        description: roleDesc,
        permissions: selectedPerms
      });

      setRolesList([...rolesList, created]);
      setIsAddingRole(false);
      setRoleCodeName('');
      setRoleLabel('');
      setRoleDesc('');
      showToast(`Role kustom '${created.label}' berhasil ditambahkan.`);
      api.fetchAuditLogs().then(l => setAuditLogs(l));
    } catch (err: any) {
      showToast(err.message || 'Gagal membuat role.', 'error');
    }
  };

  const handleDeleteRole = async (role: RoleDefinition) => {
    if (!confirm(`Hapus role kustom '${role.label}'?`)) return;
    try {
      await api.deleteRole(role.id);
      setRolesList(rolesList.filter(r => r.id !== role.id));
      showToast(`Role '${role.label}' dihapus.`);
      api.fetchAuditLogs().then(l => setAuditLogs(l));
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus role.', 'error');
    }
  };

  // Handlers for CMS Pages
  const handleOpenCreatePage = () => {
    setPageTitle('');
    setPageExcerpt('');
    setPageContent('');
    setPageStatus('published');
    setPageMenuPlacement('both');
    setPageRevisionSummary('Versi baru');
    setEditingPage(null);
    setIsAddingPage(true);
  };

  const handleOpenEditPage = (page: CustomPage) => {
    setPageTitle(page.title);
    setPageExcerpt(page.excerpt);
    setPageContent(page.content);
    setPageStatus(page.status);
    setPageMenuPlacement(page.menuPlacement || 'both');
    setPageRevisionSummary('Pembaruan dokumen');
    setEditingPage(page);
    setIsAddingPage(true);
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pageTitle || !pageContent) {
      showToast('Judul dan isi halaman wajib diisi.', 'error');
      return;
    }

    try {
      if (editingPage) {
        const updated = await api.updatePage(editingPage.id, {
          title: pageTitle,
          excerpt: pageExcerpt,
          content: pageContent,
          status: pageStatus,
          menuPlacement: pageMenuPlacement,
          revisionSummary: pageRevisionSummary
        });
        setPagesList(pagesList.map(p => p.id === updated.id ? updated : p));
        showToast(`Halaman '${updated.title}' berhasil diperbarui.`);
      } else {
        const created = await api.createPage({
          title: pageTitle,
          excerpt: pageExcerpt,
          content: pageContent,
          status: pageStatus,
          menuPlacement: pageMenuPlacement
        });
        setPagesList([created, ...pagesList]);
        showToast(`Halaman baru '${created.title}' berhasil diterbitkan.`);
      }
      setIsAddingPage(false);
      setEditingPage(null);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan halaman.', 'error');
    }
  };

  const handleDeletePage = async (page: CustomPage) => {
    if (!confirm(`Hapus halaman '${page.title}'?`)) return;
    try {
      await api.deletePage(page.id);
      setPagesList(pagesList.filter(p => p.id !== page.id));
      showToast(`Halaman '${page.title}' berhasil dihapus.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menghapus halaman.', 'error');
    }
  };

  const handleRestoreRevision = async (page: CustomPage, revId: string) => {
    try {
      const restored = await api.restorePageRevision(page.id, revId);
      setPagesList(pagesList.map(p => p.id === restored.id ? restored : p));
      showToast(`Versi revisi berhasil dipulihkan.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal memulihkan revisi.', 'error');
    }
  };

  // Handlers for Media Library
  const handleUploadMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaTitle || !mediaUrl) {
      showToast('Judul dan URL berkas media wajib diisi.', 'error');
      return;
    }

    try {
      const created = await api.uploadMedia({
        title: mediaTitle,
        url: mediaUrl,
        fileType: mediaType,
        fileSize: '1.5 MB'
      });
      setMediaList([created, ...mediaList]);
      setIsAddingMedia(false);
      setMediaTitle('');
      setMediaUrl('');
      showToast(`Media '${created.title}' berhasil ditambahkan.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengunggah media.', 'error');
    }
  };

  const handleDeleteMedia = async (id: string) => {
    if (!confirm('Hapus item media ini?')) return;
    try {
      await api.deleteMedia(id);
      setMediaList(mediaList.filter(m => m.id !== id));
      showToast('Media berhasil dihapus.');
    } catch (err: any) {
      showToast('Gagal menghapus media.', 'error');
    }
  };

  // Handlers for SEO & Integrations
  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSeo(seoForm);
      showToast('Pengaturan SEO & Metadata berhasil disimpan.');
    } catch {
      showToast('Gagal menyimpan SEO.', 'error');
    }
  };

  const handleSaveIntegrations = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateIntegrations(integrationForm);
      showToast('Pengaturan integrasi eksternal berhasil diperbarui.');
    } catch {
      showToast('Gagal memperbarui integrasi.', 'error');
    }
  };

  // Export CSV functions
  const handleExportUsersCsv = () => {
    const headers = ['ID', 'Username', 'Email', 'FullName', 'Role', 'Status', 'Locked', 'CreatedAt'];
    const rows = usersList.map(u => [
      `"${u.id}"`,
      `"${u.username}"`,
      `"${u.email}"`,
      `"${u.fullName}"`,
      `"${u.role}"`,
      u.isActive ? 'Aktif' : 'Nonaktif',
      u.isLocked ? 'Terkunci' : 'Normal',
      `"${u.createdAt}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-pengguna-sman1julok-${Date.now()}.csv`;
    a.click();
    showToast('Laporan CSV data pengguna berhasil diunduh.');
  };

  const handleExportAuditCsv = () => {
    const headers = ['Timestamp', 'Username', 'Role', 'Action', 'Resource', 'Details', 'IP_Address', 'Status'];
    const rows = auditLogs.map(l => [
      `"${l.timestamp}"`,
      `"${l.username}"`,
      `"${l.userRole}"`,
      `"${l.action}"`,
      `"${l.resource}"`,
      `"${l.details.replace(/"/g, '""')}"`,
      `"${l.ipAddress}"`,
      `"${l.status}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-log-keamanan-${Date.now()}.csv`;
    a.click();
    showToast('Laporan CSV audit log berhasil diunduh.');
  };

  const filteredUsers = usersList.filter(u => {
    const matchRole = userRoleFilter === 'all' || u.role === userRoleFilter;
    const q = userSearch.toLowerCase().trim();
    const matchSearch = !q || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.fullName.toLowerCase().includes(q);
    return matchRole && matchSearch;
  });

  const filteredLogs = auditLogs.filter(l => {
    const matchAction = auditActionFilter === 'all' || l.action.toLowerCase().includes(auditActionFilter.toLowerCase());
    const matchStatus = auditStatusFilter === 'all' || l.status === auditStatusFilter;
    return matchAction && matchStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-950 text-emerald-100 border-emerald-800' : 'bg-rose-950 text-rose-100 border-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Role Navigation Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center border border-purple-400/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
              <span>PORTAL SUPER ADMIN</span>
              <span aria-hidden="true">·</span>
              <span>Kewenangan Penuh Tata Kelola</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Konsol Administrator SMA Negeri 1 Julok
            </h1>
            <p className="text-xs text-slate-400">
              Masuk sebagai: <strong>{currentUser.fullName}</strong> ({currentUser.username})
            </p>
          </div>
        </div>

        {/* Global Tab Controls */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-slate-800 rounded-xl overflow-x-auto max-w-full">
          {[
            { id: 'overview', label: 'Ringkasan' },
            { id: 'users', label: `Pengguna (${usersList.length})` },
            { id: 'roles', label: `Role & Akses (${rolesList.length})` },
            { id: 'cms_pages', label: `Halaman CMS (${pagesList.length})` },
            { id: 'media', label: `Media (${mediaList.length})` },
            { id: 'seo', label: 'SEO & Meta' },
            { id: 'integrations', label: 'Integrasi' },
            { id: 'backup', label: 'Backup & Sistem' },
            { id: 'audit', label: `Audit Log (${auditLogs.length})` }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === t.id ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Total Akun Terdaftar</span>
              <p className="text-2xl font-black text-slate-900 tabular-nums">{usersList.length}</p>
              <p className="text-[11px] text-emerald-700 font-semibold">{usersList.filter(u => u.isActive).length} Aktif</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Halaman Website Dinamis</span>
              <p className="text-2xl font-black text-purple-900 tabular-nums">{pagesList.length}</p>
              <p className="text-[11px] text-slate-500">Termasuk Program & Beasiswa</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Pendaftar SPMB Online</span>
              <p className="text-2xl font-black text-sky-900 tabular-nums">{data.spmb?.length || 0}</p>
              <p className="text-[11px] text-slate-500">Tersimpan dalam database</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500 font-medium">Status Akun Terkunci</span>
              <p className="text-2xl font-black text-rose-700 tabular-nums">
                {usersList.filter(u => u.isLocked).length}
              </p>
              <p className="text-[11px] text-slate-500">Auto-lock 5x salah password</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">Pintasan Cepat Tata Kelola</h3>
                <span className="text-xs text-purple-700 font-semibold">Tindakan Cepat</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setActiveTab('cms_pages')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-slate-800 text-left flex items-center justify-between"
                >
                  <span>Kelola Halaman CMS</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-slate-800 text-left flex items-center justify-between"
                >
                  <span>Tambah Pengguna Baru</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={() => setActiveTab('backup')}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-slate-800 text-left flex items-center justify-between"
                >
                  <span>Unduh Cadangan JSON</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
                <button
                  onClick={handleExportAuditCsv}
                  className="p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 font-semibold text-slate-800 text-left flex items-center justify-between"
                >
                  <span>Ekspor CSV Audit Log</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
              <h3 className="font-bold text-slate-900 text-sm">Status Sinkronisasi & Infrastruktur</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
                  <span className="font-semibold text-emerald-950">Server Dapodikdasmen</span>
                  <span className="font-bold text-emerald-800">Tersinkronisasi Online (WIB)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-sky-50/70 border border-sky-200">
                  <span className="font-semibold text-sky-950">Portal Ujian CBT SMAN 1 Julok</span>
                  <span className="font-bold text-sky-800">Ready (cbt.sman1julok.sch.id)</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-purple-50/70 border border-purple-200">
                  <span className="font-semibold text-purple-950">Modul Keamanan & Audit Log</span>
                  <span className="font-bold text-purple-800">Aktif & Terproteksi SHA-256</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: CMS PAGES MANAGER */}
      {activeTab === 'cms_pages' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-700" />
                <span>Pengelolaan Halaman Website Dinamis (CMS)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Buat dan sunting halaman profil, beasiswa, program khusus, dan panduan akademik lengkap dengan riwayat revisi versi.
              </p>
            </div>

            <button
              onClick={handleOpenCreatePage}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Halaman Baru</span>
            </button>
          </div>

          {/* Create/Edit Form Modal */}
          {isAddingPage && (
            <form onSubmit={handleSavePage} className="p-5 rounded-2xl bg-purple-50/40 border border-purple-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-purple-950">
                  {editingPage ? `Edit Halaman: ${editingPage.title}` : 'Buat Halaman Baru'}
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAddingPage(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ✕
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Halaman *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Program Penguatan Karakter Pesantren Kilat"
                  value={pageTitle}
                  onChange={(e) => setPageTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status Publikasi</label>
                  <select
                    value={pageStatus}
                    onChange={(e) => setPageStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="published">Dipublikasikan (Terbit)</option>
                    <option value="draft">Draf (Belum Terbit)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Penempatan Menu Navigasi</label>
                  <select
                    value={pageMenuPlacement}
                    onChange={(e) => setPageMenuPlacement(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="both">Header & Footer</option>
                    <option value="header">Header Saja</option>
                    <option value="footer">Footer Saja</option>
                    <option value="none">Hanya via Tautan Langsung</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan / Lead</label>
                <input
                  type="text"
                  placeholder="Ringkasan 1 kalimat..."
                  value={pageExcerpt}
                  onChange={(e) => setPageExcerpt(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Isi Lengkap Halaman *</label>
                <textarea
                  rows={8}
                  required
                  placeholder="Tulis konten dengan heading, paragraf, list..."
                  value={pageContent}
                  onChange={(e) => setPageContent(e.target.value)}
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              {editingPage && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Catatan Revisi Versi</label>
                  <input
                    type="text"
                    placeholder="Contoh: Pembaruan tanggal kegiatan dan narasumber"
                    value={pageRevisionSummary}
                    onChange={(e) => setPageRevisionSummary(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-purple-200">
                <button
                  type="button"
                  onClick={() => setIsAddingPage(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg cursor-pointer"
                >
                  Simpan Halaman
                </button>
              </div>
            </form>
          )}

          {/* Pages Table */}
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
            {pagesList.map((page) => (
              <div key={page.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      page.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {page.status === 'published' ? 'Terbit' : 'Draf'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">/{page.slug}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{page.viewCount} views</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{page.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{page.excerpt || page.content.slice(0, 100)}</p>
                  {page.revisions && page.revisions.length > 0 && (
                    <div className="text-[11px] text-purple-700 font-semibold flex items-center gap-1 mt-1">
                      <History className="w-3 h-3" />
                      <span>{page.revisions.length} versi riwayat revisi tercatat</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigate('halaman-kustom', page.slug)}
                    className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200"
                    title="Lihat Halaman Publik"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat</span>
                  </button>
                  <button
                    onClick={() => handleOpenEditPage(page)}
                    className="p-2 text-purple-700 hover:bg-purple-50 rounded-lg text-xs font-semibold flex items-center gap-1 border border-purple-200"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeletePage(page)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold border border-rose-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: MEDIA LIBRARY */}
      {activeTab === 'media' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-purple-700" />
                <span>Pustaka Berkas & Media Sekolah (Media Library)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Kelola foto kampus, logo sekolah, brosur dokumen, dan aset visual untuk disematkan pada artikel maupun halaman website.
              </p>
            </div>

            <button
              onClick={() => setIsAddingMedia(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Unggah Media Baru</span>
            </button>
          </div>

          {isAddingMedia && (
            <form onSubmit={handleUploadMedia} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-800">Unggah / Catat Media Baru</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Judul Media</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Upacara Sumpah Pemuda 2026"
                    value={mediaTitle}
                    onChange={(e) => setMediaTitle(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">URL Berkas</label>
                  <input
                    type="text"
                    required
                    placeholder="/src/assets/... atau https://..."
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tipe Media</label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value="image">Gambar / Foto</option>
                    <option value="document">Dokumen / PDF</option>
                    <option value="video">Video</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingMedia(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold bg-purple-700 text-white rounded-lg"
                >
                  Simpan ke Pustaka
                </button>
              </div>
            </form>
          )}

          {/* Media Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {mediaList.map((item) => (
              <div key={item.id} className="p-3 rounded-xl border border-slate-200 space-y-2 hover:shadow-xs transition-shadow">
                <div className="w-full h-36 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center">
                  {item.fileType === 'image' ? (
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <FileText className="w-10 h-10 text-slate-400" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 truncate">{item.title}</h4>
                  <div className="text-[10px] text-slate-400 flex items-center justify-between mt-0.5">
                    <span>{item.fileSize}</span>
                    <span>{item.uploadedAt}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(item.url);
                      showToast('Tautan media disalin ke papan klip.');
                    }}
                    className="text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Salin URL</span>
                  </button>
                  <button
                    onClick={() => handleDeleteMedia(item.id)}
                    className="text-[11px] text-rose-600 hover:text-rose-800 cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: SEO & METADATA */}
      {activeTab === 'seo' && (
        <form onSubmit={handleSaveSeo} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Globe className="w-5 h-5 text-purple-700" />
              <span>Optimasi Mesin Pencari (SEO) & OpenGraph Social Cards</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Konfigurasi metadata, kartu pratinjau sosial (WhatsApp/Facebook/Twitter), dan indeks sitemap sekolah.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Meta Halaman (SEO Title)</label>
              <input
                type="text"
                value={seoForm.metaTitle}
                onChange={(e) => setSeoForm({ ...seoForm, metaTitle: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Gambar Pratinjau Sosial (og:image)</label>
              <input
                type="text"
                value={seoForm.ogImageUrl}
                onChange={(e) => setSeoForm({ ...seoForm, ogImageUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Meta (SEO Description)</label>
            <textarea
              rows={2}
              value={seoForm.metaDescription}
              onChange={(e) => setSeoForm({ ...seoForm, metaDescription: e.target.value })}
              className="w-full p-2.5 text-xs border border-slate-200 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Kata Kunci (Keywords)</label>
            <input
              type="text"
              value={seoForm.keywords}
              onChange={(e) => setSeoForm({ ...seoForm, keywords: e.target.value })}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Google Analytics ID</label>
              <input
                type="text"
                placeholder="G-XXXXXX"
                value={seoForm.googleAnalyticsId}
                onChange={(e) => setSeoForm({ ...seoForm, googleAnalyticsId: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">URL Sitemap XML</label>
              <input
                type="text"
                value={seoForm.sitemapUrl}
                onChange={(e) => setSeoForm({ ...seoForm, sitemapUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Pengaturan SEO</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: INTEGRATIONS */}
      {activeTab === 'integrations' && (
        <form onSubmit={handleSaveIntegrations} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-700" />
              <span>Pengaturan Integrasi Eksternal & Layanan Terhubung</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Dokumentasi tautan API, sinkronisasi Dapodik, portal ujian CBT, Google Classroom, dan notifikasi SMTP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tautan Aplikasi Dapodikdasmen</label>
              <input
                type="url"
                value={integrationForm.dapodikUrl}
                onChange={(e) => setIntegrationForm({ ...integrationForm, dapodikUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Portal Ujian CBT Online</label>
              <input
                type="url"
                value={integrationForm.cbtExamUrl}
                onChange={(e) => setIntegrationForm({ ...integrationForm, cbtExamUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tautan Google Classroom / LMS</label>
              <input
                type="url"
                value={integrationForm.googleClassroomUrl}
                onChange={(e) => setIntegrationForm({ ...integrationForm, googleClassroomUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Tautan E-Rapor Kurikulum Merdeka</label>
              <input
                type="url"
                value={integrationForm.eraporUrl}
                onChange={(e) => setIntegrationForm({ ...integrationForm, eraporUrl: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg font-mono"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800">Konfigurasi Pengiriman Email (SMTP Relay)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">SMTP Host</label>
                <input
                  type="text"
                  value={integrationForm.smtpHost}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, smtpHost: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">SMTP Port</label>
                <input
                  type="number"
                  value={integrationForm.smtpPort}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, smtpPort: parseInt(e.target.value) || 587 })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Akun Pengirim</label>
                <input
                  type="email"
                  value={integrationForm.smtpUser}
                  onChange={(e) => setIntegrationForm({ ...integrationForm, smtpUser: e.target.value })}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                />
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Konfigurasi Integrasi</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB: BACKUP & SYSTEM HEALTH */}
      {activeTab === 'backup' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="pb-4 border-b border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-700" />
              <span>Kesehatan Sistem, Pencadangan Data & Laporan CSV</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Unduh cadangan database lengkap JSON, buat laporan CSV berformat Excel, dan pantau status server sekolah.
            </p>
          </div>

          {/* System Health Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">Status Database</span>
              <p className="text-sm font-bold text-emerald-700 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Online & Persisten</span>
              </p>
              <p className="text-[11px] text-slate-400">Penyimpanan Terenkripsi</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">Zona Waktu Sekolah</span>
              <p className="text-sm font-bold text-slate-800">WIB (Asia/Jakarta)</p>
              <p className="text-[11px] text-slate-400">Kabupaten Aceh Timur</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-xs text-slate-500">Versi Perangkat Lunak</span>
              <p className="text-sm font-bold text-purple-900">v2.5.0 Kurikulum Merdeka</p>
              <p className="text-[11px] text-slate-400">Node.js + React TS</p>
            </div>
          </div>

          {/* Action Boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-xl border border-slate-200 space-y-3 bg-purple-50/20">
              <div className="flex items-center gap-2 text-sm font-bold text-purple-950">
                <Download className="w-4 h-4 text-purple-700" />
                <span>Salinan Cadangan Database (JSON)</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Unduh seluruh entitas data (berita, pengguna, halaman, nilai rapor, pendaftaran SPMB, log keamanan) ke dalam satu berkas terstruktur.
              </p>
              <a
                href="/api/system/backup"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh File Cadangan JSON</span>
              </a>
            </div>

            <div className="p-5 rounded-xl border border-slate-200 space-y-3 bg-slate-50">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <FileText className="w-4 h-4 text-sky-700" />
                <span>Laporan CSV Resmi</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ekspor berkas CSV kompatibel Microsoft Excel untuk laporan dinas pendidikan atau rekap internal.
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleExportUsersCsv}
                  className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                >
                  Ekspor Akun Pengguna (.csv)
                </button>
                <button
                  onClick={handleExportAuditCsv}
                  className="px-3 py-1.5 text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 cursor-pointer"
                >
                  Ekspor Audit Log (.csv)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: USERS MANAGEMENT (Preserved) */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Daftar Akun Warga Sekolah</h2>
              <p className="text-xs text-slate-500">Kelola kredensial guru, murid, editor, dan tenaga kependidikan.</p>
            </div>
            <button
              onClick={() => setIsAddingUser(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Pengguna</span>
            </button>
          </div>

          {/* Add User Modal */}
          {isAddingUser && (
            <form onSubmit={handleCreateUser} className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Username *</label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email Sekolah *</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Role Akun</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg"
                  >
                    {rolesList.map(r => (
                      <option key={r.id} value={r.name}>{r.label}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingUser(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-purple-700 rounded-lg"
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          )}

          {/* Users Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Nama Lengkap & Username</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3">
                      <div className="font-bold text-slate-900">{u.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">@{u.username}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{u.email}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-900 border border-purple-100">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {u.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1">
                      {u.isLocked && (
                        <button
                          onClick={() => handleToggleStatus(u, 'unlock')}
                          className="px-2 py-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 rounded cursor-pointer"
                        >
                          Unlock
                        </button>
                      )}
                      <button
                        onClick={() => handleToggleStatus(u)}
                        className="px-2 py-1 text-[10px] font-semibold text-slate-600 bg-slate-100 rounded cursor-pointer"
                      >
                        {u.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      </button>
                      {u.role !== 'super_admin' && (
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="px-2 py-1 text-[10px] font-semibold text-rose-600 bg-rose-50 rounded cursor-pointer"
                        >
                          Hapus
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ROLES & PERMISSIONS MATRIX (Preserved) */}
      {activeTab === 'roles' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <h2 className="text-base font-bold text-slate-900">Matriks Hak Akses & Role</h2>
              <p className="text-xs text-slate-500">Konfigurasi izin granular 14 fungsi operasional website.</p>
            </div>
            <button
              onClick={() => setIsAddingRole(true)}
              className="px-4 py-2 text-xs font-bold text-white bg-purple-700 hover:bg-purple-800 rounded-lg"
            >
              Tambah Role Kustom
            </button>
          </div>

          {/* Add Role Form */}
          {isAddingRole && (
            <form onSubmit={handleCreateRole} className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold block mb-1">Kode Role (unik, snake_case)</label>
                  <input
                    type="text"
                    required
                    placeholder="contoh: konselor_bk"
                    value={roleCodeName}
                    onChange={(e) => setRoleCodeName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Label Tampilan</label>
                  <input
                    type="text"
                    required
                    placeholder="contoh: Guru BK / Konselor"
                    value={roleLabel}
                    onChange={(e) => setRoleLabel(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-2">Pilih Hak Akses Granular</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {ALL_PERMISSIONS.map(p => (
                    <label key={p.key} className="flex items-start gap-2 p-2 rounded-lg bg-white border border-slate-200 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(p.key)}
                        onChange={() => handleTogglePerm(p.key)}
                        className="mt-0.5 rounded text-purple-700"
                      />
                      <div>
                        <div className="font-bold text-slate-800">{p.label}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{p.key}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-purple-200">
                <button
                  type="button"
                  onClick={() => setIsAddingRole(false)}
                  className="px-3 py-1.5 text-xs text-slate-600"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-purple-700 rounded-lg"
                >
                  Simpan Role
                </button>
              </div>
            </form>
          )}

          {/* Roles List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rolesList.map(r => (
              <div key={r.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{r.label}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {r.isSystemRole ? 'Role Sistem' : 'Kustom'}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{r.description || 'Tidak ada deskripsi'}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {r.permissions.map(p => (
                    <span key={p} className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-50 text-purple-800 border border-purple-100">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB: AUDIT LOGS (Preserved) */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-200 gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900">Audit Log & Rekaman Keamanan</h2>
              <p className="text-xs text-slate-500">Seluruh jejak autentikasi, pengubahan data, dan penolakan akses tercatat permanen.</p>
            </div>
            <button
              onClick={handleExportAuditCsv}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Audit CSV</span>
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Waktu (WIB)</th>
                  <th className="py-2.5 px-3">Pengguna & Role</th>
                  <th className="py-2.5 px-3">Aksi</th>
                  <th className="py-2.5 px-3">Detail Aktivitas</th>
                  <th className="py-2.5 px-3">IP Address</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/70">
                    <td className="py-2.5 px-3 text-[11px] text-slate-500">
                      {log.timestamp}
                    </td>
                    <td className="py-2.5 px-3">
                      <strong className="text-slate-900 block">{log.username}</strong>
                      <span className="text-[10px] text-purple-800 font-mono">{log.userRole}</span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-sky-900">{log.action}</td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs">{log.details}</td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">{log.ipAddress}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SUCCESS' ? 'bg-emerald-100 text-emerald-800' :
                        log.status === 'BLOCKED' ? 'bg-amber-100 text-amber-800' :
                        'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
