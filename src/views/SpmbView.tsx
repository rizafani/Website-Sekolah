import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  Search, 
  AlertCircle, 
  ShieldCheck, 
  Send, 
  Printer, 
  HelpCircle 
} from 'lucide-react';
import { api } from '../services/api.ts';
import { SpmbRegistration } from '../types/index.ts';

interface SpmbViewProps {
  existingRegistrations: SpmbRegistration[];
  onRegistrationAdded: (reg: SpmbRegistration) => void;
}

export const SpmbView: React.FC<SpmbViewProps> = ({ existingRegistrations, onRegistrationAdded }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'daftar' | 'status'>('info');

  // Form State
  const [fullName, setFullName] = useState('');
  const [nisn, setNisn] = useState('');
  const [nik, setNik] = useState('');
  const [birthPlace, setBirthPlace] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [originSchool, setOriginSchool] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [email, setEmail] = useState('');
  const [chosenPathway, setChosenPathway] = useState<SpmbRegistration['chosenPathway']>('Zonasi');
  const [averageScore, setAverageScore] = useState<string>('85.0');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReg, setSubmittedReg] = useState<SpmbRegistration | null>(null);
  const [formError, setFormError] = useState('');

  // Status Check State
  const [queryCode, setQueryCode] = useState('');
  const [searchResult, setSearchResult] = useState<SpmbRegistration | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!fullName || !nisn || !nik || !originSchool || !parentName || !parentPhone) {
      setFormError('Mohon lengkapi seluruh kolom formulir wajib yang bertanda bintang (*)');
      return;
    }

    if (nisn.length < 10) {
      setFormError('NISN harus terdiri dari minimal 10 digit angka resmi');
      return;
    }

    setIsSubmitting(true);
    try {
      const newReg = await api.submitSpmb({
        fullName,
        nisn,
        nik,
        birthPlace: birthPlace || 'Julok',
        birthDate: birthDate || '2009-01-01',
        gender,
        originSchool,
        parentName,
        parentPhone,
        email: email || `${nisn}@siswa.sman1julok.sch.id`,
        chosenPathway,
        averageScore: parseFloat(averageScore) || 85,
        notes: `Pendaftaran online mandiri jalur ${chosenPathway}. Berkas digital terunggah.`
      });

      setSubmittedReg(newReg);
      onRegistrationAdded(newReg);
    } catch (err) {
      setFormError('Terjadi kendala saat mengirim data. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchStatus = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const q = queryCode.trim().toLowerCase();
    if (!q) {
      setSearchResult(null);
      return;
    }

    const found = existingRegistrations.find(
      r => r.registrationNumber.toLowerCase() === q || r.nisn.toLowerCase() === q
    );
    setSearchResult(found || null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="border-b border-slate-200 pb-6 space-y-2">
        <div className="text-xs font-semibold text-sky-800 uppercase tracking-wider">
          Penerimaan Siswa Baru
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Penerimaan Murid Baru (SPMB Online)
        </h1>
        <p className="text-sm text-slate-600">
          Portal pendaftaran resmi dan verifikasi status calon peserta didik baru SMA Negeri 1 Julok tahun ajaran baru.
        </p>
      </div>

      {/* Primary Tab Navigation */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-fit">
        <button
          onClick={() => setActiveTab('info')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'info' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Informasi & Jalur Pendaftaran
        </button>
        <button
          onClick={() => setActiveTab('daftar')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'daftar' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Formulir Pendaftaran Online
        </button>
        <button
          onClick={() => setActiveTab('status')}
          className={`px-4 py-2 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'status' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Cek Status Pendaftaran
        </button>
      </div>

      {/* TAB 1: INFORMASI JALUR, JADWAL, SYARAT */}
      {activeTab === 'info' && (
        <div className="space-y-8">
          
          {/* Jalur Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">Kuota Terbanyak (55%)</span>
              <h3 className="text-lg font-bold text-slate-900">1. Jalur Zonasi</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Diperuntukkan bagi calon murid yang berdomisili di dalam wilayah zonasi yang ditetapkan Dinas Pendidikan Aceh, mengutamakan radius jarak tempat tinggal terdekat dari kampus di Desa Buket Seuraja.
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                Syarat: Kartu Keluarga (KK) diterbitkan minimal 1 tahun sebelum tanggal pendaftaran.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Kuota Prestasi (20%)</span>
              <h3 className="text-lg font-bold text-slate-900">2. Jalur Prestasi</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Diperuntukkan bagi siswa yang memiliki nilai rapor rata-rata tinggi (akademik) atau sertifikat juara lomba OSN, O2SN, FLS2N, MTQ, dan tahfidz Quran minimal tingkat kabupaten.
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                Syarat: Buku rapor SMP/MTs semester 1-5 atau sertifikat juara resmi.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Kuota Bantuan (20%)</span>
              <h3 className="text-lg font-bold text-slate-900">3. Jalur Afirmasi</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bagi calon peserta didik baru dari keluarga ekonomi tidak mampu serta penyandang disabilitas ringan yang bertekad melanjutkan pendidikan menengah atas.
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                Syarat: Kartu Indonesia Pintar (KIP), PKH, atau terdaftar di DTKS Kemensos.
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">Kuota Mutasi (5%)</span>
              <h3 className="text-lg font-bold text-slate-900">4. Jalur Perpindahan Orang Tua</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Bagi calon murid yang mengikuti perpindahan tugas kedinasan orang tua/wali (TNI, Polri, ASN, BUMN) atau bagi anak kandung guru pengajar di SMAN 1 Julok.
              </p>
              <div className="text-xs text-slate-500 pt-2 border-t border-slate-100">
                Syarat: Surat penugasan mutasi dari instansi atau lembaga pemberi kerja.
              </div>
            </div>
          </div>

          {/* Timeline Jadwal */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Jadwal Tahapan SPMB</h2>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex flex-col sm:flex-row justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-900">1. Pendaftaran Online Mandiri & Pengisian Berkas</span>
                <span className="text-sky-800 font-medium">10 - 25 Mei 2027</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-900">2. Verifikasi Berkas Fisik & Keabsahan Sertifikat</span>
                <span className="text-sky-800 font-medium">26 - 29 Mei 2027</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-900">3. Pengumuman Kelulusan Hasil Seleksi</span>
                <span className="text-emerald-700 font-bold">2 Juni 2027</span>
              </div>
              <div className="flex flex-col sm:flex-row justify-between p-3 bg-slate-50 rounded-xl">
                <span className="font-semibold text-slate-900">4. Daftar Ulang Peserta Didik Baru</span>
                <span className="text-sky-800 font-medium">5 - 8 Juni 2027</span>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={() => setActiveTab('daftar')}
                className="px-6 py-3 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
              >
                Mulai Isi Formulir Pendaftaran Sekarang
              </button>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: FORMULIR PENDAFTARAN */}
      {activeTab === 'daftar' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-8">
          
          {submittedReg ? (
            /* Success confirmation card */
            <div className="p-8 text-center space-y-4 max-w-lg mx-auto">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Pendaftaran Berhasil Dikirim!</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Data calon peserta didik baru telah tersimpan di sistem seleksi SMA Negeri 1 Julok. Simpan nomor pendaftaran berikut untuk memantau status berkas Anda.
              </p>
              
              <div className="p-4 bg-sky-50 rounded-xl border border-sky-100 text-left space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Nomor Registrasi:</span>
                  <span className="font-mono font-bold text-sky-900 text-sm">{submittedReg.registrationNumber}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Nama Lengkap:</span>
                  <span className="font-bold text-slate-900">{submittedReg.fullName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">NISN:</span>
                  <span className="font-mono font-bold text-slate-900">{submittedReg.nisn}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Jalur:</span>
                  <span className="font-semibold text-slate-900">{submittedReg.chosenPathway}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Status Awal:</span>
                  <span className="font-semibold text-amber-700">{submittedReg.status}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Bukti Pendaftaran</span>
                </button>
                <button
                  onClick={() => {
                    setSubmittedReg(null);
                    setFullName('');
                    setNisn('');
                    setNik('');
                    setOriginSchool('');
                  }}
                  className="px-4 py-2 rounded-lg bg-sky-900 hover:bg-sky-800 text-xs font-semibold text-white cursor-pointer"
                >
                  Daftarkan Siswa Lain
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-lg font-bold text-slate-900">Formulir Peserta Didik Baru (SMAN 1 Julok)</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Harap mengisi identitas sesuai Akta Kelahiran dan Kartu Keluarga (KK).
                </p>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Data Calon Siswa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Siswa *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Muhammad Furqan"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NISN (Nomor Induk Siswa Nasional) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="10 digit nomor NISN"
                    value={nisn}
                    onChange={(e) => setNisn(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    NIK (Nomor Induk Kependudukan) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={16}
                    placeholder="16 digit sesuai KK / KTP anak"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tempat Lahir
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Julok / Idi"
                    value={birthPlace}
                    onChange={(e) => setBirthPlace(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Asal Sekolah (SMP / MTs) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: SMPN 1 Julok / MTsS Buket Seuraja"
                    value={originSchool}
                    onChange={(e) => setOriginSchool(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jalur Pilihan *
                  </label>
                  <select
                    value={chosenPathway}
                    onChange={(e) => setChosenPathway(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white font-semibold"
                  >
                    <option value="Zonasi">Jalur Zonasi (Domisili Terdekat)</option>
                    <option value="Prestasi Akademik">Jalur Prestasi Akademik & Nilai Rapor</option>
                    <option value="Afirmasi">Jalur Afirmasi (KIP / PKH / DTKS)</option>
                    <option value="Perpindahan Tugas Orang Tua">Jalur Perpindahan Tugas Orang Tua</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nilai Rata-rata Rapor (Skala 0-100)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="60"
                    max="100"
                    value={averageScore}
                    onChange={(e) => setAverageScore(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Orang Tua / Wali *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nama ayah / ibu / wali murid"
                    value={parentName}
                    onChange={(e) => setParentName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP Orang Tua *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 08126900xxxx"
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Data Anda tersimpan secara aman dalam basis data SMAN 1 Julok.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-sky-900 hover:bg-sky-800 text-white font-bold text-xs transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Mengirim Formulir...' : 'Kirim Pendaftaran'}</span>
                </button>
              </div>

            </form>
          )}

        </div>
      )}

      {/* TAB 3: CEK STATUS PENDAFTARAN */}
      {activeTab === 'status' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
          
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">Cek Status Hasil Seleksi SPMB</h2>
            <p className="text-xs text-slate-500 mt-1">
              Masukkan Nomor Registrasi (contoh: SPMB-2026-001) atau 10 digit NISN Anda untuk melihat status verifikasi.
            </p>
          </div>

          <form onSubmit={handleSearchStatus} className="flex gap-2 max-w-md">
            <input
              type="text"
              placeholder="Nomor Registrasi atau NISN..."
              value={queryCode}
              onChange={(e) => setQueryCode(e.target.value)}
              className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-600 focus:bg-white font-mono"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-sky-900 hover:bg-sky-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Cari</span>
            </button>
          </form>

          {searched && (
            <div className="pt-2">
              {searchResult ? (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 max-w-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {searchResult.registrationNumber}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      searchResult.status === 'Lulus Seleksi' ? 'bg-emerald-100 text-emerald-800' :
                      searchResult.status === 'Berkas Diterima' ? 'bg-sky-100 text-sky-800' :
                      searchResult.status === 'Cadangan' ? 'bg-amber-100 text-amber-800' :
                      'bg-slate-200 text-slate-800'
                    }`}>
                      {searchResult.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900">{searchResult.fullName}</h3>
                    <p className="text-xs text-slate-500">NISN: {searchResult.nisn} · Asal: {searchResult.originSchool}</p>
                    <p className="text-xs text-sky-800 font-semibold mt-1">Jalur: {searchResult.chosenPathway}</p>
                  </div>

                  {searchResult.notes && (
                    <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600">
                      <strong className="text-slate-900 block mb-0.5">Catatan Panitia:</strong>
                      {searchResult.notes}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                  <p className="font-bold">Data Tidak Ditemukan</p>
                  <p>Tidak ada pendaftar dengan nomor registrasi atau NISN "{queryCode}". Pastikan nomor yang dimasukkan sudah benar.</p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
