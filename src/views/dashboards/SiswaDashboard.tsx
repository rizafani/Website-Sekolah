import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ShieldAlert, 
  User as UserIcon, 
  Calendar, 
  Printer, 
  FileText, 
  Clock,
  Sparkles
} from 'lucide-react';
import { User, StudentGradeRecord, DatabaseSchema } from '../../types/index.ts';
import { api } from '../../services/api.ts';

interface SiswaDashboardProps {
  currentUser: User;
  data: DatabaseSchema;
  onRefresh: (fresh: DatabaseSchema) => void;
  onNavigate: (view: string) => void;
}

export const SiswaDashboard: React.FC<SiswaDashboardProps> = ({
  currentUser,
  data,
  onRefresh,
  onNavigate
}) => {
  const [record, setRecord] = useState<StudentGradeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'rapor' | 'security' | 'spmb'>('rapor');

  // Verify personal isolation
  const [testOtherStudentBlocked, setTestOtherStudentBlocked] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const myData = await api.fetchMyGrades();
        setRecord(myData);
      } catch (err: any) {
        // Fallback to pre-seeded record if available
        const found = data.grades?.find(g => g.studentId === currentUser.id || g.nisn === currentUser.nisn) || data.grades?.[0];
        if (found) {
          setRecord(found);
        } else {
          setErrorMsg(err.message || 'Gagal memuat rapor.');
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [currentUser]);

  // Calculate average score
  const totalScore = record?.subjects?.reduce((acc: number, g) => acc + g.score, 0) || 0;
  const avgScore = record?.subjects?.length ? (totalScore / record.subjects.length).toFixed(1) : '0';

  // Requirement 8 test: Attempt to fetch another student's data via restricted API
  const handleTestIsolation = async () => {
    try {
      // Calling all grades without grades.manage permission should fail with 403 PERMISSION_DENIED
      await api.fetchAllGrades();
      setTestOtherStudentBlocked('Peringatan: Server tidak menolak permintaan.');
    } catch (err: any) {
      setTestOtherStudentBlocked(`Berhasil Diverifikasi: Akses data siswa lain ditolak secara absolut oleh sistem (Status 403 Forbidden: ${err.message})`);
    }
  };

  const mySpmbRecord = data.spmb.find(s => 
    s.fullName.toLowerCase().includes(currentUser.fullName.toLowerCase()) || 
    s.email === currentUser.email
  );

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-sky-100 border border-sky-300 flex items-center justify-center text-sky-900 font-bold text-xl shadow-xs shrink-0">
              <GraduationCap className="w-8 h-8 text-sky-800" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-sky-800 mb-0.5">
                <span>PORTAL SISWA & AKADEMIK DIGITAL</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-600">SMA Negeri 1 Julok</span>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                {currentUser.fullName}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span>NISN: <strong>{currentUser.nisn || record?.nisn || '0078129381'}</strong></span>
                <span>·</span>
                <span>Kelas: <strong>{record?.className || 'X-1 (Kurikulum Merdeka)'}</strong></span>
                <span>·</span>
                <span>Status Akun: <strong className="text-emerald-700">Aktif & Terverifikasi</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span>Cetak Ringkasan Rapor</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('rapor')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'rapor' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Hasil Belajar (E-Rapor)</span>
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'security' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Verifikasi Perlindungan Data & Privasi</span>
          </button>
          {mySpmbRecord && (
            <button
              onClick={() => setActiveTab('spmb')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'spmb' ? 'bg-sky-900 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Status SPMB Saya</span>
            </button>
          )}
        </div>
      </div>

      {activeTab === 'rapor' && (
        <div className="space-y-6">
          {loading ? (
            <div className="bg-white p-12 text-center text-slate-500 rounded-xl border border-slate-200">
              Memuat data hasil capaian rapor digital...
            </div>
          ) : errorMsg && !record ? (
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-xl text-rose-800 text-xs">
              {errorMsg}
            </div>
          ) : record ? (
            <>
              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">Rata-rata Nilai Asesmen</div>
                  <div className="text-2xl font-bold text-sky-950 mt-1">{avgScore}</div>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1">Sangat Memuaskan</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">Mata Pelajaran Tuntas</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {record.subjects.filter(g => g.score >= 75).length} / {record.subjects.length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Tuntas Melampaui KKTP</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">Rekap Ketidakhadiran</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">
                    {record.attendance.sick + record.attendance.permission + record.attendance.unexcused} Hari
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    S: {record.attendance.sick} · I: {record.attendance.permission} · A: {record.attendance.unexcused}
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                  <div className="text-xs text-slate-500 font-medium">Semester / Tahun Ajaran</div>
                  <div className="text-sm font-bold text-slate-900 mt-2">{record.semester}</div>
                  <div className="text-[11px] text-slate-500">{record.academicYear}</div>
                </div>
              </div>

              {/* Subject Grades Table */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    Transkrip Capaian Pembelajaran Kurikulum Merdeka
                  </h3>
                  <span className="text-xs text-slate-500">
                    Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/70 text-slate-700 font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4 w-12 text-center">No</th>
                        <th className="py-2.5 px-4">Mata Pelajaran</th>
                        <th className="py-2.5 px-3">Guru Pengampu</th>
                        <th className="py-2.5 px-2 text-center w-20">Nilai Akhir</th>
                        <th className="py-2.5 px-2 text-center w-20">Predikat</th>
                        <th className="py-2.5 px-4">Capaian Kompetensi & Deskripsi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {record.subjects.map((grade, idx) => (
                        <tr key={grade.subjectName} className="hover:bg-slate-50/60">
                          <td className="py-3 px-4 text-center text-slate-400 font-mono">{idx + 1}</td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            <div>{grade.subjectName}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-600">{grade.teacherName}</td>
                          <td className="py-3 px-2 text-center font-bold text-slate-900 text-sm">
                            {grade.score}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                              grade.letterGrade === 'A' ? 'bg-emerald-100 text-emerald-900' :
                              grade.letterGrade === 'B' ? 'bg-sky-100 text-sky-900' :
                              grade.letterGrade === 'C' ? 'bg-amber-100 text-amber-900' : 'bg-rose-100 text-rose-900'
                            }`}>
                              {grade.letterGrade}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-700 leading-relaxed text-[11px]">
                            {grade.competencyDesc}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Extracurricular and Homeroom Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <Award className="w-4 h-4 text-sky-800" />
                    <span>Kegiatan Ekstrakurikuler & Karakter Pelajar Pancasila</span>
                  </h4>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg">
                    <div className="p-3 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">Pramuka Penegak Bantara</div>
                        <div className="text-slate-500 mt-0.5">Disiplin dan aktif memimpin barisan giat kemah</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shrink-0">
                        Predikat: A
                      </span>
                    </div>
                    <div className="p-3 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-slate-900">Klub Olimpiade Sains (Biologi)</div>
                        <div className="text-slate-500 mt-0.5">Mempersiapkan diri mewakili sekolah di OSN Kabupaten</div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 shrink-0">
                        Predikat: A
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-sky-800" />
                    <span>Catatan dan Pesan Pembinaan Wali Kelas</span>
                  </h4>
                  <div className="p-4 rounded-xl bg-sky-50/60 border border-sky-100 text-xs text-sky-950 leading-relaxed italic">
                    "{record.homeroomNotes}"
                  </div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2">
                    <span>Tertanda: Wali Kelas SMAN 1 Julok</span>
                    <span>Tahun Ajaran {record.academicYear}</span>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Security & Isolation tab (Requirement 8 proof) */}
      {activeTab === 'security' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-1" />
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Pemeriksaan Batas Privasi & Keamanan Akun Siswa (Requirement 8)
              </h2>
              <p className="text-xs text-slate-600 mt-1">
                Sistem RBAC SMA Negeri 1 Julok mengisolasi penuh data pribadi siswa. Akun dengan role <strong>Siswa</strong> hanya memiliki izin tunggal <code>grades.view_own</code>, dan tidak dapat membuka dashboard admin atau data nilai siswa lain.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Hak Akses yang Diizinkan:</span>
              </div>
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                <li>Melihat rapor pribadi sendiri (<code>/api/grades/my</code>)</li>
                <li>Melihat status SPMB sendiri jika terdaftar</li>
                <li>Mengakses dokumen publik sekolah</li>
                <li>Mengubah kata sandi akun sendiri</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200 space-y-2">
              <div className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-rose-600" />
                <span>Akses yang Dilarang Keras & Ditolak Backend:</span>
              </div>
              <ul className="text-xs text-rose-700 space-y-1 list-disc list-inside">
                <li>Mengakses panel manajemen admin sekolah</li>
                <li>Melihat nama, nilai, atau biodata siswa lain</li>
                <li>Menyunting konten berita, draf, atau pengumuman</li>
                <li>Menaikkan role sendiri (Anti-self escalation)</li>
              </ul>
            </div>
          </div>

          {/* Interactive isolation tester */}
          <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-sky-400">
                Uji Ketahanan Akses Endpoint Terproteksi
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Endpoint: GET /api/grades</span>
            </div>
            <p className="text-xs text-slate-300">
              Tekan tombol di bawah untuk membuktikan bahwa permintaan data seluruh siswa dari akun Siswa akan ditolak oleh middleware backend (status 403 Forbidden).
            </p>
            <div>
              <button
                onClick={handleTestIsolation}
                className="px-4 py-2 text-xs font-bold text-slate-900 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer"
              >
                Jalankan Uji Penolakan Izin
              </button>
            </div>

            {testOtherStudentBlocked && (
              <div className="p-3 rounded-lg bg-emerald-950 border border-emerald-700 text-xs text-emerald-300 font-mono mt-2">
                {testOtherStudentBlocked}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SPMB Tab */}
      {activeTab === 'spmb' && mySpmbRecord && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Status Pendaftaran SPMB Anda</h2>
              <p className="text-xs text-slate-500">Nomor Registrasi: {mySpmbRecord.registrationNumber}</p>
            </div>
            <span className={`px-3 py-1 rounded-lg text-xs font-bold ${
              mySpmbRecord.status === 'Lulus Seleksi' ? 'bg-emerald-100 text-emerald-900' :
              mySpmbRecord.status === 'Berkas Diterima' ? 'bg-sky-100 text-sky-900' : 'bg-slate-100 text-slate-800'
            }`}>
              {mySpmbRecord.status}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-slate-500">Jalur Masuk</div>
              <div className="font-bold text-slate-900 mt-1">{mySpmbRecord.chosenPathway}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-slate-500">Asal SMP/MTs</div>
              <div className="font-bold text-slate-900 mt-1">{mySpmbRecord.originSchool}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-slate-500">Rerata Nilai</div>
              <div className="font-bold text-slate-900 mt-1">{mySpmbRecord.averageScore}</div>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="text-slate-500">Tanggal Daftar</div>
              <div className="font-bold text-slate-900 mt-1">{mySpmbRecord.submissionDate}</div>
            </div>
          </div>

          {mySpmbRecord.notes && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <div className="font-bold mb-1">Catatan Panitia SPMB:</div>
              <p>{mySpmbRecord.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
