import React, { useState } from 'react';
import { 
  Lock, 
  Unlock, 
  Settings, 
  FileText, 
  Bell, 
  Calendar, 
  Users, 
  Award, 
  Building2, 
  GraduationCap, 
  Mail, 
  RotateCcw, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  Save, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink 
} from 'lucide-react';
import { 
  DatabaseSchema, 
  NewsItem, 
  AnnouncementItem, 
  EventItem, 
  StaffItem, 
  FacilityItem, 
  AchievementItem, 
  GalleryItem, 
  SpmbRegistration, 
  ContactMessage, 
  SchoolSettings 
} from '../types/index.ts';
import { api } from '../services/api.ts';

interface AdminDashboardProps {
  data: DatabaseSchema;
  isLoggedIn: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
  onDataRefresh: (freshData: DatabaseSchema) => void;
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  data,
  isLoggedIn,
  onLogin,
  onLogout,
  onDataRefresh,
  onNavigate
}) => {
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'settings' | 'news' | 'announcements' | 'events' | 'staff' | 'achievements' | 'spmb' | 'messages'
  >('spmb');

  // Notification Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Login handler
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await api.adminLogin(passcode);
      if (res.success && res.token) {
        onLogin(res.token);
        setPasscode('');
        showToast('Login berhasil! Selamat datang di Dashboard Operator SMAN 1 Julok.');
      } else {
        setLoginError(res.error || 'Kata sandi tidak sesuai.');
      }
    } catch {
      setLoginError('Terjadi kendala jaringan.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 1. Settings state
  const [settingsForm, setSettingsForm] = useState<SchoolSettings>(data.settings);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const updated = await api.updateSettings(settingsForm);
      onDataRefresh({ ...data, settings: updated });
      showToast('Pengaturan profil sekolah berhasil disimpan!');
    } catch {
      showToast('Gagal menyimpan pengaturan.', 'error');
    } finally {
      setIsSavingSettings(false);
    }
  };

  // 2. News Management State
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isAddingNews, setIsAddingNews] = useState(false);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState<NewsItem['category']>('Kegiatan');
  const [newsExcerpt, setNewsExcerpt] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsAuthor, setNewsAuthor] = useState('Humas SMAN 1 Julok');
  const [newsImageUrl, setNewsImageUrl] = useState('/src/assets/images/hero_sman1julok_1793290495969.jpg');

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsExcerpt || !newsContent) {
      showToast('Lengkapi judul, kutipan, dan isi berita.', 'error');
      return;
    }

    try {
      if (editingNews) {
        const updated = await api.updateNews(editingNews.id, {
          title: newsTitle,
          category: newsCategory,
          excerpt: newsExcerpt,
          content: newsContent,
          author: newsAuthor,
          imageUrl: newsImageUrl
        });
        const freshList = data.news.map(n => n.id === updated.id ? updated : n);
        onDataRefresh({ ...data, news: freshList });
        showToast('Berita berhasil diperbarui!');
      } else {
        const created = await api.createNews({
          title: newsTitle,
          category: newsCategory,
          excerpt: newsExcerpt,
          content: newsContent,
          author: newsAuthor,
          imageUrl: newsImageUrl,
          tags: ['SMAN 1 Julok', newsCategory]
        });
        onDataRefresh({ ...data, news: [created, ...data.news] });
        showToast('Berita baru berhasil diterbitkan!');
      }
      setIsAddingNews(false);
      setEditingNews(null);
      setNewsTitle('');
      setNewsExcerpt('');
      setNewsContent('');
    } catch {
      showToast('Gagal memproses berita.', 'error');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus berita ini?')) return;
    try {
      await api.deleteNews(id);
      onDataRefresh({ ...data, news: data.news.filter(n => n.id !== id) });
      showToast('Berita berhasil dihapus.');
    } catch {
      showToast('Gagal menghapus berita.', 'error');
    }
  };

  // 3. Announcements state
  const [isAddingAnn, setIsAddingAnn] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annTarget, setAnnTarget] = useState<AnnouncementItem['target']>('Semua');
  const [annUrgent, setAnnUrgent] = useState(false);

  const handleSaveAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annContent) return;
    try {
      const created = await api.createAnnouncement({
        title: annTitle,
        content: annContent,
        target: annTarget,
        isUrgent: annUrgent
      });
      onDataRefresh({ ...data, announcements: [created, ...data.announcements] });
      setIsAddingAnn(false);
      setAnnTitle('');
      setAnnContent('');
      showToast('Pengumuman resmi diterbitkan!');
    } catch {
      showToast('Gagal membuat pengumuman.', 'error');
    }
  };

  const handleDeleteAnn = async (id: string) => {
    if (!confirm('Hapus pengumuman ini?')) return;
    try {
      await api.deleteAnnouncement(id);
      onDataRefresh({ ...data, announcements: data.announcements.filter(a => a.id !== id) });
      showToast('Pengumuman dihapus.');
    } catch {
      showToast('Gagal menghapus pengumuman.', 'error');
    }
  };

  // 4. SPMB Status update
  const handleUpdateSpmbStatus = async (id: string, status: SpmbRegistration['status'], notes?: string) => {
    try {
      await api.updateSpmbStatus(id, status, notes);
      const updatedList = data.spmb.map(s => s.id === id ? { ...s, status, notes: notes !== undefined ? notes : s.notes } : s);
      onDataRefresh({ ...data, spmb: updatedList });
      showToast(`Status pendaftar diubah menjadi: ${status}`);
    } catch {
      showToast('Gagal memperbarui status pendaftar.', 'error');
    }
  };

  // 5. Reset to default data
  const handleResetData = async () => {
    if (!confirm('PERINGATAN: Apakah Anda yakin ingin mengembalikan seluruh data sekolah ke data awal SMA Negeri 1 Julok?')) return;
    try {
      await api.resetData();
      const fresh = await api.fetchAllData();
      onDataRefresh(fresh);
      showToast('Data berhasil dikembalikan ke standar awal.');
    } catch {
      showToast('Gagal mereset data.', 'error');
    }
  };

  // If not logged in, show login form
  if (!isLoggedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-sky-900 text-white flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6 text-sky-300" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Portal Operator SMAN 1 Julok</h1>
            <p className="text-xs text-slate-500">
              Masuk untuk mengelola data sekolah, berita, pengumuman, dewan guru, dan pendaftar SPMB.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kata Sandi / Passcode Operator
              </label>
              <input
                type="password"
                required
                placeholder="Masukkan passcode admin..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                autoFocus
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Kata sandi standar pengujian: <code className="bg-slate-100 text-slate-700 px-1 py-0.5 rounded font-mono">admin123</code>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-2.5 rounded-lg bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>{isLoggingIn ? 'Memverifikasi...' : 'Masuk Dashboard'}</span>
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() => onNavigate('beranda')}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Kembali ke Halaman Depan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-6">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-lg border text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom-2 ${
          toast.type === 'success' ? 'bg-emerald-900 text-white border-emerald-800' : 'bg-rose-900 text-white border-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <AlertCircle className="w-4 h-4 text-rose-300" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Bar Operator */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-sky-400 font-semibold">
            <span>DASHBOARD OPERATOR RESMI</span>
            <span aria-hidden="true">·</span>
            <span>{data.settings.name}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold mt-1">Pusat Pengelolaan Konten & Layanan</h1>
          <p className="text-xs text-slate-300">NPSN: {data.settings.npsn} · Desa Buket Seuraja, Julok, Aceh Timur</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('beranda')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Lihat Website</span>
          </button>
          <button
            onClick={handleResetData}
            className="px-3 py-1.5 rounded-lg bg-amber-950/70 hover:bg-amber-900 text-xs font-medium text-amber-200 border border-amber-800 transition-colors flex items-center gap-1.5"
            title="Kembalikan data ke standar awal"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Default</span>
          </button>
          <button
            onClick={onLogout}
            className="px-3 py-1.5 rounded-lg bg-rose-900/80 hover:bg-rose-800 text-xs font-medium text-white transition-colors"
          >
            Keluar Sesi
          </button>
        </div>
      </div>

      {/* Dashboard Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
        {[
          { key: 'spmb', label: `Pendaftar SPMB (${data.spmb.length})`, icon: GraduationCap },
          { key: 'news', label: `Berita & Artikel (${data.news.length})`, icon: FileText },
          { key: 'announcements', label: `Pengumuman (${data.announcements.length})`, icon: Bell },
          { key: 'settings', label: 'Profil & Identitas Sekolah', icon: Settings },
          { key: 'messages', label: `Pesan Kontak (${data.messages.length})`, icon: Mail },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === tab.key ? 'bg-sky-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: SPMB PENDAFTAR */}
      {activeTab === 'spmb' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Data Pendaftar SPMB Online</h2>
              <p className="text-xs text-slate-500">Kelola dan verifikasi berkas calon peserta didik baru.</p>
            </div>
            <span className="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-lg">
              Total {data.spmb.length} Calon Siswa
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">No. Registrasi</th>
                  <th className="py-2.5 px-3">Nama Lengkap</th>
                  <th className="py-2.5 px-3">NISN / Asal SMP</th>
                  <th className="py-2.5 px-3">Jalur & Nilai</th>
                  <th className="py-2.5 px-3">Kontak Ortu</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Ubah Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.spmb.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-mono font-bold text-slate-900">{reg.registrationNumber}</td>
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-900">{reg.fullName}</p>
                      <p className="text-[11px] text-slate-400">{reg.submissionDate}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-mono">{reg.nisn}</p>
                      <p className="text-slate-500">{reg.originSchool}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-sky-800">{reg.chosenPathway}</p>
                      <p className="text-slate-500">Rata-rata: {reg.averageScore}</p>
                    </td>
                    <td className="py-3 px-3">
                      <p>{reg.parentName}</p>
                      <p className="font-mono text-slate-500">{reg.parentPhone}</p>
                    </td>
                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        reg.status === 'Lulus Seleksi' ? 'bg-emerald-100 text-emerald-800' :
                        reg.status === 'Berkas Diterima' ? 'bg-sky-100 text-sky-800' :
                        reg.status === 'Cadangan' ? 'bg-amber-100 text-amber-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <select
                        value={reg.status}
                        onChange={(e) => handleUpdateSpmbStatus(reg.id, e.target.value as any)}
                        className="text-xs bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:outline-none"
                      >
                        <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                        <option value="Berkas Diterima">Berkas Diterima</option>
                        <option value="Lulus Seleksi">Lulus Seleksi</option>
                        <option value="Cadangan">Cadangan</option>
                        <option value="Tidak Lulus">Tidak Lulus</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 2: BERITA & ARTIKEL */}
      {activeTab === 'news' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kelola Warta & Berita Sekolah</h2>
              <p className="text-xs text-slate-500">Terbitkan publikasi kegiatan atau perbarui artikel yang sudah ada.</p>
            </div>
            {!isAddingNews && (
              <button
                onClick={() => {
                  setEditingNews(null);
                  setNewsTitle('');
                  setNewsExcerpt('');
                  setNewsContent('');
                  setIsAddingNews(true);
                }}
                className="px-3.5 py-2 rounded-lg bg-sky-900 hover:bg-sky-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tulis Berita Baru</span>
              </button>
            )}
          </div>

          {/* Add / Edit Form */}
          {isAddingNews && (
            <form onSubmit={handleSaveNews} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800">
                  {editingNews ? 'Edit Berita' : 'Form Berita Baru'}
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddingNews(false)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  Batal
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Berita *</label>
                  <input
                    type="text"
                    required
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    placeholder="Contoh: Siswa SMAN 1 Julok Raih Medali..."
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Kegiatan">Kegiatan</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Pengumuman">Pengumuman</option>
                    <option value="Artikel Siswa">Artikel Siswa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kutipan Ringkas (Excerpt) *</label>
                <textarea
                  required
                  rows={2}
                  value={newsExcerpt}
                  onChange={(e) => setNewsExcerpt(e.target.value)}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu berita..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Konten Lengkap Berita *</label>
                <textarea
                  required
                  rows={6}
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  placeholder="Tuliskan berita lengkap..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingNews(false)}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-xs text-slate-700 hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-sky-900 hover:bg-sky-800 text-white font-semibold text-xs"
                >
                  {editingNews ? 'Simpan Perubahan' : 'Terbitkan Berita'}
                </button>
              </div>
            </form>
          )}

          {/* News Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Judul Berita</th>
                  <th className="py-2.5 px-3">Kategori</th>
                  <th className="py-2.5 px-3">Tanggal</th>
                  <th className="py-2.5 px-3">Pembaca</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.news.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3 font-semibold text-slate-900 max-w-sm truncate">{item.title}</td>
                    <td className="py-3 px-3 text-sky-800">{item.category}</td>
                    <td className="py-3 px-3 text-slate-500">{item.date}</td>
                    <td className="py-3 px-3 font-mono">{item.views}</td>
                    <td className="py-3 px-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingNews(item);
                          setNewsTitle(item.title);
                          setNewsCategory(item.category);
                          setNewsExcerpt(item.excerpt);
                          setNewsContent(item.content);
                          setNewsAuthor(item.author);
                          setNewsImageUrl(item.imageUrl);
                          setIsAddingNews(true);
                        }}
                        className="text-xs text-sky-800 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteNews(item.id)}
                        className="text-xs text-rose-700 hover:underline"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: PENGUMUMAN */}
      {activeTab === 'announcements' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Kelola Pengumuman Sekolah</h2>
              <p className="text-xs text-slate-500">Pasang edaran penting atau surat pemberitahuan.</p>
            </div>
            {!isAddingAnn && (
              <button
                onClick={() => setIsAddingAnn(true)}
                className="px-3.5 py-2 rounded-lg bg-sky-900 hover:bg-sky-800 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Pengumuman</span>
              </button>
            )}
          </div>

          {isAddingAnn && (
            <form onSubmit={handleSaveAnn} className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800">Form Pengumuman Baru</span>
                <button type="button" onClick={() => setIsAddingAnn(false)} className="text-xs text-slate-500">Batal</button>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Judul Pengumuman *</label>
                <input
                  type="text"
                  required
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  placeholder="Contoh: Jadwal Libur Awal Ramadhan..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Target Sasaran</label>
                  <select
                    value={annTarget}
                    onChange={(e) => setAnnTarget(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                  >
                    <option value="Semua">Semua</option>
                    <option value="Siswa">Siswa</option>
                    <option value="Guru & Staf">Guru & Staf</option>
                    <option value="Orang Tua">Orang Tua</option>
                    <option value="Calon Siswa Baru">Calon Siswa Baru</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="urgentCheck"
                    checked={annUrgent}
                    onChange={(e) => setAnnUrgent(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="urgentCheck" className="text-xs font-semibold text-amber-800">
                    Tandai sebagai Pengumuman Mendesak / Urgent
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Isi Lengkap Pengumuman *</label>
                <textarea
                  required
                  rows={4}
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  placeholder="Isi edaran resmi..."
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddingAnn(false)} className="px-4 py-1.5 text-xs border rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-1.5 text-xs bg-sky-900 text-white rounded-lg font-semibold">Simpan</button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {data.announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    {ann.isUrgent && <span className="bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded text-[10px]">URGENT</span>}
                    <span className="text-slate-500 font-medium">{ann.target} · {ann.date}</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{ann.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2">{ann.content}</p>
                </div>
                <button onClick={() => handleDeleteAnn(ann.id)} className="text-xs text-rose-700 hover:underline shrink-0">
                  Hapus
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT 4: SETTINGS & IDENTITAS SEKOLAH */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Pengaturan Identitas & Metadata Sekolah</h2>
            <p className="text-xs text-slate-500">Perbarui profil resmi, kepala sekolah, alamat, dan statistik riil.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Resmi Sekolah</label>
              <input
                type="text"
                value={settingsForm.name}
                onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Motto / Tagline Sekolah</label>
              <input
                type="text"
                value={settingsForm.tagline}
                onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NPSN</label>
              <input
                type="text"
                value={settingsForm.npsn}
                onChange={(e) => setSettingsForm({ ...settingsForm, npsn: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Akreditasi</label>
              <input
                type="text"
                value={settingsForm.accreditation}
                onChange={(e) => setSettingsForm({ ...settingsForm, accreditation: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Kepala Sekolah</label>
              <input
                type="text"
                value={settingsForm.principalName}
                onChange={(e) => setSettingsForm({ ...settingsForm, principalName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">NIP Kepala Sekolah</label>
              <input
                type="text"
                value={settingsForm.principalNip}
                onChange={(e) => setSettingsForm({ ...settingsForm, principalNip: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                value={settingsForm.phone}
                onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Email Resmi</label>
              <input
                type="email"
                value={settingsForm.email}
                onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap Buket Seuraja</label>
              <input
                type="text"
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Teks Sambutan Kepala Sekolah</label>
              <textarea
                rows={4}
                value={settingsForm.principalSpeech}
                onChange={(e) => setSettingsForm({ ...settingsForm, principalSpeech: e.target.value })}
                className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSavingSettings}
              className="px-6 py-2.5 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSavingSettings ? 'Menyimpan...' : 'Simpan Seluruh Pengaturan'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB CONTENT 5: PESAN MASUK KONTAK */}
      {activeTab === 'messages' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Kotak Masuk Masukan & Pertanyaan</h2>
            <p className="text-xs text-slate-500">Pesan dari masyarakat, wali murid, dan alumni melalui halaman Kontak.</p>
          </div>

          <div className="space-y-3">
            {data.messages.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">Belum ada pesan masuk.</p>
            ) : (
              data.messages.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{m.name} ({m.email})</span>
                    <span className="text-slate-400">{m.date}</span>
                  </div>
                  <p className="text-xs font-semibold text-sky-800">{m.subject}</p>
                  <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-lg leading-relaxed">{m.message}</p>
                  {m.phone && <p className="text-[11px] text-slate-500">No Telp: {m.phone}</p>}
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
