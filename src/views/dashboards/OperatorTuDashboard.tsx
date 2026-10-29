import React, { useState } from 'react';
import { 
  Building2, 
  FileCheck, 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Save, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { User, SpmbRegistration, DatabaseSchema } from '../../types/index.ts';
import { api } from '../../services/api.ts';

interface OperatorTuDashboardProps {
  currentUser: User;
  data: DatabaseSchema;
  onRefresh: (fresh: DatabaseSchema) => void;
  onNavigate: (view: string) => void;
}

export const OperatorTuDashboard: React.FC<OperatorTuDashboardProps> = ({
  currentUser,
  data,
  onRefresh,
  onNavigate
}) => {
  const [spmbList, setSpmbList] = useState<SpmbRegistration[]>(data.spmb || []);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplicant, setSelectedApplicant] = useState<SpmbRegistration | null>(null);
  const [statusDraft, setStatusDraft] = useState<SpmbRegistration['status']>('Berkas Diterima');
  const [notesDraft, setNotesDraft] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSelectApplicant = (app: SpmbRegistration) => {
    setSelectedApplicant(app);
    setStatusDraft(app.status);
    setNotesDraft(app.notes || '');
  };

  const handleUpdateStatus = async () => {
    if (!selectedApplicant) return;
    setIsUpdating(true);
    try {
      await api.updateSpmbStatus(selectedApplicant.id, statusDraft, notesDraft);
      
      const updatedList = spmbList.map(item => 
        item.id === selectedApplicant.id 
          ? { ...item, status: statusDraft, notes: notesDraft }
          : item
      );
      setSpmbList(updatedList);
      setSelectedApplicant({ ...selectedApplicant, status: statusDraft, notes: notesDraft });
      showToast(`Status pendaftar ${selectedApplicant.fullName} diperbarui menjadi '${statusDraft}'.`);
      onRefresh({ ...data, spmb: updatedList });
    } catch (err: any) {
      showToast(err.message || 'Gagal memperbarui status pendaftar.', 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredApplicants = spmbList.filter(app => {
    const matchesStatus = filterStatus === 'all' || app.status === filterStatus;
    const matchesSearch = 
      app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.originSchool.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.nisn.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

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
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 mb-1">
              <Building2 className="w-4 h-4" />
              <span>DASHBOARD OPERATOR DAPODIK & TATA USAHA</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-600">Verifikasi SPMB & Data Induk</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Selamat Bertugas, {currentUser.fullName}
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Kelola verifikasi berkas calon peserta didik baru (SPMB), sinkronisasi data Dapodik Kemendikbudristek, dan administrasi siswa.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/api/spmb/export"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ekspor CSV Laporan SPMB</span>
            </a>

            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-900 rounded-lg text-xs font-semibold border border-sky-200">
              <ShieldCheck className="w-4 h-4 text-sky-700" />
              <span>Operator Dapodik / TU Terotentikasi</span>
            </span>
          </div>
        </div>

        {/* Sync Status Bar */}
        <div className="mt-5 p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700">Status Server Dapodik:</span>
            <span className="text-emerald-700 font-bold">Tersinkronisasi Online</span>
          </div>
          <div className="text-slate-500">
            Kuota Aktif: <strong>196 Siswa</strong> (Zonasi: 120 · Prestasi: 36 · Afirmasi: 30 · Pindah: 10)
          </div>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Total Pendaftar SPMB</div>
          <div className="text-2xl font-bold text-slate-900 mt-1">{spmbList.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-sky-200 bg-sky-50/30 shadow-sm">
          <div className="text-xs text-sky-700 font-medium">Berkas Diterima (Review)</div>
          <div className="text-2xl font-bold text-sky-900 mt-1">
            {spmbList.filter(s => s.status === 'Berkas Diterima').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
          <div className="text-xs text-emerald-700 font-medium">Lulus Seleksi</div>
          <div className="text-2xl font-bold text-emerald-900 mt-1">
            {spmbList.filter(s => s.status === 'Lulus Seleksi').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-amber-200 bg-amber-50/30 shadow-sm">
          <div className="text-xs text-amber-700 font-medium">Cadangan</div>
          <div className="text-2xl font-bold text-amber-900 mt-1">
            {spmbList.filter(s => s.status === 'Cadangan').length}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Applicants List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Antrean Verifikasi Pendaftar SPMB
            </h2>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-white text-slate-700 font-medium"
              >
                <option value="all">Semua Status</option>
                <option value="Berkas Diterima">Berkas Diterima</option>
                <option value="Lulus Seleksi">Lulus Seleksi</option>
                <option value="Cadangan">Cadangan</option>
                <option value="Tidak Lulus">Tidak Lulus</option>
              </select>

              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama/NISN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-2 py-1 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredApplicants.map((app) => (
              <div
                key={app.id}
                onClick={() => handleSelectApplicant(app)}
                className={`p-4 transition-colors cursor-pointer hover:bg-slate-50/80 ${
                  selectedApplicant?.id === app.id ? 'bg-sky-50/60 border-l-4 border-sky-800' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-sky-900 bg-sky-100/60 px-2 py-0.5 rounded">
                        {app.registrationNumber}
                      </span>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-600 font-medium">Jalur: {app.chosenPathway}</span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-900">{app.fullName}</h4>

                    <div className="text-xs text-slate-500 flex flex-wrap items-center gap-2">
                      <span>NISN: {app.nisn}</span>
                      <span>·</span>
                      <span>Asal: {app.originSchool}</span>
                      <span>·</span>
                      <span>Rerata Nilai: <strong>{app.averageScore}</strong></span>
                    </div>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    app.status === 'Lulus Seleksi' ? 'bg-emerald-100 text-emerald-800' :
                    app.status === 'Berkas Diterima' ? 'bg-sky-100 text-sky-800' :
                    app.status === 'Cadangan' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Detail & Verification Panel */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-sky-800" />
            <span>Formulir Putusan Verifikasi</span>
          </h3>

          {selectedApplicant ? (
            <div className="space-y-4">
              <div>
                <div className="text-[11px] text-slate-400">Nama Calon Murid</div>
                <div className="font-bold text-slate-900 text-sm">{selectedApplicant.fullName}</div>
                <div className="text-xs text-slate-500 font-mono">No. Reg: {selectedApplicant.registrationNumber}</div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[10px]">Kontak Orang Tua</div>
                  <div className="font-semibold text-slate-800">{selectedApplicant.parentPhone}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                  <div className="text-slate-400 text-[10px]">Email</div>
                  <div className="font-semibold text-slate-800 truncate">{selectedApplicant.email}</div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Keputusan Verifikasi Panitia
                </label>
                <select
                  value={statusDraft}
                  onChange={(e) => setStatusDraft(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white font-semibold text-slate-800 focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Berkas Diterima">Berkas Diterima (Dalam Evaluasi)</option>
                  <option value="Lulus Seleksi">Lulus Seleksi (Diterima Resmi)</option>
                  <option value="Cadangan">Cadangan (Menunggu Kuota)</option>
                  <option value="Tidak Lulus">Tidak Memenuhi Syarat</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Panitia Penerimaan
                </label>
                <textarea
                  rows={4}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Instruksi daftar ulang, jadwal wawancara, atau berkas yang perlu dilengkapi..."
                  className="w-full p-2.5 text-xs border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-sky-900 hover:bg-sky-800 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isUpdating ? 'Memproses...' : 'Simpan Putusan SPMB'}</span>
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              Pilih pendaftar dari antrean untuk meninjau berkas dan memperbarui status penerimaan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
