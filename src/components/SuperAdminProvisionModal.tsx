import React, { useState } from 'react';
import { X, ShieldAlert, KeyRound, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { api } from '../services/api.ts';

interface SuperAdminProvisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const SuperAdminProvisionModal: React.FC<SuperAdminProvisionModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [setupKey, setSetupKey] = useState('');
  const [adminUsername, setAdminUsername] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminFullName, setAdminFullName] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!setupKey || !adminUsername || !adminEmail || !adminPassword) {
      setErrorMsg('Mohon isi seluruh kolom wajib.');
      return;
    }

    if (adminPassword.length < 8) {
      setErrorMsg('Kata sandi Super Admin minimal 8 karakter.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.provisionSuperAdmin({
        setupKey,
        adminUsername,
        adminEmail,
        adminFullName: adminFullName || 'Super Administrator SMAN 1 Julok',
        adminPassword
      });

      if (res.success) {
        setSuccessMsg(true);
      } else {
        setErrorMsg(res.error || 'Provisi gagal. Periksa kembali kunci master sistem.');
      }
    } catch {
      setErrorMsg('Terjadi kendala jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/30 text-purple-400 flex items-center justify-center border border-purple-400/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm">Provisi Akun Super Admin Awal</p>
              <p className="text-[11px] text-slate-400">Sistem Inisialisasi Root Administratif (Non-Publik)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          
          {successMsg ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Super Admin Berhasil Diprovisi!</h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                Akun telah didaftarkan dengan tingkat kewenangan Super Admin penuh dan dicatat dalam audit trail keamanan.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onSuccess();
                }}
                className="w-full py-2.5 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs"
              >
                Lanjutkan ke Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 leading-relaxed">
                Sesuai standar keamanan, akun Super Admin dibuat melalui proses provisi aman berdasar kunci master, bukan melalui formulir registrasi publik.
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kunci Provisi Master (Master Provision Key) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Kunci master server (Default: JULOK_SECURE_INIT_2026)"
                  value={setupKey}
                  onChange={(e) => setSetupKey(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white font-mono"
                />
                <button
                  type="button"
                  onClick={() => setSetupKey('JULOK_SECURE_INIT_2026')}
                  className="text-[10px] text-purple-700 hover:underline mt-1 block"
                >
                  Gunakan kunci master default evaluasi
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Username Super Admin *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: superadmin_root"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Resmi *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="root@sman1julok.sch.id"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Penanggung Jawab
                </label>
                <input
                  type="text"
                  placeholder="Nama Lengkap Administrator Sistem"
                  value={adminFullName}
                  onChange={(e) => setAdminFullName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Baru Super Admin *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimal 8 karakter kuat"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-600 focus:bg-white"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-5 py-2 text-xs font-bold text-white bg-purple-900 hover:bg-purple-800 rounded-lg shadow-sm"
                >
                  {isLoading ? 'Memprovisi...' : 'Provisi Super Admin'}
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
