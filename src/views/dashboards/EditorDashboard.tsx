import React, { useState, useEffect } from 'react';
import { 
  FileEdit, 
  Send, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Plus, 
  Edit3, 
  Eye, 
  Calendar, 
  User as UserIcon, 
  Tag, 
  Sparkles,
  Info,
  ShieldCheck,
  Search
} from 'lucide-react';
import { User, EditorialArticle, DatabaseSchema } from '../../types/index.ts';
import { api } from '../../services/api.ts';

interface EditorDashboardProps {
  currentUser: User;
  data: DatabaseSchema;
  onRefresh: (fresh: DatabaseSchema) => void;
  onNavigate: (view: string) => void;
}

export const EditorDashboard: React.FC<EditorDashboardProps> = ({
  currentUser,
  data,
  onRefresh,
  onNavigate
}) => {
  const [articles, setArticles] = useState<EditorialArticle[]>(data.articles || []);
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'pending_approval' | 'rejected' | 'published'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState<EditorialArticle | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<EditorialArticle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<EditorialArticle['category']>('Kegiatan');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadArticles = async () => {
    try {
      const list = await api.fetchEditorialArticles();
      setArticles(list);
    } catch {
      // quiet
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleOpenCreate = () => {
    setFormTitle('');
    setFormCategory('Kegiatan');
    setFormExcerpt('');
    setFormContent('');
    setFormImageUrl('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=1200');
    setIsEditing(null);
    setIsCreating(true);
  };

  const handleOpenEdit = (art: EditorialArticle) => {
    if (art.status === 'published' || art.status === 'pending_approval') {
      showToast('Artikel yang sedang ditinjau atau telah terbit tidak dapat diedit langsung. Harap tarik atau koordinasi dengan Admin.', 'error');
      return;
    }
    setFormTitle(art.title);
    setFormCategory(art.category);
    setFormExcerpt(art.excerpt);
    setFormContent(art.content);
    setFormImageUrl(art.imageUrl || '');
    setIsEditing(art);
    setIsCreating(false);
  };

  const handleSaveDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formContent) {
      showToast('Judul dan isi artikel wajib diisi.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing) {
        // Submit update
        const updated = await api.createEditorialDraft({
          id: isEditing.id,
          title: formTitle,
          category: formCategory,
          excerpt: formExcerpt || formContent.slice(0, 150) + '...',
          content: formContent,
          imageUrl: formImageUrl,
          status: 'draft'
        });
        showToast(`Draf '${updated.title}' berhasil diperbarui.`);
      } else {
        const created = await api.createEditorialDraft({
          title: formTitle,
          category: formCategory,
          excerpt: formExcerpt || formContent.slice(0, 150) + '...',
          content: formContent,
          imageUrl: formImageUrl,
          status: 'draft',
          authorName: currentUser.fullName,
          authorId: currentUser.id
        });
        showToast(`Draf '${created.title}' berhasil disimpan.`);
      }
      setIsCreating(false);
      setIsEditing(null);
      await loadArticles();
    } catch (err: any) {
      showToast(err.message || 'Gagal menyimpan draf.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForReview = async (id: string, title: string) => {
    setIsSubmitting(true);
    try {
      await api.submitArticleForReview(id);
      showToast(`Artikel '${title}' telah diajukan ke antrean persetujuan Admin Sekolah.`);
      await loadArticles();
      if (selectedArticle?.id === id) {
        setSelectedArticle(null);
      }
    } catch (err: any) {
      showToast(err.message || 'Gagal mengajukan persetujuan.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtered
  const filteredArticles = articles.filter(a => {
    const matchesTab = activeTab === 'all' || a.status === activeTab;
    const matchesSearch = 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.authorName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusBadge = (status: EditorialArticle['status']) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            <Clock className="w-3 h-3 text-slate-500" /> Draf Redaksi
          </span>
        );
      case 'pending_approval':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600 animate-pulse" /> Menunggu Persetujuan
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Disetujui
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
            <XCircle className="w-3 h-3 text-rose-600" /> Perlu Revisi
          </span>
        );
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            <Sparkles className="w-3 h-3 text-sky-600" /> Terbit di Web
          </span>
        );
    }
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-xl text-sm font-semibold flex items-center gap-2 border transition-all ${
          toast.type === 'success' 
            ? 'bg-emerald-900 text-emerald-100 border-emerald-700' 
            : 'bg-rose-900 text-rose-100 border-rose-700'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-700 mb-1">
              <FileEdit className="w-4 h-4" />
              <span>DASHBOARD REDAKSI & EDITOR</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">Alur Editorial Sekolah</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Selamat Datang, {currentUser.fullName}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola draf pemberitaan, artikel prestasi, liputan agenda sekolah, dan ajukan peninjauan editorial kepada Kepala Sekolah.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-900 rounded-lg hover:bg-sky-800 transition-colors shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tulis Artikel Baru</span>
            </button>
          </div>
        </div>

        {/* Mandatory RBAC Policy Banner (Requirement 6 & 7) */}
        <div className="mt-5 p-4 rounded-lg bg-sky-50/70 border border-sky-200/80 flex items-start gap-3">
          <Info className="w-5 h-5 text-sky-800 shrink-0 mt-0.5" />
          <div className="text-xs text-sky-950 leading-relaxed">
            <p className="font-bold text-sky-900">
              Prinsip Role-Based Access Control (RBAC): Pemisahan Wewenang Editor & Administrator
            </p>
            <p className="mt-1 text-slate-700">
              Sesuai Pedoman Tata Kelola Redaksi SMA Negeri 1 Julok, akun ber-role <strong>Editor</strong> berwenang menyusun, mengedit, dan mengajukan draf artikel. Editor <strong>tidak diizinkan mempublikasikan artikel secara langsung</strong> ke website publik tanpa proses penelaahan (<em>approval</em>) oleh Admin Sekolah / Kepala Sekolah guna menjamin akurasi dan standar komunikasi resmi sekolah.
            </p>
          </div>
        </div>
      </div>

      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Draf Tersimpan</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">
            {articles.filter(a => a.status === 'draft').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
          <div className="text-xs text-amber-700 font-medium">Menunggu Persetujuan</div>
          <div className="text-2xl font-bold text-amber-900 mt-1">
            {articles.filter(a => a.status === 'pending_approval').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-sm">
          <div className="text-xs text-rose-700 font-medium">Perlu Revisi (Ditolak)</div>
          <div className="text-2xl font-bold text-rose-900 mt-1">
            {articles.filter(a => a.status === 'rejected').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
          <div className="text-xs text-emerald-700 font-medium">Telah Terpublikasi</div>
          <div className="text-2xl font-bold text-emerald-900 mt-1">
            {articles.filter(a => a.status === 'published').length}
          </div>
        </div>
      </div>

      {/* Main Editorial Pipeline List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Navigation Tabs & Search */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'all' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Semua Artikel ({articles.length})
            </button>
            <button
              onClick={() => setActiveTab('draft')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'draft' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Draf Saya ({articles.filter(a => a.status === 'draft').length})
            </button>
            <button
              onClick={() => setActiveTab('pending_approval')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'pending_approval' ? 'bg-amber-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Menunggu Review ({articles.filter(a => a.status === 'pending_approval').length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'rejected' ? 'bg-rose-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Revisi ({articles.filter(a => a.status === 'rejected').length})
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                activeTab === 'published' ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Terbit ({articles.filter(a => a.status === 'published').length})
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul atau topik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white"
            />
          </div>
        </div>

        {/* Table / Cards */}
        {filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileEdit className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-600">Tidak ada artikel di kategori ini</p>
            <p className="text-xs text-slate-400 mt-1">Gunakan tombol "Tulis Artikel Baru" untuk menyusun draf berita.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredArticles.map((art) => (
              <div key={art.id} className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(art.status)}
                      <span className="text-xs font-medium text-sky-800 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">
                        {art.category}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {art.createdAt}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 hover:text-sky-900 transition-colors">
                      {art.title}
                    </h2>

                    <p className="text-xs text-slate-600 line-clamp-2 max-w-3xl leading-relaxed">
                      {art.excerpt || art.content.slice(0, 160)}
                    </p>

                    {/* Revision notes if rejected */}
                    {art.status === 'rejected' && art.reviewNotes && (
                      <div className="mt-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-900">
                        <div className="font-bold flex items-center gap-1 text-rose-800 mb-0.5">
                          <AlertCircle className="w-3.5 h-3.5" />
                          <span>Catatan Perbaikan dari Penguji/Admin:</span>
                        </div>
                        <p className="italic">"{art.reviewNotes}"</p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setSelectedArticle(art)}
                      className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 border border-slate-200"
                      title="Lihat Pratinjau Draf"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Pratinjau</span>
                    </button>

                    {(art.status === 'draft' || art.status === 'rejected') && (
                      <>
                        <button
                          onClick={() => handleOpenEdit(art)}
                          className="p-2 text-sky-700 hover:bg-sky-50 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1 border border-sky-200 font-semibold"
                          title="Sunting Draf"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>

                        <button
                          onClick={() => handleSubmitForReview(art.id, art.title)}
                          disabled={isSubmitting}
                          className="px-3 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Ajukan Review</span>
                        </button>
                      </>
                    )}

                    {art.status === 'pending_approval' && (
                      <div className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 animate-spin" />
                        <span>Menunggu Telaah Kepsek</span>
                      </div>
                    )}

                    {art.status === 'published' && (
                      <button
                        onClick={() => onNavigate('berita')}
                        className="px-3 py-1.5 text-xs text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Lihat di Web</span>
                      </button>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal: Write or Edit Article */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <FileEdit className="w-5 h-5 text-sky-900" />
                <h3 className="text-base font-bold text-slate-900">
                  {isEditing ? 'Perbarui Draf Artikel' : 'Tulis Draf Artikel Baru'}
                </h3>
              </div>
              <button
                onClick={() => { setIsCreating(false); setIsEditing(null); }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDraft} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Judul Artikel <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Siswa SMAN 1 Julok Raih Medali Emas OSN..."
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Kategori Konten</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    <option value="Kegiatan">Kegiatan Siswa</option>
                    <option value="Prestasi">Prestasi</option>
                    <option value="Akademik">Akademik</option>
                    <option value="Pengumuman">Pengumuman Resmi</option>
                    <option value="Artikel Siswa">Artikel Siswa</option>
                    <option value="Budaya & Agama">Budaya & Agama</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">URL Gambar Header</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={formImageUrl}
                    onChange={(e) => setFormImageUrl(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ringkasan Singkat (Lead / Excerpt)</label>
                <textarea
                  rows={2}
                  placeholder="Ringkasan 1-2 kalimat untuk kartu depan..."
                  value={formExcerpt}
                  onChange={(e) => setFormExcerpt(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Isi Lengkap Artikel <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  placeholder="Tuliskan berita lengkap dengan susunan 5W+1H..."
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 italic">
                  * Draf disimpan terlebih dahulu sebelum diajukan ke admin sekolah.
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsCreating(false); setIsEditing(null); }}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-sky-900 hover:bg-sky-800 rounded-lg transition-colors shadow-sm cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan Draf'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Preview Article */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                {getStatusBadge(selectedArticle.status)}
                <span className="text-xs font-bold text-sky-900 bg-sky-50 px-2 py-0.5 rounded">
                  {selectedArticle.category}
                </span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <h2 className="text-xl font-bold text-slate-900 leading-tight">
                {selectedArticle.title}
              </h2>

              <div className="flex items-center gap-3 text-xs text-slate-500 pb-2 border-b border-slate-100">
                <span>Penulis: <strong>{selectedArticle.authorName || 'Redaksi'}</strong></span>
                <span>·</span>
                <span>Tanggal: {selectedArticle.createdAt}</span>
                {selectedArticle.publishedAt && (
                  <>
                    <span>·</span>
                    <span>Terbit: {selectedArticle.publishedAt}</span>
                  </>
                )}
              </div>

              {selectedArticle.imageUrl && (
                <div className="w-full h-64 rounded-xl overflow-hidden bg-slate-100">
                  <img
                    src={selectedArticle.imageUrl}
                    alt={selectedArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <p className="text-sm font-medium text-slate-700 italic bg-slate-50 p-3 rounded-lg border-l-4 border-sky-800">
                {selectedArticle.excerpt}
              </p>

              <div className="text-xs text-slate-800 leading-relaxed space-y-3 whitespace-pre-wrap">
                {selectedArticle.content}
              </div>

              {selectedArticle.reviewNotes && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <div className="font-bold flex items-center gap-1 mb-1">
                    <Info className="w-3.5 h-3.5 text-amber-700" />
                    <span>Catatan Review Admin:</span>
                  </div>
                  <p>{selectedArticle.reviewNotes}</p>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Tutup
              </button>

              {(selectedArticle.status === 'draft' || selectedArticle.status === 'rejected') && (
                <button
                  onClick={() => handleSubmitForReview(selectedArticle.id, selectedArticle.title)}
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ajukan Peninjauan Sekarang</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
