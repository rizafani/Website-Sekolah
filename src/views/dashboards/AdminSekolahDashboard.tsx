import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Send, 
  FileText, 
  Clock, 
  Users, 
  Award, 
  Sparkles, 
  AlertCircle, 
  Eye, 
  ArrowRight,
  ExternalLink 
} from 'lucide-react';
import { User, EditorialArticle, DatabaseSchema } from '../../types/index.ts';
import { api } from '../../services/api.ts';

interface AdminSekolahDashboardProps {
  currentUser: User;
  data: DatabaseSchema;
  onRefresh: (fresh: DatabaseSchema) => void;
  onNavigate: (view: string) => void;
}

export const AdminSekolahDashboard: React.FC<AdminSekolahDashboardProps> = ({
  currentUser,
  data,
  onRefresh,
  onNavigate
}) => {
  const [articles, setArticles] = useState<EditorialArticle[]>(data.articles || []);
  const [selectedArticle, setSelectedArticle] = useState<EditorialArticle | null>(null);
  const [rejectNotes, setRejectNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    api.fetchEditorialArticles().then(res => setArticles(res)).catch(() => {});
  }, []);

  const pendingArticles = articles.filter(a => a.status === 'pending_approval');
  const approvedArticles = articles.filter(a => a.status === 'approved');
  const publishedArticles = articles.filter(a => a.status === 'published');

  const handleApprove = async (articleId: string) => {
    setIsProcessing(true);
    try {
      const updated = await api.approveArticle(articleId, 'Disetujui oleh Kepala Sekolah / Admin Sekolah.');
      setArticles(articles.map(a => a.id === updated.id ? updated : a));
      setSelectedArticle(null);
      showToast(`Artikel '${updated.title}' disetujui untuk publikasi.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal menyetujui artikel.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (articleId: string) => {
    if (!rejectNotes.trim()) {
      showToast('Harap sertakan catatan revisi untuk editor.', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const updated = await api.rejectArticle(articleId, rejectNotes);
      setArticles(articles.map(a => a.id === updated.id ? updated : a));
      setSelectedArticle(null);
      setRejectNotes('');
      showToast(`Artikel dikembalikan ke Editor dengan catatan revisi.`);
    } catch (err: any) {
      showToast(err.message || 'Gagal mengembalikan artikel.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePublish = async (articleId: string) => {
    setIsProcessing(true);
    try {
      const updated = await api.publishArticle(articleId);
      setArticles(articles.map(a => a.id === updated.id ? updated : a));
      setSelectedArticle(null);
      showToast(`Artikel '${updated.title}' resmi terbit pada website publik!`);
    } catch (err: any) {
      showToast(err.message || 'Gagal mempublikasikan artikel.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-emerald-950 text-emerald-100 border-emerald-800' : 'bg-rose-950 text-rose-100 border-rose-800'
        }`}>
          {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
          <span>{toast.msg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-400">
              <span>PORTAL ADMIN SEKOLAH</span>
              <span aria-hidden="true">·</span>
              <span>Kepala Sekolah & Manajemen</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white mt-0.5">
              Persetujuan Publikasi & Pengawasan Akademik
            </h1>
            <p className="text-xs text-slate-400">
              Masuk sebagai: <strong>{currentUser.fullName}</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('beranda')}
          className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors flex items-center gap-1.5"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Lihat Website Publik</span>
        </button>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Menunggu Persetujuan</span>
          <p className="text-2xl font-black text-amber-700 tabular-nums">{pendingArticles.length}</p>
          <p className="text-[11px] text-slate-500">Antrean review dari Editor</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Siap Diterbitkan</span>
          <p className="text-2xl font-black text-sky-800 tabular-nums">{approvedArticles.length}</p>
          <p className="text-[11px] text-slate-500">Telah disetujui</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Artikel Terbit</span>
          <p className="text-2xl font-black text-emerald-800 tabular-nums">{publishedArticles.length}</p>
          <p className="text-[11px] text-slate-500">Aktif di halaman Berita</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1">
          <span className="text-xs text-slate-500 font-medium">Calon Siswa SPMB</span>
          <p className="text-2xl font-black text-purple-900 tabular-nums">{data.spmb.length}</p>
          <p className="text-[11px] text-slate-500">Berkas terverifikasi TU</p>
        </div>
      </div>

      {/* Editorial Approval Queue */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Antrean Persetujuan Artikel Redaksi</h2>
            <p className="text-xs text-slate-500">Sesuai alur editorial: Editor menyusun draf → Admin Sekolah meninjau & menyetujui.</p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
            {pendingArticles.length} Perlu Tindakan
          </span>
        </div>

        {pendingArticles.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-xs space-y-1">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 opacity-60 mb-2" />
            <p className="font-semibold text-slate-700">Semua artikel telah ditinjau!</p>
            <p>Tidak ada draf yang sedang menunggu persetujuan pimpinan saat ini.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingArticles.map(art => (
              <div key={art.id} className="p-5 rounded-xl border border-amber-200 bg-amber-50/20 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-bold text-sky-800">{art.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>Penulis: {art.authorName}</span>
                      <span aria-hidden="true">·</span>
                      <span>Diajukan: {new Date(art.updatedAt).toLocaleDateString('id-ID')}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mt-1">{art.title}</h3>
                  </div>

                  <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md self-start sm:self-auto">
                    Menunggu Persetujuan
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {art.excerpt}
                </p>

                {/* Review Action Controls */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-amber-200/60">
                  <button
                    onClick={() => setSelectedArticle(selectedArticle?.id === art.id ? null : art)}
                    className="text-xs text-sky-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{selectedArticle?.id === art.id ? 'Tutup Tinjauan' : 'Baca Teks Lengkap & Evaluasi'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleReject(art.id)}
                      disabled={isProcessing}
                      className="px-3 py-1.5 rounded-lg border border-rose-300 text-rose-800 hover:bg-rose-50 text-xs font-semibold cursor-pointer"
                    >
                      Kembalikan (Minta Revisi)
                    </button>
                    <button
                      onClick={() => handleApprove(art.id)}
                      disabled={isProcessing}
                      className="px-4 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      Setujui Artikel
                    </button>
                    <button
                      onClick={() => handlePublish(art.id)}
                      disabled={isProcessing}
                      className="px-4 py-1.5 rounded-lg bg-sky-900 hover:bg-sky-800 text-white text-xs font-semibold cursor-pointer shadow-2xs"
                    >
                      Setujui & Terbitkan Langsung
                    </button>
                  </div>
                </div>

                {/* Expanded Review Panel */}
                {selectedArticle?.id === art.id && (
                  <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 mt-3 animate-in fade-in">
                    <h4 className="text-xs font-bold text-slate-900 uppercase">Konten Naskah Lengkap:</h4>
                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-3 rounded-lg">
                      {art.content}
                    </p>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Catatan Evaluasi / Instruksi Revisi (Jika Dikembalikan):
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Mohon perbaiki kutipan narasumber..."
                        value={rejectNotes}
                        onChange={(e) => setRejectNotes(e.target.value)}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved articles waiting for publish */}
      {approvedArticles.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Artikel Disetujui (Siap Diterbitkan ke Website)
          </h2>
          <div className="space-y-3">
            {approvedArticles.map(art => (
              <div key={art.id} className="p-4 rounded-xl border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{art.title}</h3>
                  <p className="text-xs text-slate-500">Penulis: {art.authorName} · Status: Disetujui</p>
                </div>
                <button
                  onClick={() => handlePublish(art.id)}
                  className="px-4 py-2 bg-sky-900 hover:bg-sky-800 text-white text-xs font-bold rounded-lg shrink-0 cursor-pointer"
                >
                  Terbitkan ke Publik
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
