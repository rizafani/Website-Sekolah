import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { SchoolSettings, ContactMessage } from '../types/index.ts';
import { api } from '../services/api.ts';

interface ContactViewProps {
  settings: SchoolSettings;
  onMessageSent: (msg: ContactMessage) => void;
}

export const ContactView: React.FC<ContactViewProps> = ({ settings, onMessageSent }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name || !email || !message) {
      setErrorMsg('Mohon isi nama, email, dan pesan Anda');
      return;
    }

    setIsSubmitting(true);
    try {
      const newMsg = await api.submitMessage({
        name,
        email,
        phone,
        subject: subject || 'Pesan Umum / Masukan',
        message
      });
      onMessageSent(newMsg);
      setSuccessMsg(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    } catch {
      setErrorMsg('Gagal mengirim pesan. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Komunikasi & Kunjungan
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Kontak & Lokasi Sekolah
        </h1>
        <p className="text-sm text-slate-600">
          Silakan hubungi bagian Tata Usaha atau kunjungi kampus SMA Negeri 1 Julok di Desa Buket Seuraja, Aceh Timur.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Contact Info & Map */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Informasi Resmi Layanan
            </h2>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sky-800 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Alamat Sekolah:</strong>
                  <span>{settings.address}, Desa {settings.village}, Kecamatan {settings.district}, Kabupaten {settings.regency}, Provinsi {settings.province} Kode Pos {settings.postalCode}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-sky-800 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Telepon / WhatsApp:</strong>
                  <a href={`tel:${settings.phone}`} className="hover:text-sky-900 font-mono">{settings.phone}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-sky-800 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Surat Elektronik (Email):</strong>
                  <a href={`mailto:${settings.email}`} className="hover:text-sky-900 font-mono">{settings.email}</a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-sky-800 shrink-0" />
                <div>
                  <strong className="text-slate-900 block font-semibold">Waktu Pelayanan TU:</strong>
                  <span>{settings.operatingHours}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Google Map Embed */}
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs h-64 bg-slate-100 relative">
            <iframe
              title="Peta Lokasi SMAN 1 Julok"
              src="https://maps.google.com/maps?q=Buket%20Seuraja,%20Julok,%20Aceh%20Timur&t=&z=14&ie=UTF8&iwloc=&output=embed"
              className="w-full h-full border-0 absolute inset-0"
              loading="lazy"
            />
          </div>
        </div>

        {/* Right Col: Feedback / Message Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Formulir Kirim Pesan & Masukan</h2>
                <p className="text-xs text-slate-500">Pesan Anda akan langsung diterima oleh Operator dan Humas SMAN 1 Julok.</p>
              </div>
            </div>

            {successMsg && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>Terima kasih! Pesan dan masukan Anda berhasil terkirim kepada manajemen sekolah.</span>
              </div>
            )}

            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Anda"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP
                  </label>
                  <input
                    type="tel"
                    placeholder="0812xxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Perihal / Subjek
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Info SPMB / Undangan / Kerjasama"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Pesan atau Masukan *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Tuliskan pertanyaan, aspirasi, saran, atau masukan Anda untuk kemajuan sekolah..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Mengirim...' : 'Kirim Pesan'}</span>
                </button>
              </div>
            </form>

          </div>
        </div>

      </div>

    </div>
  );
};
