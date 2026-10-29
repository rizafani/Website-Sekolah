import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User as UserIcon, 
  ArrowRight, 
  AlertCircle, 
  ShieldCheck, 
  KeyRound, 
  CheckCircle2, 
  Sparkles, 
  Globe 
} from 'lucide-react';
import { api } from '../services/api.ts';
import { User, PermissionKey } from '../types/index.ts';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, permissions: PermissionKey[]) => void;
  onOpenForgotPassword: () => void;
  onOpenProvisioning: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenForgotPassword,
  onOpenProvisioning
}) => {
  const [authMethod, setAuthMethod] = useState<'credentials' | 'google'>('credentials');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!identifier || !password) {
      setErrorMsg('Mohon masukkan email/username dan kata sandi.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.login(identifier, password);
      if (res.success && res.user && res.permissions) {
        onLoginSuccess(res.user, res.permissions);
        onClose();
      } else {
        setErrorMsg(res.error || 'Login gagal.');
      }
    } catch {
      setErrorMsg('Terjadi kendala jaringan saat menghubungi server autentikasi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoRole = (uname: string, pwd: string = 'Password123!') => {
    setIdentifier(uname);
    setPassword(pwd);
    setErrorMsg('');
  };

  const handleGoogleLogin = async (email: string, fullName: string) => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await api.loginWithGoogle(email, fullName);
      if (res.success && res.user && res.permissions) {
        onLoginSuccess(res.user, res.permissions);
        onClose();
      } else {
        setErrorMsg(res.error || 'Login Google gagal.');
      }
    } catch {
      setErrorMsg('Gagal memproses sesi Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-600/30 text-sky-400 flex items-center justify-center border border-sky-400/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm">Masuk Portal Terpadu SMAN 1 Julok</p>
              <p className="text-[11px] text-slate-400">Sistem Autentikasi & Role-Based Access Control (RBAC)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* Method Segmented Control */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setAuthMethod('credentials')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                authMethod === 'credentials' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Email / Akun Resmi
            </button>
            <button
              onClick={() => setAuthMethod('google')}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                authMethod === 'google' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Google Workspace SSO
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <span>{errorMsg}</span>
              </div>
            </div>
          )}

          {authMethod === 'credentials' ? (
            <form onSubmit={handleCredentialsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email atau Nama Pengguna (Username) *
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Contoh: superadmin / guru.biologi / siswa.rayhan"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Kata Sandi (Password) *
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenForgotPassword();
                    }}
                    className="text-[11px] text-sky-800 hover:text-sky-950 font-semibold cursor-pointer"
                  >
                    Lupa Password?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="Masukkan kata sandi..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
              >
                <span>{isLoading ? 'Memverifikasi Kredensial...' : 'Masuk Sekarang'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            /* Google Login Simulation / Single Sign-On */
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed text-center">
                Pilih akun Google Workspace madrasah/sekolah Anda untuk masuk tanpa kata sandi:
              </p>

              <div className="space-y-2">
                {[
                  { email: 'kepsek@sman1julok.sch.id', name: 'Drs. T. Muhammad Yusuf, M.Pd.', role: 'Admin Sekolah' },
                  { email: 'nurul.guru@sman1julok.sch.id', name: 'Nurul Hidayati, S.Pd., M.Si.', role: 'Guru Biologi' },
                  { email: 'rayhan.siswa@sman1julok.sch.id', name: 'Muhammad Rayhan', role: 'Siswa XI MIPA' },
                ].map((gUser, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGoogleLogin(gUser.email, gUser.name)}
                    className="w-full p-3 rounded-xl border border-slate-200 hover:border-sky-300 hover:bg-sky-50/50 transition-all text-left flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                        {gUser.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">{gUser.name}</p>
                        <p className="text-[11px] text-slate-500 font-mono">{gUser.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-sky-800 bg-sky-50 px-2 py-0.5 rounded">
                      {gUser.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Demo Role Switcher for Evaluator */}
          <div className="pt-4 border-t border-slate-100 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Uji Coba Cepat Role Pengguna (Evaluasi RBAC)</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Pass: Password123!</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: '👑 Super Admin', uname: 'superadmin', color: 'hover:border-purple-300 hover:bg-purple-50/60' },
                { label: '🏛️ Admin Sekolah', uname: 'admin.sekolah', color: 'hover:border-sky-300 hover:bg-sky-50/60' },
                { label: '✍️ Editor Konten', uname: 'editor.redaksi', color: 'hover:border-emerald-300 hover:bg-emerald-50/60' },
                { label: '👨‍🏫 Dewan Guru', uname: 'guru.biologi', color: 'hover:border-amber-300 hover:bg-amber-50/60' },
                { label: '🎓 Siswa (Privat)', uname: 'siswa.rayhan', color: 'hover:border-blue-300 hover:bg-blue-50/60' },
                { label: '📋 Operator TU', uname: 'operator.dapodik', color: 'hover:border-teal-300 hover:bg-teal-50/60' },
              ].map((roleItem, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickDemoRole(roleItem.uname)}
                  className={`p-2 rounded-lg border border-slate-200 text-left text-xs transition-colors cursor-pointer ${roleItem.color}`}
                >
                  <p className="font-bold text-slate-900 leading-tight">{roleItem.label}</p>
                  <p className="text-[10px] text-slate-500 font-mono truncate">{roleItem.uname}</p>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Terkunci otomatis setelah 5 kali gagal login</span>
          <button
            onClick={() => {
              onClose();
              onOpenProvisioning();
            }}
            className="text-sky-800 hover:underline font-medium"
          >
            Provisi Super Admin
          </button>
        </div>

      </div>
    </div>
  );
};
