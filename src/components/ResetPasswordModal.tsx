import React, { useState } from 'react';
import { X, KeyRound, Mail, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { api } from '../services/api.ts';

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirectLogin: () => void;
}

export const ResetPasswordModal: React.FC<ResetPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccessRedirectLogin
}) => {
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [demoCodeHint, setDemoCodeHint] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) {
      setErrorMsg('Masukkan alamat email terdaftar Anda.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.forgotPassword(email);
      if (res.success) {
        setInfoMsg(res.message);
        if (res.debugSecurityCode) {
          setDemoCodeHint(res.debugSecurityCode);
          setCode(res.debugSecurityCode);
        }
        setStep('reset');
      } else {
        setErrorMsg(res.error || 'Gagal mengirim kode reset.');
      }
    } catch {
      setErrorMsg('Kendala jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!code || !newPassword) {
      setErrorMsg('Mohon isi kode verifikasi dan kata sandi baru.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Kata sandi baru minimal harus 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.resetPassword(email, code, newPassword);
      if (res.success) {
        setStep('success');
      } else {
        setErrorMsg(res.error || 'Reset kata sandi gagal.');
      }
    } catch {
      setErrorMsg('Terjadi kendala jaringan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600/30 text-amber-400 flex items-center justify-center border border-amber-400/30">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-sm">Pemulihan Kata Sandi</p>
              <p className="text-[11px] text-slate-400">Verifikasi Keamanan Akun SMAN 1 Julok</p>
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
          
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'request' && (
            <form onSubmit={handleRequestCode} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Masukkan alamat email resmi Anda yang terdaftar pada sistem SMA Negeri 1 Julok. Kami akan menerbitkan kode verifikasi keamanan 6-digit.
              </p>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email Terdaftar *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama@sman1julok.sch.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <p className="font-semibold text-slate-700">Contoh Email Akun Demo:</p>
                <p className="font-mono">superadmin@sman1julok.sch.id</p>
                <p className="font-mono">nurul.guru@sman1julok.sch.id</p>
                <p className="font-mono">rayhan.siswa@sman1julok.sch.id</p>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{isLoading ? 'Mengirim...' : 'Kirim Kode Verifikasi'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          {step === 'reset' && (
            <form onSubmit={handleResetSubmit} className="space-y-4">
              {infoMsg && (
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-800">
                  {infoMsg}
                </div>
              )}

              {demoCodeHint && (
                <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 font-mono">
                  Kode verifikasi uji coba: <strong>{demoCodeHint}</strong>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kode Verifikasi 6-Digit *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Contoh: 123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none font-mono tracking-widest text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kata Sandi Baru (Min. 8 Karakter) *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Masukkan kata sandi baru..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Konfirmasi Kata Sandi Baru *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Ulangi kata sandi baru..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('request')}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2 text-xs font-bold text-white bg-sky-900 hover:bg-sky-800 rounded-lg shadow-sm"
                >
                  {isLoading ? 'Menyimpan...' : 'Perbarui Kata Sandi'}
                </button>
              </div>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-base font-bold text-slate-900">Kata Sandi Berhasil Diperbarui!</p>
              <p className="text-xs text-slate-600 leading-relaxed">
                Kata sandi baru Anda telah aktif pada sistem SMA Negeri 1 Julok. Silakan gunakan untuk login kembali.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onSuccessRedirectLogin();
                }}
                className="w-full py-2.5 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs"
              >
                Masuk ke Akun Sekarang
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
